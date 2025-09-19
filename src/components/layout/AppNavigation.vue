<template>
  <nav class="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo y navegación principal -->
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <MapPinIcon class="w-5 h-5 text-white" />
              </div>
              <span class="text-xl font-bold text-gray-900 hidden sm:block">Maps App</span>
            </router-link>
          </div>

          <!-- Navegación principal (desktop) -->
          <div class="hidden md:ml-6 md:flex md:space-x-8">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.to"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200"
              :class="isActiveRoute(item.to) 
                ? 'border-b-2 border-primary-500 text-gray-900' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              <component :is="item.icon" class="w-4 h-4 mr-2" />
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <!-- Acciones de la derecha -->
        <div class="flex items-center space-x-4">
          <!-- Indicador de conexión -->
          <div class="flex items-center space-x-2">
            <div 
              :class="connectionStatusClass"
              class="w-2 h-2 rounded-full"
            ></div>
            <span class="text-xs text-gray-500 hidden sm:block">
              {{ connectionStatusText }}
            </span>
          </div>

          <!-- Notificaciones -->
          <button
            @click="toggleNotifications"
            class="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
          >
            <BellIcon class="w-6 h-6" />
            <span 
              v-if="unreadNotifications > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
            </span>
          </button>

          <!-- Menú de usuario -->
          <div class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <img
                v-if="authStore.userPhoto"
                :src="authStore.userPhoto"
                :alt="authStore.userName"
                class="w-8 h-8 rounded-full"
              >
              <div
                v-else
                class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
              >
                <UserIcon class="w-5 h-5 text-gray-600" />
              </div>
              <span class="text-sm font-medium text-gray-700 hidden sm:block">
                {{ authStore.userName }}
              </span>
              <ChevronDownIcon class="w-4 h-4 text-gray-400" />
            </button>

            <!-- Dropdown del usuario -->
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none"
                @click.stop
              >
                <router-link
                  v-for="item in userMenuItems"
                  :key="item.name"
                  :to="item.to"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  <component :is="item.icon" class="w-4 h-4 mr-3" />
                  {{ item.name }}
                </router-link>
                
                <hr class="my-1">
                
                <button
                  @click="handleLogout"
                  class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ArrowRightOnRectangleIcon class="w-4 h-4 mr-3" />
                  Cerrar Sesión
                </button>
              </div>
            </transition>
          </div>

          <!-- Menú móvil -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <Bars3Icon v-if="!showMobileMenu" class="w-6 h-6" />
            <XMarkIcon v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Menú móvil -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div v-if="showMobileMenu" class="md:hidden bg-white border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.to"
            class="flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            :class="isActiveRoute(item.to)
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            @click="showMobileMenu = false"
          >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useSocketStore } from '@/stores/socket'
import { useAppStore } from '@/stores/app'

// Iconos de Heroicons
import {
  MapPinIcon,
  HomeIcon,
  BuildingOfficeIcon,
  MapIcon,
  UserIcon,
  Cog6ToothIcon,
  BellIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'AppNavigation',
  components: {
    MapPinIcon,
    HomeIcon,
    BuildingOfficeIcon,
    MapIcon,
    UserIcon,
    Cog6ToothIcon,
    BellIcon,
    ChevronDownIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowRightOnRectangleIcon,
    InformationCircleIcon
  },
  setup() {
    const route = useRoute()
    const authStore = useAuthStore()
    const socketStore = useSocketStore()
    const appStore = useAppStore()
    
    const showUserMenu = ref(false)
    const showMobileMenu = ref(false)
    const showNotifications = ref(false)

    // Items de navegación principal
    const navigationItems = [
      { name: 'Inicio', to: '/', icon: HomeIcon },
      { name: 'Rooms', to: '/rooms', icon: BuildingOfficeIcon },
      { name: 'Mapa', to: '/map', icon: MapIcon },
    ]

    // Items del menú de usuario
    const userMenuItems = [
      { name: 'Mi Perfil', to: '/profile', icon: UserIcon },
      { name: 'Configuración', to: '/settings', icon: Cog6ToothIcon },
      { name: 'Acerca de', to: '/about', icon: InformationCircleIcon },
    ]

    // Estado de conexión
    const connectionStatusClass = computed(() => {
      if (socketStore.isConnected) {
        return 'bg-green-400'
      } else if (socketStore.isConnecting) {
        return 'bg-yellow-400 animate-pulse'
      } else {
        return 'bg-red-400'
      }
    })

    const connectionStatusText = computed(() => {
      if (socketStore.isConnected) {
        return 'Conectado'
      } else if (socketStore.isConnecting) {
        return 'Conectando...'
      } else {
        return 'Desconectado'
      }
    })

    // Notificaciones
    const unreadNotifications = computed(() => {
      return appStore.notifications.filter(n => !n.read).length
    })

    // Verificar si una ruta está activa
    const isActiveRoute = (to) => {
      if (to === '/') {
        return route.path === '/'
      }
      return route.path.startsWith(to)
    }

    // Alternar menús
    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
      showMobileMenu.value = false
      showNotifications.value = false
    }

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value
      showUserMenu.value = false
      showNotifications.value = false
    }

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value
      showUserMenu.value = false
      showMobileMenu.value = false
    }

    // Cerrar menús al hacer click fuera
    const closeMenus = (event) => {
      if (!event.target.closest('.relative')) {
        showUserMenu.value = false
        showMobileMenu.value = false
        showNotifications.value = false
      }
    }

    // Logout
    const handleLogout = async () => {
      try {
        await authStore.logout()
        showUserMenu.value = false
      } catch (error) {
        console.error('Error en logout:', error)
      }
    }

    // Lifecycle
    onMounted(() => {
      document.addEventListener('click', closeMenus)
    })

    onUnmounted(() => {
      document.removeEventListener('click', closeMenus)
    })

    return {
      authStore,
      socketStore,
      appStore,
      showUserMenu,
      showMobileMenu,
      showNotifications,
      navigationItems,
      userMenuItems,
      connectionStatusClass,
      connectionStatusText,
      unreadNotifications,
      isActiveRoute,
      toggleUserMenu,
      toggleMobileMenu,
      toggleNotifications,
      handleLogout
    }
  }
}
</script>

