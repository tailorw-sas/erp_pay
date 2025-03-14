import { defineEventHandler, readBody } from 'h3'
import { getToken } from '#auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const secToken = await getToken({ event })

  const {
    orderNumber, cardNumber, merchantResponse, isoCode, status, paymentDate, employee, employeeId, responseCodeMessage
  } = body

  const payload: { [key: string]: any } = {}
  payload.orderNumber = orderNumber
  payload.cardNumber = cardNumber
  payload.merchantResponse = merchantResponse
  payload.isoCode = isoCode
  payload.status = status
  payload.paymentDate = paymentDate
  payload.employee = employee
  payload.employeeId = employeeId
  payload.responseCodeMessage = responseCodeMessage

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${secToken?.access_token}`,
  }

  const response = await $fetch(`${process.env.VITE_APP_BASE_URL}/creditcard/api/transactions/processMerchantBlueResponse`, {
    method: 'POST',
    body: payload,
    headers: defaultHeaders
  })

  return response
})
