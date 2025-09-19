<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div>
        <div class="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
          <MapPinIcon class="h-8 w-8 text-white" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
          Crear Cuenta
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          O
          <router-link
            to="/login"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            inicia sesión con tu cuenta existente
          </router-link>
        </p>
      </div>

      <!-- Formulario -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Tu nombre completo"
              :disabled="isLoading"
            >
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="tu@email.com"
              :disabled="isLoading"
            >
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Mínimo 6 caracteres"
              :disabled="isLoading"
            >
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Confirma tu contraseña"
              :disabled="isLoading"
            >
          </div>
        </div>

        <div class="flex items-center">
          <input
            id="terms"
            v-model="form.acceptTerms"
            name="terms"
            type="checkbox"
            required
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          >
          <label for="terms" class="ml-2 block text-sm text-gray-900">
            Acepto los
            <a href="#" class="text-primary-600 hover:text-primary-500">términos y condiciones</a>
            y la
            <a href="#" class="text-primary-600 hover:text-primary-500">política de privacidad</a>
          </label>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </span>
            {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </button>
        </div>

        <!-- Divider -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-50 text-gray-500">O regístrate con</span>
            </div>
          </div>

          <!-- Google Register -->
          <div class="mt-6">
            <button
              type="button"
              @click="handleGoogleRegister"
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { MapPinIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'Register',
  components: {
    MapPinIcon
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const appStore = useAppStore()
    
    const isLoading = ref(false)
    const form = reactive({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    })

    const isFormValid = computed(() => {
      return form.name.trim() &&
             form.email.trim() &&
             form.password.length >= 6 &&
             form.password === form.confirmPassword &&
             form.acceptTerms
    })

    const handleSubmit = async () => {
      if (isLoading.value || !isFormValid.value) return
      
      if (form.password !== form.confirmPassword) {
        appStore.showError('Las contraseñas no coinciden')
        return
      }
      
      isLoading.value = true
      
      try {
        await authStore.registerWithEmail(form.email, form.password, form.name)
        router.push('/')
      } catch (error) {
        console.error('Error en registro:', error)
      } finally {
        isLoading.value = false
      }
    }

    const handleGoogleRegister = async () => {
      if (isLoading.value) return
      
      isLoading.value = true
      
      try {
        await authStore.loginWithGoogle()
        router.push('/')
      } catch (error) {
        console.error('Error en registro con Google:', error)
      } finally {
        isLoading.value = false
      }
    }

    return {
      isLoading,
      form,
      isFormValid,
      handleSubmit,
      handleGoogleRegister
    }
  }
}
</script>

