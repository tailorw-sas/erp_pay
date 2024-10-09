export default defineNuxtPlugin({
  setup() {
    const auth = useAuth()
    const customFetch = $fetch.create({
      async onRequest({ options }) {
        // Verificar si el usuario está autenticado
        if (!auth.data.value) {
          // console.log('Usuario no autenticado, iniciando sesión...')
          await auth.signIn('credentials', { redirect: false })
        }
      },
      onResponse({ response }) {
        // Manejo de respuestas, si es necesario
        return response._data
      },
      onResponseError({ response }) {
        // Manejo de errores en la respuesta
        // console.error('Error en la respuesta de la API:', response)
      }
    })

    return {
      provide: {
        customFetch
      }
    }
  }
})
