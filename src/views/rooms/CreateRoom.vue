<template>
  <div class="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Crear Room</h1>
        
        <div class="text-center py-12">
          <PlusIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Crear Room</h3>
          <p class="mt-1 text-sm text-gray-500">
            Esta funcionalidad está en desarrollo.
          </p>
          <div class="mt-6 space-x-3">
            <router-link
              to="/rooms"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Volver a Rooms
            </router-link>
            <router-link
              to="/"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Volver al Inicio
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PlusIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'CreateRoom',
  components: {
    PlusIcon
  }
}
</script>

