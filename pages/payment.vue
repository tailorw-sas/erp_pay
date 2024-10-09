<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const isLoading = ref(false) // Nuevo estado de carga

const route = useRoute()
const toast = useToast()
const { $customFetch } = useNuxtApp()

function disableBackNavigation() {
  history.pushState(null, document.title, location.href)
  history.back()
  history.forward()
  window.onpopstate = function () {
    history.go(1)
  }
}

async function handleMerchantRedirect(tokenInfo: any) {
  isLoading.value = true
  const data = {
    token: tokenInfo,
  }
  try {
    const response: any = await $customFetch('/api/redirect-to-merchant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const htmlBody = response.result

    // Reemplazar el contenido de la página actual con el HTML recibido
    document.open(); // Abre el documento actual para escribir en él
    document.write(await htmlBody); // Escribe el contenido nuevo
    document.close(); // Cierra el documento para renderizar el nuevo contenido
  }
  catch (error: any) {
    const errorMessage = error.data.data.error.errorMessage || 'Error on merchant redirect'
    toast.add({ severity: 'error', summary: 'Error', detail: errorMessage, life: 0 })
  }
  finally {
    isLoading.value = false
  }

}

onMounted(() => {
  // disableBackNavigation()
  const token = route.query.token
  if (token) {
    handleMerchantRedirect(token)
  }
})
</script>

<template>
  <div class="transaction-result">
    <Card v-if="isLoading" class="loading-card card-bg-color">
      <template #content>
        <div class="loading-container">
          <ProgressSpinner style="width: 50px; height: 50px;" stroke-width="4" animation-duration=".5s" />
          <p class="loading-text">
            Processing your transaction, please wait...
          </p>
        </div>
      </template>
    </Card>
    <Toast />
  </div>
</template>

<style scoped lang="scss">
.transaction-result {
  display: flex;
  justify-content: center;
  align-items: center;
  //height: 100vh;
}
.transaction-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.transaction-card {
  width: 500px;
  text-align: center;
}

.header h2 {
  margin: 10px 0;
}

.buttons {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.details-card {
  text-align: left;
  margin-top: 20px;
}

.details-card p {
  margin: 5px 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-text {
  margin-top: 20px;
  font-size: 1.2rem;
  color: #555;
}

.card-bg-color {
  background-color: #ececf9;
}
</style>
