<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-2xl font-bold text-gray-900">Rooms</h1>
        <p class="mt-2 text-sm text-gray-700">
          Explora y únete a rooms activos o crea uno nuevo.
        </p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <router-link
          to="/rooms/create"
          class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
        >
          <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
          Crear Room
        </router-link>
      </div>
    </div>

    <div class="mt-8">
      <div class="text-center py-12">
        <BuildingOfficeIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Rooms</h3>
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
  </div>
</template>

<script>
import { BuildingOfficeIcon, PlusIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'Rooms',
  components: {
    BuildingOfficeIcon,
    PlusIcon
  }
}
</script>

