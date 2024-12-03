<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {type LocationQuery, useRoute, useRouter} from 'vue-router'
import {
  type ITransactionDetailAzul,
  type ITransactionDetailCardNet
} from '~/components/interfaces/ITransactionDetail';
import TransactionDetailsCardnet from "~/components/transaction-result/transaction-details-cardnet.vue";
import TransactionDetailsAzul from "~/components/transaction-result/transaction-details-azul.vue";
import {useTransactionStore} from "~/stores/transaction";

useHead({
  title: 'Transaction result',
});

enum ENUM_TRANSACTION_STATUS {
  SUCCESS = 'success',
  DECLINED = 'declined',
  CANCELLED = 'cancelled',
}

const transactionStore = useTransactionStore()
const isLoading = ref(true) // Nuevo estado de carga
const transactionStatus = ref<ENUM_TRANSACTION_STATUS>()
const transactionStatusMessage = ref<string>('')
const showDetails = ref(false)
const isCardNet = ref(false)
const transactionData = ref<ITransactionDetailAzul | ITransactionDetailCardNet | null>()

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

async function loadTransactionResult() {
  try {
    isLoading.value = true
    transactionStore.loadTransactionData() //cargar la data del localstorage
    transactionData.value = transactionStore.transactionData
    console.log(transactionData.value)
    isCardNet.value = transactionData.value?.isCardNet || false
    if (transactionData.value?.resultStatus) {
      transactionStatus.value = transactionData.value?.resultStatus
    }
    if (transactionData.value?.resultMessage) {
      transactionStatusMessage.value = transactionData.value?.resultMessage
    }
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getDefaultTransactionMessage()
  loadTransactionResult()
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
          <TransactionDetailsCardnet v-if="isCardNet" :transaction-detail="transactionData as ITransactionDetailCardNet"/>
          <TransactionDetailsAzul v-else :transaction-detail="transactionData as ITransactionDetailAzul"/>
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
