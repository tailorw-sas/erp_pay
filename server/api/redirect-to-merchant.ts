import { defineEventHandler, readBody } from 'h3'
import { getToken } from '#auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const secToken = await getToken({ event })

  const {
    token,
  } = body

  const payload: { [key: string]: any } = {}
  payload.token = token

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${secToken?.access_token}`,
  }

  const response = await $fetch(`${process.env.VITE_APP_BASE_URL}/creditcard/api/transactions/redirectTypeLink`, {
    method: 'POST',
    body: payload,
    headers: defaultHeaders
  })

  return response
})
