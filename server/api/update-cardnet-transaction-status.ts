import { defineEventHandler, readBody } from 'h3'
import { getToken } from '#auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const secToken = await getToken({ event })

  const {
    session,
  } = body

  const payload: { [key: string]: any } = {}
  payload.session = session

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${secToken?.access_token}`,
  }

  const response = await $fetch(`${process.env.VITE_APP_BASE_URL}/creditcard/api/transactions/updateTransactionPayment`, {
    method: 'POST',
    body: payload,
    headers: defaultHeaders
  })

  return response
})
