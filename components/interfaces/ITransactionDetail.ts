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
    isCardNet: boolean,
    resultStatus: ENUM_TRANSACTION_STATUS,
    resultMessage?: string
}

export interface ITransactionDetailCardNet {
    orderID?: string
    authorizationCode?: string
    cardNumber: string
    txToken?: string
    responseCode?: string
    retrievalReferenceNumber?: string
    remoteResponseCode?: string
    transactionID?: string,
    isCardNet: boolean,
    resultStatus: ENUM_TRANSACTION_STATUS,
    resultMessage?: string
}

export interface IUpdateTransactionStatusAzul {
    orderNumber: string
    cardNumber: string
    merchantResponse: string
    isoCode: string
    status: string,
    paymentDate: string,
    employee?: string | null | undefined,
    responseCodeMessage: string
}

export enum ENUM_TRANSACTION_STATUS {
    SUCCESS = 'success',
    DECLINED = 'declined',
    CANCELLED = 'cancelled',
}