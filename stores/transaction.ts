import { defineStore } from 'pinia'
import type {ITransactionDetailAzul, ITransactionDetailCardNet} from "~/components/interfaces/ITransactionDetail";

export const useTransactionStore = defineStore('transaction', {
    state: () => ({
        transactionData: null as ITransactionDetailAzul | ITransactionDetailCardNet | null, // Define la estructura de tus datos
    }),
    actions: {
        setTransactionData(data: ITransactionDetailAzul | ITransactionDetailCardNet) {
            this.transactionData = data
        },
    },
})