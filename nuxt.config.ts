// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    'nuxt-primevue',
    '@sidebase/nuxt-auth',
    '@pinia/nuxt',
  ],
  auth: {
    globalAppMiddleware: {
      isEnabled: false
    }
  },
  css: [
      'primevue/resources/themes/aura-light-blue/theme.css'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler' // o "modern"
        }
      }
    }
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon-default.ico' }
      ]
    }
  }
})
