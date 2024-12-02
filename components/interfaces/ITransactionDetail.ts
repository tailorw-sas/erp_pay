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
    errorDescription?: string
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

export interface IUpdateTransactionStatusAzul {
    orderNumber: string
    cardNumber: string
    merchantResponse: string
    isoCode: string
    status: string,
    paymentDate: string,
    employee?: string | null | undefined,
}