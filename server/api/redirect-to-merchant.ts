import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const secToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJab0NYdWFfSTJLSkwweFVtUjJJV3JlOFpxV0h1VFVGY3o2MFdsV2Zad19nIn0.eyJleHAiOjE3MjgxNjc3MDYsImlhdCI6MTcyODA1OTcwNiwianRpIjoiYWU2ZmZkZDUtM2M3Yi00ZDVkLWFlODItYjVkMTNhOTViODNjIiwiaXNzIjoiaHR0cHM6Ly9hdXRoZGV2LnRhaWxvcncubmV0L3JlYWxtcy9FcnAiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiZDBlNDNjMzUtMzc2Mi00MjZiLThlZGItNDlhNjY4MGVmOTNiIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibG9naW4tYXBwIiwic2lkIjoiMWIzMzViZjMtODdjMy00YjE2LWEzZmYtYzAzMWEzYWUzMzUwIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vZ2F0ZXdheS1zZXJ2aWNlOjgwODAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLWVycCJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImxvZ2luLWFwcCI6eyJyb2xlcyI6WyJBRE1JTiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJBZG1pbiBUYWlsb3J3IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRtaW5AdGFpbG9ydy5jb20iLCJnaXZlbl9uYW1lIjoiQWRtaW4iLCJmYW1pbHlfbmFtZSI6IlRhaWxvcnciLCJlbWFpbCI6ImFkbWluQHRhaWxvcncuY29tIn0.SmSKPgXHg32gx-0IIzjMJjpsrcylB3H_XM526CrebEcXDTPMhq6nJ702WFqdYTwdc0p_3BGXjQ4JloCR6EJlO8_mizzw4XbIHRbqd7CSR8dR_t3VQKSWSkDwavm-NINCju4Rs5tv6MDIUIjrPi5jYIAxjd4dpnNjsdH40G6f1r-IvRY8AwdLqEE_-GmDyh-KwGVvPPwqY9TuK1PX8S8Xx_oMZT58mnVKSef01oAa7WivMDA_L9Vj1N2OD6uDjzZDB3ipWGyOvy9ab9hC8mKZUlf37SrAa3NjMSpHMfWePuAM7XeYSg9yPO2Cr7TEo5Kt9TsDqFECnOx0BEzpgGPIHQ'

  const {
    token,
  } = body

  const payload: { [key: string]: any } = {}
  payload.token = token

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${secToken}`,
  }

  const response = await $fetch(`${process.env.VITE_APP_BASE_URL}/creditcard/api/transactions/redirectTypeLink`, {
    method: 'POST',
    body: payload,
    headers: defaultHeaders
  })

  return response
})
