<template>
  <div class="h-screen bg-gray-50">
    <div class="text-center py-12">
      <MapIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">Mapa</h3>
      <p class="mt-1 text-sm text-gray-500">
        Esta funcionalidad está en desarrollo.
      </p>
      <div class="mt-6">
        <router-link
          to="/"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Volver al Inicio
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { MapIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'Map',
  components: {
    MapIcon
  }
}
</script>

