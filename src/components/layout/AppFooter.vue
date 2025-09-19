<template>
  <footer class="bg-white border-t border-gray-200">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <!-- Logo y descripción -->
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
            <MapPinIcon class="w-4 h-4 text-white" />
          </div>
          <span class="text-sm text-gray-600">
            Maps App - Tracking en tiempo real
          </span>
        </div>

        <!-- Links -->
        <div class="flex items-center space-x-6">
          <router-link
            to="/about"
            class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Acerca de
          </router-link>
          <a
            href="#"
            class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Privacidad
          </a>
          <a
            href="#"
            class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Términos
          </a>
        </div>

        <!-- Copyright -->
        <div class="text-sm text-gray-400">
          © {{ currentYear }} Maps App. Todos los derechos reservados.
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed } from 'vue'
import { MapPinIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'AppFooter',
  components: {
    MapPinIcon
  },
  setup() {
    const currentYear = computed(() => new Date().getFullYear())

    return {
      currentYear
    }
  }
}
</script>

