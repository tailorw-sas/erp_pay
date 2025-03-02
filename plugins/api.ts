export default defineNuxtPlugin({
  setup() {
    const config = useRuntimeConfig()
    const api = $fetch.create({
      baseURL: config.app.baseURL,
      onResponseError({ response }) {
        console.log(response)
      }
    })

    return {
      provide: {
        api
      }
    }
  }
})
