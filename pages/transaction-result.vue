<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {type LocationQuery, useRoute, useRouter} from 'vue-router'
import dayjs from 'dayjs'
import {
  type ITransactionDetailAzul,
  type ITransactionDetailCardNet,
  type IUpdateTransactionStatusAzul
} from '~/components/interfaces/ITransactionDetail';
import TransactionDetailsCardnet from "~/components/transaction-result/transaction-details-cardnet.vue";
import TransactionDetailsAzul from "~/components/transaction-result/transaction-details-azul.vue";

useHead({
  title: 'Transaction result',
});

enum ENUM_TRANSACTION_STATUS {
  SUCCESS = 'success',
  DECLINED = 'declined',
  CANCELLED = 'cancelled',
}

const { data: userData } = useAuth()
const isLoading = ref(true) // Nuevo estado de carga
const errorOccurred = ref(false) // Si ocurre algun error en el api
const errorMessage = ref('')
const transactionStatus = ref<ENUM_TRANSACTION_STATUS>()
const transactionStatusMessage = ref<string>('')
const showDetails = ref(false)
const isCardNet = ref(false)

const route = useRoute()
const router = useRouter()
const {$customFetch} = useNuxtApp()
const toast = useToast()
const transactionDetailCardNet = ref<ITransactionDetailCardNet>({
  cardNumber: ''
})
const transactionDetailAzul = ref<ITransactionDetailAzul>({
  orderNumber: '',
  cardNumber: '',
  amount: ''
})

function getDefaultTransactionMessage() {
  if (transactionStatus.value == ENUM_TRANSACTION_STATUS.SUCCESS) {
    transactionStatusMessage.value = 'We have successfully processed your payment.'
  }
  if (transactionStatus.value == ENUM_TRANSACTION_STATUS.DECLINED) {
    transactionStatusMessage.value = 'Your payment was declined. Please try again.'
  }
  if (transactionStatus.value == ENUM_TRANSACTION_STATUS.CANCELLED) {
    transactionStatusMessage.value = 'The transaction was cancelled.'
  }
}

async function updateTransactionStatus(routeQuery: LocationQuery) {
  if (isCardNet.value) { //CardNet
    await updateCardNetTransaction(routeQuery.session)
  } else {
    const status = String(routeQuery.status || '').toUpperCase()
    if (status === 'SUCCESS' || status === 'DECLINED') {
      const url = route.fullPath
      const startIndex = url.indexOf('OrderNumber');
      const substringFromOrderNumber = (startIndex > 0) ? url.substring(startIndex) : '';
      const data: IUpdateTransactionStatusAzul = {
        orderNumber: String(routeQuery.OrderNumber || ''),
        cardNumber: String(routeQuery.CardNumber || ''),
        merchantResponse: substringFromOrderNumber,
        isoCode: String(routeQuery.IsoCode || ''),
        status: status,
        paymentDate: dayjs(String(routeQuery.DateTime), 'YYYYMMDDHHmmss').format('YYYY-MM-DDTHH:mm:ss') || '',
        employee: userData?.value?.user?.name || 'Anonymous',
      }
      await updateAzulTransaction(data, routeQuery)
    } else {
      // Deshabilitar pantalla de carga si es cancelled
      isLoading.value = false
    }
  }
}

