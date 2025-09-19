<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <div class="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
          <MapPinIcon class="h-8 w-8 text-white" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Iniciar Sesión
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          O
          <router-link
            to="/register"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            crea una cuenta nueva
          </router-link>
        </p>
      </div>

      <!-- Formulario -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Email"
              :disabled="isLoading"
            >
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Contraseña"
              :disabled="isLoading"
            >
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Recordarme
            </label>
          </div>

          <div class="text-sm">
            <router-link
              to="/forgot-password"
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              ¿Olvidaste tu contraseña?
            </router-link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </span>
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </div>

        <!-- Divider -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-50 text-gray-500">O continúa con</span>
            </div>
          </div>

          <!-- Google Login -->
          <div class="mt-6">
            <button
              type="button"
              @click="handleGoogleLogin"
              :disabled="isLoading"
              class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="ml-2">Google</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { MapPinIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'Login',
  components: {
    MapPinIcon
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    
    const isLoading = ref(false)
    const form = reactive({
      email: '',
      password: '',
      rememberMe: false
    })

    const handleSubmit = async () => {
      if (isLoading.value) return
      
      isLoading.value = true
      
      try {
        await authStore.loginWithEmail(form.email, form.password)
        
        // Redireccionar a la página solicitada o al home
        const redirectTo = route.query.redirect || '/'
        router.push(redirectTo)
      } catch (error) {
        console.error('Error en login:', error)
      } finally {
        isLoading.value = false
      }
    }

    const handleGoogleLogin = async () => {
      if (isLoading.value) return
      
      isLoading.value = true
      
      try {
        await authStore.loginWithGoogle()
        
        // Redireccionar a la página solicitada o al home
        const redirectTo = route.query.redirect || '/'
        router.push(redirectTo)
      } catch (error) {
        console.error('Error en login con Google:', error)
      } finally {
        isLoading.value = false
      }
    }

    return {
      isLoading,
      form,
      handleSubmit,
      handleGoogleLogin
    }
  }
}
</script>

