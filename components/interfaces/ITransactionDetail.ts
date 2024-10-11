export interface ITransactionDetailAzul {
    orderNumber: string
    amount: string
    itbis?: string
    authorizationCode?: string
    dateTime?: string
    responseMessage?: string
    isoCode?: string
    cardNumber: string
    rrn?: string
}

export interface ITransactionDetailCardNet {
    orderID?: string
    authorizationCode?: string
    cardNumber: string
    txToken?: string
    responseCode?: string
    retrievalReferenceNumber?: string
    remoteResponseCode?: string
    transactionID?: string
}