async function updateCardNetTransaction(sessionData: any) {
  isLoading.value = true
  const data = {
    session: sessionData,
    employee: userData?.value?.user?.name || 'Anonymous',
  }
  try {
    const response: any = await $customFetch('/api/update-cardnet-transaction-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const result = response.result
    const cardNetResponse: ITransactionDetailCardNet = {
      orderID: result.OrdenID,
      authorizationCode: result.AuthorizationCode,
      txToken: result.TxToken,
      responseCode: result.ResponseCode,
      cardNumber: result.CreditcardNumber,
      retrievalReferenceNumber: result.RetrivalReferenceNumber,
      remoteResponseCode: result.RemoteResponseCode,
      transactionID: result.TransactionID
    }
    transactionDetailCardNet.value = cardNetResponse
    if (result.merchantStatus) {
      transactionStatus.value = ENUM_TRANSACTION_STATUS[result.merchantStatus.status.toUpperCase() as keyof typeof ENUM_TRANSACTION_STATUS];
      transactionStatusMessage.value = result.merchantStatus.description
    }
  } catch (error: any) {
    errorMessage.value = error.data?.data?.error?.errorMessage || 'Error on payment confirmation, please try again'
    errorOccurred.value = true
    // toast.add({severity: 'error', summary: 'Error', detail: errorMessage, life: 0})
  } finally {
    isLoading.value = false
  }

}

async function updateAzulTransaction(data: IUpdateTransactionStatusAzul, routeQuery: LocationQuery) {
  isLoading.value = true

  try {
    const response: any = await $customFetch('/api/update-azul-transaction-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const result = response.result
    const errorMessage = String(routeQuery.ErrorDescription)
    const azulResponse: ITransactionDetailAzul = {
      amount: (Number.parseFloat(String(routeQuery.Amount)) / 100).toFixed(2) || '0.00',
      orderNumber: String(routeQuery.OrderNumber) || '',
      cardNumber: String(routeQuery.CardNumber) || '',
      rrn: String(routeQuery.RRN) || '',
      authorizationCode: String(routeQuery.AuthorizationCode) || '',
      errorDescription: errorMessage,
      dateTime: dayjs(String(routeQuery.DateTime), 'YYYYMMDDHHmmss').format('YYYY/MM/DD HH:mm') || '',
      isoCode: String(routeQuery.IsoCode) || '',
      responseMessage: String(routeQuery.ResponseMessage) || '',
      itbis: (Number.parseFloat(String(routeQuery.Itbis)) / 100).toFixed(2) || '0.00'
    }
    transactionDetailAzul.value = azulResponse
    if (errorMessage) {
      transactionStatusMessage.value = errorMessage
    }
  } catch (error: any) {
    errorMessage.value = error.data.data.error.errorMessage || 'Error on merchant redirect'
    errorOccurred.value = true
    // toast.add({severity: 'error', summary: 'Error', detail: errorMessage, life: 0})
  } finally {
    isLoading.value = false
  }

}

onMounted(() => {
  const status = String(route.query.status || 'error')
  transactionStatus.value = ENUM_TRANSACTION_STATUS[status.toUpperCase() as keyof typeof ENUM_TRANSACTION_STATUS]; // Asignar el estado recibido a transactionStatus
  getDefaultTransactionMessage()
  isCardNet.value = route.query.session !== null && route.query.session !== undefined
  updateTransactionStatus(route.query)
  // isLoading.value = false // Los datos han sido cargados
})

function toggleDetails() {
  showDetails.value = !showDetails.value
}
</script>

<template>
  <div class="transaction-result">
    <Card v-if="isLoading" class="loading-card card-bg-color">
      <template #content>
        <div class="loading-container">
          <ProgressSpinner style="width: 50px; height: 50px;" stroke-width="4" animation-duration=".5s"/>
          <p class="loading-text">
            Processing your transaction, please wait...
          </p>
        </div>
      </template>
    </Card>
    <Card v-else-if="errorOccurred" class="card card-bg-color" style="width: 500px">
      <template #content>
        <div class="flex flex-column align-items-center">
          <div class="flex flex-column align-items-center">
            <i class="pi pi-times-circle mt-2 mb-2" style="font-size: 4rem; color: red;"/>
            <h2 class="mt-2 mb-2">Error Occurred</h2>
            <p class="mt-2 mb-2">{{errorMessage}}</p>
          </div>
        </div>
      </template>
    </Card>
    <Card v-else class="card card-bg-color" style="width: 500px">
      <template #content>
        <div class="flex flex-column align-items-center">
          <div class="flex flex-column align-items-center mb-4">
            <i v-if="transactionStatus === ENUM_TRANSACTION_STATUS.SUCCESS" class="pi pi-check-circle"
               style="font-size: 4rem; color: #0F8BFD;"/>
            <i v-if="transactionStatus === ENUM_TRANSACTION_STATUS.CANCELLED" class="pi pi-times-circle"
               style="font-size: 4rem; color: red;"/>
            <i v-if="transactionStatus === ENUM_TRANSACTION_STATUS.DECLINED" class="pi pi-exclamation-circle"
               style="font-size: 4rem; color: orange;"/>
            <h2>
              {{
                transactionStatus === ENUM_TRANSACTION_STATUS.SUCCESS ? 'Transaction Successful!'
                    : transactionStatus === ENUM_TRANSACTION_STATUS.DECLINED ? 'Transaction Declined'
                        : 'Transaction Cancelled'
              }}
            </h2>
            <p class="text-center">{{transactionStatusMessage}}</p>
          </div>
          <Button label="Show Details" icon="pi pi-chevron-down" style="margin-right: 2px;" @click="toggleDetails"
                  v-if="transactionStatus === ENUM_TRANSACTION_STATUS.SUCCESS || transactionStatus === ENUM_TRANSACTION_STATUS.DECLINED"/>
        </div>
        <div v-if="showDetails" class="details-card">
          <TransactionDetailsCardnet v-if="isCardNet" :transaction-detail="transactionDetailCardNet"/>
          <TransactionDetailsAzul v-else :transaction-detail="transactionDetailAzul"/>
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped lang="scss">
.transaction-result {
  display: flex;
  justify-content: center;
  align-items: center;
  //height: 100vh;
}

.transaction-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.transaction-card {
  width: 500px;
  text-align: center;
}

.header h2 {
  margin: 10px 0;
}

.buttons {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.details-card {
  text-align: left;
  margin-top: 20px;
}

.details-card p {
  margin: 5px 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-text {
  margin-top: 20px;
  font-size: 1.2rem;
  color: #555;
}

.card-bg-color {
  background-color: #ececf9;
}
</style>
