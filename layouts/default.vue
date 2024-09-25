<script setup>
import {ref} from 'vue'

const topbarRef = ref(null)

</script>

<template>
  <div class="layout-container bg-home">
    <div class="layout-content-wrapper">
<!--      <Toolbar ref="topbarRef" class="layout-topbar">
        <template #center>
          <img src="/layout/logo-simple-dark.png" alt="Logo" class="topbar-logo" />
        </template>
      </Toolbar>-->
      <div class="layout-content w-full">
        <!-- <NuxtPage /> -->
        <slot/>
      </div>

      <div class="layout-mask"/>
    </div>
  </div>
</template>

<style lang="scss">
html, body, #__nuxt, .layout-container {
  height: 100%;
  margin: 0;
}

.bg-home {
  background-image: url('/layout/images/img-transparent.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
  width: 100%;
}

.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.layout-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.topbar-logo {
  height: 40px; /* Ajusta el tamaño del logo según tu preferencia */
}
</style>
