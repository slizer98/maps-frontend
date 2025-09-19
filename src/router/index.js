import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Importar vistas
const Home = () => import('@/views/Home.vue')
const Login = () => import('@/views/auth/Login.vue')
const Register = () => import('@/views/auth/Register.vue')
const ForgotPassword = () => import('@/views/auth/ForgotPassword.vue')
const Profile = () => import('@/views/user/Profile.vue')
const Rooms = () => import('@/views/rooms/Rooms.vue')
const Room = () => import('@/views/rooms/Room.vue')
const CreateRoom = () => import('@/views/rooms/CreateRoom.vue')
const Map = () => import('@/views/map/Map.vue')
const Settings = () => import('@/views/user/Settings.vue')
const About = () => import('@/views/About.vue')
const NotFound = () => import('@/views/errors/NotFound.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      requiresAuth: true,
      title: 'Inicio'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresGuest: true,
      title: 'Iniciar Sesión'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      requiresGuest: true,
      title: 'Registrarse'
    }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPassword,
    meta: {
      requiresGuest: true,
      title: 'Recuperar Contraseña'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: {
      requiresAuth: true,
      title: 'Mi Perfil'
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: {
      requiresAuth: true,
      title: 'Configuración'
    }
  },
  {
    path: '/rooms',
    name: 'rooms',
    component: Rooms,
    meta: {
      requiresAuth: true,
      title: 'Rooms'
    }
  },
  {
    path: '/rooms/create',
    name: 'create-room',
    component: CreateRoom,
    meta: {
      requiresAuth: true,
      title: 'Crear Room'
    }
  },
  {
    path: '/rooms/:id',
    name: 'room',
    component: Room,
    meta: {
      requiresAuth: true,
      title: 'Room'
    },
    props: true
  },
  {
    path: '/map',
    name: 'map',
    component: Map,
    meta: {
      requiresAuth: true,
      title: 'Mapa'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      title: 'Acerca de'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: {
      title: 'Página no encontrada'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else {
      return { top: 0 }
    }
  }
})

// Guards de navegación
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Actualizar título de la página
  document.title = to.meta.title 
    ? `${to.meta.title} - Maps App` 
    : 'Maps App'

  // Verificar autenticación si es necesario
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Guardar la ruta intentada para redireccionar después del login
      const redirectPath = to.fullPath !== '/login' ? to.fullPath : '/'
      next({
        name: 'login',
        query: { redirect: redirectPath }
      })
      return
    }
  }

  // Verificar si requiere ser invitado (no autenticado)
  if (to.meta.requiresGuest) {
    if (authStore.isAuthenticated) {
      next({ name: 'home' })
      return
    }
  }

  // Verificar roles específicos si es necesario
  if (to.meta.requiresRole) {
    const userRole = authStore.user?.role
    const requiredRoles = Array.isArray(to.meta.requiresRole) 
      ? to.meta.requiresRole 
      : [to.meta.requiresRole]
    
    if (!requiredRoles.includes(userRole)) {
      next({ name: 'home' })
      return
    }
  }

  next()
})

router.afterEach((to, from) => {
  // Analytics o tracking aquí si es necesario
  if (import.meta.env.PROD) {
    // TODO: Integrar con Google Analytics o similar
  }
})

// Manejo de errores de navegación
router.onError((error) => {
  console.error('Error de navegación:', error)
  
  // En producción, enviar error a servicio de logging
  if (import.meta.env.PROD) {
    // TODO: Integrar con servicio de logging
  }
})

export default router

