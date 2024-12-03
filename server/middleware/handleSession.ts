import { defineEventHandler, getRequestHeader, readBody, sendRedirect } from 'h3'

export default defineEventHandler(async (event) => {
  const contentType = getRequestHeader(event, 'content-type')
  const isFormUrlEncoded = contentType && contentType.includes('application/x-www-form-urlencoded')
  const reqUrl = event.node.req.url ?? '' // Obtener la URL de la solicitud

  // Verifica si el contenido es application/x-www-form-urlencoded
  if (isFormUrlEncoded && reqUrl.includes('process-transaction')) {
    const body = await readBody(event) // Captura el body del formData

    if (body.SESSION) {
      // Guardamos la session para usarla en la redirección
      const session = body.SESSION

      // Eliminamos la session del cuerpo del evento (aunque no lo usamos directamente)
      delete body.SESSION

      // Realizamos la redirección sin volver a enviar la session en el cuerpo
      return sendRedirect(event, `/process-transaction?status=success&session=${session}`, 301)
    }
  }
  if (reqUrl.includes('process-transaction') && reqUrl.includes('&OrderNumber')) {
    return sendRedirect(event, reqUrl, 301)
  }
})