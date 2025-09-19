<template>
  <div class="min-h-screen bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
    <div class="max-w-max mx-auto">
      <main class="sm:flex">
        <p class="text-4xl font-bold text-primary-600 sm:text-5xl">404</p>
        <div class="sm:ml-6">
          <div class="sm:border-l sm:border-gray-200 sm:pl-6">
            <h1 class="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
              Página no encontrada
            </h1>
            <p class="mt-1 text-base text-gray-500">
              Lo sentimos, no pudimos encontrar la página que buscas.
            </p>
          </div>
          <div class="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
            <router-link
              to="/"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Ir al inicio
            </router-link>
            <button
              @click="goBack"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Volver atrás
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NotFound',
  setup() {
    const router = useRouter()

    const goBack = () => {
      if (window.history.length > 1) {
        router.go(-1)
      } else {
        router.push('/')
      }
    }

    return {
      goBack
    }
  }
}
</script>

