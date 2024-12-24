<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {type LocationQuery, useRoute, useRouter} from 'vue-router'
import dayjs from 'dayjs'
import {
  ENUM_TRANSACTION_STATUS,
  type ITransactionDetailAzul,
  type ITransactionDetailCardNet,
  type IUpdateTransactionStatusAzul
} from '~/components/interfaces/ITransactionDetail';
import {useTransactionStore} from "~/stores/transaction";

useHead({
  title: 'Process transaction',
});

const transactionStore = useTransactionStore()
const { userData } = useAuthStore()
const isLoading = ref(true) // Nuevo estado de carga
const errorOccurred = ref(false) // Si ocurre algun error en el api
const errorMessage = ref('')
const transactionStatus = ref<ENUM_TRANSACTION_STATUS>()
const transactionStatusMessage = ref<string>('')
const showDetails = ref(false)
const isCardNet = ref(false)

const route = useRoute()
const {$customFetch} = useNuxtApp()

async function updateTransactionStatus(routeQuery: LocationQuery, userId: string) {
  if (isCardNet.value) { //CardNet
    await updateCardNetTransaction(routeQuery.session, userId)
  } else {
    const status = String(routeQuery.status || '').toUpperCase()
    if (status === 'SUCCESS' || status === 'DECLINED') {
      const url = route.fullPath
      const startIndex = url.indexOf('OrderNumber');
      const substringFromOrderNumber = (startIndex > 0) ? url.substring(startIndex) : '';
      const responseCodeMessage = `${routeQuery.IsoCode}, ${routeQuery.ResponseMessage}${routeQuery.ErrorDescription ? `: ${routeQuery.ErrorDescription}` : ''}`
      const data: IUpdateTransactionStatusAzul = {
        orderNumber: String(routeQuery.OrderNumber || ''),
        cardNumber: String(routeQuery.CardNumber || ''),
        merchantResponse: substringFromOrderNumber,
        isoCode: String(routeQuery.IsoCode || ''),
        status: status,
        paymentDate: dayjs(String(routeQuery.DateTime), 'YYYYMMDDHHmmss').format('YYYY-MM-DDTHH:mm:ss') || '',
        employee: userData?.data?.name || 'Anonymous',
        employeeId: userId,
        responseCodeMessage: responseCodeMessage
      }
      await updateAzulTransaction(data, routeQuery)
    } else {
      // Deshabilitar pantalla de carga si es cancelled
      isLoading.value = false
    }
  }
}

async function getUserId() {
  isLoading.value = true
  if (userData?.data?.userId) {
    return userData?.data?.userId
  }
  else {
    const data = await getUserMe()
    return data?.userId
  }
}

async function getUserMe() {
  try {
    const response: any = await $customFetch('/api/user/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return response.data
  } catch (error: any) {
  }
}

async function updateCardNetTransaction(sessionData: any, userId: string) {
  isLoading.value = true
  const data = {
    session: sessionData,
    employee: userData?.data?.name,
    employeeId: userId,
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
    if (result.merchantStatus) {
      transactionStatus.value = ENUM_TRANSACTION_STATUS[result.merchantStatus.status.toUpperCase() as keyof typeof ENUM_TRANSACTION_STATUS];
      transactionStatusMessage.value = result.merchantStatus.description
    }
    const cardNetResponse: ITransactionDetailCardNet = {
      orderID: result.OrdenID,
      authorizationCode: result.AuthorizationCode,
      txToken: result.TxToken,
      responseCode: result.ResponseCode,
      cardNumber: result.CreditcardNumber,
      retrievalReferenceNumber: result.RetrivalReferenceNumber,
      remoteResponseCode: result.RemoteResponseCode,
      transactionID: result.TransactionID,
      resultStatus: transactionStatus.value || ENUM_TRANSACTION_STATUS.CANCELLED,
      resultMessage: transactionStatusMessage.value,
      isCardNet: true,
    }
    // guardar result en el store
    transactionStore.setTransactionData(cardNetResponse)
    navigateTo('/transaction-result', { replace: true })
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
    const errorMessage = String(routeQuery.ErrorDescription)
    if (errorMessage) {
      transactionStatusMessage.value = errorMessage
    }
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
      itbis: (Number.parseFloat(String(routeQuery.Itbis)) / 100).toFixed(2) || '0.00',
      resultStatus: transactionStatus.value || ENUM_TRANSACTION_STATUS.CANCELLED,
      resultMessage: transactionStatusMessage.value,
      isCardNet: false
    }
    transactionStore.setTransactionData(azulResponse)
    navigateTo('/transaction-result', { replace: true })

  } catch (error: any) {
    errorMessage.value = error.data.data.error.errorMessage || 'Error on merchant redirect'
    errorOccurred.value = true
    // toast.add({severity: 'error', summary: 'Error', detail: errorMessage, life: 0})
  } finally {
    isLoading.value = false
  }

}

onMounted(async () => {
  const status = String(route.query.status || 'error')
  transactionStatus.value = ENUM_TRANSACTION_STATUS[status.toUpperCase() as keyof typeof ENUM_TRANSACTION_STATUS]; // Asignar el estado recibido a transactionStatus
  isCardNet.value = route.query.session !== null && route.query.session !== undefined
  const userId = await getUserId()
  updateTransactionStatus(route.query, userId)
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
