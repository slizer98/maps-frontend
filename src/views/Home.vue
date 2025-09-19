<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Bienvenido a 
            <span class="text-primary-600">Maps App</span>
          </h1>
          <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Conecta con otros usuarios, únete a rooms y comparte tu ubicación en tiempo real.
          </p>
          <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div class="rounded-md shadow">
              <router-link
                to="/rooms"
                class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
              >
                Explorar Rooms
              </router-link>
            </div>
            <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <router-link
                to="/map"
                class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Ver Mapa
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="bg-primary-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div class="text-center">
            <div class="text-3xl font-bold text-white">{{ stats.onlineUsers }}</div>
            <div class="text-primary-200">Usuarios Online</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-white">{{ stats.activeRooms }}</div>
            <div class="text-primary-200">Rooms Activos</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-white">{{ stats.totalMessages }}</div>
            <div class="text-primary-200">Mensajes Hoy</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-primary-600 font-semibold tracking-wide uppercase">Características</h2>
          <p class="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            Todo lo que necesitas para conectar
          </p>
          <p class="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Una plataforma completa para compartir ubicaciones, crear grupos y comunicarte en tiempo real.
          </p>
        </div>

        <div class="mt-10">
          <div class="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            <div
              v-for="feature in features"
              :key="feature.name"
              class="relative"
            >
              <div class="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                <component :is="feature.icon" class="h-6 w-6" />
              </div>
              <p class="ml-16 text-lg leading-6 font-medium text-gray-900">{{ feature.name }}</p>
              <p class="mt-2 ml-16 text-base text-gray-500">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Actividad Reciente</h2>
        
        <div v-if="isLoading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p class="mt-2 text-gray-500">Cargando actividad...</p>
        </div>

        <div v-else-if="recentActivity.length === 0" class="text-center py-8">
          <BuildingOfficeIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay actividad reciente</h3>
          <p class="mt-1 text-sm text-gray-500">Únete a un room para empezar a ver actividad.</p>
          <div class="mt-6">
            <router-link
              to="/rooms"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
              Explorar Rooms
            </router-link>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="bg-gray-50 rounded-lg p-4 flex items-center space-x-4"
          >
            <div class="flex-shrink-0">
              <img
                v-if="activity.userPhoto"
                :src="activity.userPhoto"
                :alt="activity.userName"
                class="h-10 w-10 rounded-full"
              >
              <div
                v-else
                class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
              >
                <UserIcon class="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">
                {{ activity.userName }}
              </p>
              <p class="text-sm text-gray-500">
                {{ activity.action }}
              </p>
            </div>
            <div class="flex-shrink-0 text-sm text-gray-400">
              {{ formatTimeAgo(activity.timestamp) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSocketStore } from '@/stores/socket'
import { userAPI, roomAPI } from '@/services/api'
import {
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  MapIcon,
  BuildingOfficeIcon,
  PlusIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'Home',
  components: {
    MapPinIcon,
    ChatBubbleLeftRightIcon,
    UserGroupIcon,
    MapIcon,
    BuildingOfficeIcon,
    PlusIcon,
    UserIcon
  },
  setup() {
    const authStore = useAuthStore()
    const socketStore = useSocketStore()
    
    const isLoading = ref(false)
    const stats = ref({
      onlineUsers: 0,
      activeRooms: 0,
      totalMessages: 0
    })
    const recentActivity = ref([])

    const features = [
      {
        name: 'Tracking en Tiempo Real',
        description: 'Comparte tu ubicación y ve la de otros usuarios en tiempo real.',
        icon: MapPinIcon,
      },
      {
        name: 'Chat Instantáneo',
        description: 'Comunícate con otros usuarios en los rooms mediante chat en vivo.',
        icon: ChatBubbleLeftRightIcon,
      },
      {
        name: 'Rooms Colaborativos',
        description: 'Crea o únete a rooms para organizar grupos y actividades.',
        icon: UserGroupIcon,
      },
      {
        name: 'Rutas Optimizadas',
        description: 'Calcula las mejores rutas para llegar a tu destino.',
        icon: MapIcon,
      },
    ]

    const loadStats = async () => {
      try {
        // Simular estadísticas por ahora
        stats.value = {
          onlineUsers: socketStore.onlineUsersCount || Math.floor(Math.random() * 50) + 10,
          activeRooms: Math.floor(Math.random() * 20) + 5,
          totalMessages: Math.floor(Math.random() * 500) + 100
        }
      } catch (error) {
        console.error('Error cargando estadísticas:', error)
      }
    }

    const loadRecentActivity = async () => {
      isLoading.value = true
      try {
        // Simular actividad reciente por ahora
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        recentActivity.value = [
          {
            id: 1,
            userName: 'Juan Pérez',
            userPhoto: null,
            action: 'se unió al room "Delivery Centro"',
            timestamp: new Date(Date.now() - 5 * 60 * 1000)
          },
          {
            id: 2,
            userName: 'María García',
            userPhoto: null,
            action: 'creó el room "Pasajeros Norte"',
            timestamp: new Date(Date.now() - 15 * 60 * 1000)
          },
          {
            id: 3,
            userName: 'Carlos López',
            userPhoto: null,
            action: 'compartió su ubicación',
            timestamp: new Date(Date.now() - 30 * 60 * 1000)
          }
        ]
      } catch (error) {
        console.error('Error cargando actividad:', error)
      } finally {
        isLoading.value = false
      }
    }

    const formatTimeAgo = (date) => {
      const now = new Date()
      const diff = now - date
      const minutes = Math.floor(diff / 60000)
      
      if (minutes < 1) return 'Ahora'
      if (minutes < 60) return `${minutes}m`
      
      const hours = Math.floor(minutes / 60)
      if (hours < 24) return `${hours}h`
      
      const days = Math.floor(hours / 24)
      return `${days}d`
    }

    onMounted(() => {
      loadStats()
      loadRecentActivity()
    })

    return {
      authStore,
      socketStore,
      isLoading,
      stats,
      recentActivity,
      features,
      formatTimeAgo
    }
  }
}
</script>

