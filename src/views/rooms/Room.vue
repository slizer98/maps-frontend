<template>
  <div class="h-screen bg-gray-50">
    <div class="text-center py-12">
      <BuildingOfficeIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">Room {{ $route.params.id }}</h3>
      <p class="mt-1 text-sm text-gray-500">
        Esta funcionalidad está en desarrollo.
      </p>
      <div class="mt-6">
        <router-link
          to="/rooms"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Volver a Rooms
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { BuildingOfficeIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'Room',
  components: {
    BuildingOfficeIcon
  },
  props: {
    id: {
      type: String,
      required: true
    }
  }
}
</script>

