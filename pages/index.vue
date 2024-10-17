<script setup lang="ts">
definePageMeta({
  layout: 'empty'
})
useHead({
  title: 'Home',
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Sansita+One&display=swap',
    },
  ],
})

const objTitle = ref({
  title: 'The best ally to',
  title2: 'transform your data into strategies!',
  slogan: 'We drive your growth quickly and safely!',
})
</script>
<template>
  <div class="bg-home">
    <div style="height: 85vh;" class="flex flex-column align-items-center justify-content-end">
      <!-- TITLE -->
      <div class="text-center font-text container-home-title">
        <div class="title-home text-900 mb-1 font-bold">
          {{ objTitle.title }}
        </div>
        <div class="font-bold container-title">
          <div class="blue-line bar-top" />
          <div class="blue-line bar-center" />
          <div class="blue-line bar-bottom" />
          <div class="custom-title w-full">
            {{ objTitle.title2 }}
          </div>
        </div>

        <div class="title-home text-900 mb-1 font-bold">
          {{ objTitle.slogan }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
html, body, #__nuxt, .layout-container {
  height: 100%;
  margin: 0;
}

.font-text {
  font-family: 'Sansita One', sans-serif;
}

.blue-line {
  height: 20px;
  border-radius: 50px;
  width: 90%;
  background-color: #0F8BFD;
}

.container-title {
  position: relative;
  text-align: center;
  color: #000;
  font-weight: bold;
  margin-bottom: 35px;
  margin-top: 35px;
  font-size: 1.8rem;
}

.bar-top{
  position: relative;
  margin-left: 5%;
}
.bar-center{
  position: relative;
  margin-left: 10%;
}
.bar-bottom{
  position: relative;
  margin-left: 0;
}
.custom-title {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  padding: 0 10px;
  z-index: 10;
}

.container-home-title {
  margin-top: 20px;
  width: 58%;
  opacity: 0.9;
}

.bg-home {
  background-image: url('/layout/images/home.jpg');
  background-size: 100% 100%; /* Estira la imagen al 100% del ancho y alto */
  background-repeat: no-repeat;
  background-position: center;
  height: 100vh; /* Asegura que ocupe todo el viewport */
  width: 100vw;
}

.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

@media (max-width: 640px) { /* sm */
  .container-home-title {
    width: 90%;
  }

  .bar-center {
    display: none;
  }

  .bar-top {
    justify-self: center;
    width: 100%;
  }

  .bar-bottom {
    margin-left: 0%;
    width: 100%;
  }

  .title-home {
    font-size: 1.75rem;
    text-align: center;
  }

  .text-5xl {
    font-size: 1.75rem; /* Ajusta el tamaño del texto */
  }

  .container-title {
    font-size: 1.55rem; /* Ajusta el tamaño del texto */
  }
}

@media (min-width: 641px) and (max-width: 768px) { /* md */
  container-home-title {
    width: 100%;
  }

  .title-home {
    font-size: 1.75rem; /* Ajusta el tamaño del texto */
  }

  .text-5xl {
    font-size: 1.75rem; /* Ajusta el tamaño del texto */
  }

  .container-title {
    font-size: 1.75rem; /* Ajusta el tamaño del texto */
  }
}

@media (min-width: 769px) and (max-width: 1024px) { /* lg */
  container-home-title {
    width: 100%;
  }

  .bar-center {
    width: 100%;
    margin-left: 0%;
  }
  .bar-bottom {
    margin-left: 5%;
    width: 90%;
  }

  .title-home {
    font-size: 1.7rem; /* Ajusta el tamaño del texto */
  }

  .text-5xl {
    font-size: 1.7rem; /* Ajusta el tamaño del texto */
  }

  .container-title {
    font-size: 1.7rem; /* Ajusta el tamaño del texto */
  }
}

@media (min-width: 1025px) and (max-width: 1280px) { /* xl */
  .title-home {
    font-size: 1.7rem; /* Ajusta el tamaño del texto */
  }

  .text-5xl {
    font-size: 1.7rem; /* Ajusta el tamaño del texto */
  }

  .container-title {
    font-size: 1.7rem; /* Ajusta el tamaño del texto */
  }
}

@media (min-width: 1281px) { /* xxl */
  .title-home {
    font-size: 1.7rem; /* Ajusta el tamaño del texto */
  }

  .text-5xl {
    font-size: 1.7rem; /* Ajusta el tamaño del texto */
  }

  .container-title {
    font-size: 1.7rem; /* Ajusta el tamaño del texto */
  }
}
</style>