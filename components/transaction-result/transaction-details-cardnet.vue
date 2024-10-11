<script setup lang="ts">

import type {ITransactionDetailCardNet} from "~/components/interfaces/ITransactionDetail";
import type {PropType} from "vue";

const props = defineProps({
  transactionDetail: {
    type: Object as PropType<ITransactionDetailCardNet>,
    required: true
  }
})

</script>

<template>
  <Card class="" style="background-color: #fff">
    <template #content>
      <h4 class="text-center">
        Transaction Details:
      </h4>
      <Divider />
      <p><strong>Order Id:</strong> {{ props.transactionDetail.orderID }}</p>
      <p><strong>Authorization Code:</strong> {{ props.transactionDetail.authorizationCode }}</p>
      <p><strong>TxToken:</strong> {{ props.transactionDetail.txToken }}</p>
      <p><strong>Response Code:</strong> {{ props.transactionDetail.responseCode}}</p>
      <p><strong>Credit Card Number:</strong> {{ props.transactionDetail.cardNumber }}</p>
      <p><strong>Retrieval Reference Number:</strong> {{ props.transactionDetail.retrievalReferenceNumber }}</p>
      <p><strong>Remote Response Code:</strong> {{ props.transactionDetail.remoteResponseCode }}</p>
      <p><strong>Transaction ID:</strong> {{ props.transactionDetail.transactionID }}</p>
    </template>
  </Card>
</template>

<style scoped lang="scss">

</style>