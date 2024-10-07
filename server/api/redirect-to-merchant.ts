import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const secToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJab0NYdWFfSTJLSkwweFVtUjJJV3JlOFpxV0h1VFVGY3o2MFdsV2Zad19nIn0.eyJleHAiOjE3Mjg0MjI5NDUsImlhdCI6MTcyODMxNDk0NSwianRpIjoiNGQ1NDU1ZmEtZGQ2ZS00Mjg1LWFlNDctNjJhOTZiZmQ3NmJmIiwiaXNzIjoiaHR0cHM6Ly9hdXRoZGV2LnRhaWxvcncubmV0L3JlYWxtcy9FcnAiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiZDBlNDNjMzUtMzc2Mi00MjZiLThlZGItNDlhNjY4MGVmOTNiIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibG9naW4tYXBwIiwic2lkIjoiZTc2Nzg2YjMtMzMyZi00MTE5LWFjODgtY2MxMWUzNTNlYjUzIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vZ2F0ZXdheS1zZXJ2aWNlOjgwODAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLWVycCJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImxvZ2luLWFwcCI6eyJyb2xlcyI6WyJBRE1JTiJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJBZG1pbiBUYWlsb3J3IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRtaW5AdGFpbG9ydy5jb20iLCJnaXZlbl9uYW1lIjoiQWRtaW4iLCJmYW1pbHlfbmFtZSI6IlRhaWxvcnciLCJlbWFpbCI6ImFkbWluQHRhaWxvcncuY29tIn0.muRM6ayXR3GTqkBw3AEq722KJEwQNeicXMVdCBbQBmv1NmT3ShCTJPfSI-N6XQDwCa9A9y1OiWn5ysV485CDifgNQ2zrJ_yuYqJ1l9nIUYkROiM-7Oq2GKkIat_PSBJ1YqCVvvrbMRNETIZAweN67vVYzM93enaHHVeVLf10jAz3kJiuzak0mmZsD8dPbebbNSCl05PH-8qFHtIZt1NWb9yWZvFcrBJI-EWDFAeIEWSBj1pY2h-QBUmg5434XC6mTriy6ZQGRfYn26-47fk8BdihSU-Wruh0reIXHr6rhmacVrZGFY0zmzGEySpObAAbOUaDJFTfj4K2uqHGmMH8YA'

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
