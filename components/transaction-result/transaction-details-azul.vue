<script setup lang="ts">

import type {ITransactionDetailAzul, ITransactionDetailCardNet} from "~/components/interfaces/ITransactionDetail";
import type {PropType} from "vue";

const props = defineProps({
  transactionDetail: {
    type: Object as PropType<ITransactionDetailAzul>,
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
      <p><strong>Order Number:</strong> {{ props.transactionDetail.orderNumber }}</p>
      <p><strong>Amount:</strong> {{ props.transactionDetail.amount }}</p>
      <p><strong>ITBIS:</strong> {{ props.transactionDetail.itbis }}</p>
      <p><strong>Authorization Code:</strong> {{ props.transactionDetail.authorizationCode }}</p>
      <p><strong>Date and Time:</strong> {{ props.transactionDetail.dateTime }}</p>
      <p><strong>Merchant Response:</strong> {{ props.transactionDetail.responseMessage }} ({{ props.transactionDetail.isoCode }})</p>
      <p v-if="props.transactionDetail.errorDescription"><strong>Error Description:</strong> {{ props.transactionDetail.errorDescription }}</p>
      <p><strong>Reference Number:</strong> {{ props.transactionDetail.rrn }}</p>
      <p><strong>Card Number:</strong> {{ props.transactionDetail.cardNumber }}</p>
    </template>
  </Card>
</template>

<style scoped lang="scss">

</style>