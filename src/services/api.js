import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const toast = useToast()

// Configuración base de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const authStore = useAuthStore()
    
    if (error.response?.status === 401) {
      // Token expirado o inválido
      authStore.logout()
      toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.')
    } else if (error.response?.status === 403) {
      toast.error('No tienes permisos para realizar esta acción.')
    } else if (error.response?.status >= 500) {
      toast.error('Error del servidor. Intenta más tarde.')
    } else if (error.code === 'NETWORK_ERROR') {
      toast.error('Error de conexión. Verifica tu internet.')
    }
    
    return Promise.reject(error)
  }
)

// Servicios de Autenticación
export const authAPI = {
  // Login
  login: (idToken) => api.post('/api/auth/login', { idToken }),
  
  // Registro
  register: (idToken, userData = {}) => api.post('/api/auth/register', { idToken, userData }),
  
  // Logout
  logout: () => api.post('/api/auth/logout'),
  
  // Obtener usuario actual
  me: () => api.get('/api/auth/me'),
  
  // Actualizar perfil
  updateProfile: (data) => api.put('/api/auth/profile', data),
  
  // Actualizar ubicación
  updateLocation: (location) => api.post('/api/auth/location', location),
  
  // Obtener usuarios online
  getOnlineUsers: () => api.get('/api/auth/online'),
  
  // Estado del servicio
  getStatus: () => api.get('/api/auth/status')
}

// Servicios de Usuarios
export const userAPI = {
  // Obtener todos los usuarios
  getAll: (params = {}) => api.get('/api/users', { params }),
  
  // Obtener usuario por ID
  getById: (id) => api.get(`/api/users/${id}`),
  
  // Actualizar usuario
  update: (id, data) => api.put(`/api/users/${id}`, data),
  
  // Eliminar usuario
  delete: (id) => api.delete(`/api/users/${id}`),
  
  // Buscar usuarios
  search: (query, params = {}) => api.get(`/api/users/search/${encodeURIComponent(query)}`, { params }),
  
  // Obtener estadísticas
  getStats: () => api.get('/api/users/stats/overview'),
  
  // Cambiar rol
  changeRole: (id, role) => api.patch(`/api/users/${id}/role`, { role })
}

// Servicios de Rooms
export const roomAPI = {
  // Obtener todos los rooms
  getAll: (params = {}) => api.get('/api/rooms', { params }),
  
  // Obtener room por ID
  getById: (id) => api.get(`/api/rooms/${id}`),
  
  // Crear room
  create: (data) => api.post('/api/rooms', data),
  
  // Actualizar room
  update: (id, data) => api.put(`/api/rooms/${id}`, data),
  
  // Eliminar room
  delete: (id) => api.delete(`/api/rooms/${id}`),
  
  // Unirse a room
  join: (id, data = {}) => api.post(`/api/rooms/${id}/join`, data),
  
  // Salir de room
  leave: (id) => api.post(`/api/rooms/${id}/leave`),
  
  // Obtener participantes
  getParticipants: (id) => api.get(`/api/rooms/${id}/participants`)
}

// Servicios de Mapas
export const mapsAPI = {
  // Estado del servicio
  getStatus: () => api.get('/api/maps/status'),
  
  // Geocodificación
  geocode: (address) => api.post('/api/maps/geocode', { address }),
  
  // Geocodificación inversa
  reverseGeocode: (latitude, longitude) => api.post('/api/maps/reverse-geocode', { latitude, longitude }),
  
  // Obtener direcciones
  getDirections: (origin, destination, options = {}) => 
    api.post('/api/maps/directions', { origin, destination, options }),
  
  // Matriz de distancias
  getDistanceMatrix: (origins, destinations, options = {}) =>
    api.post('/api/maps/distance-matrix', { origins, destinations, options }),
  
  // Lugares cercanos
  getNearbyPlaces: (location, options = {}) =>
    api.post('/api/maps/nearby-places', { location, options }),
  
  // Detalles de lugar
  getPlaceDetails: (placeId, params = {}) =>
    api.get(`/api/maps/place/${placeId}`, { params }),
  
  // Optimizar ruta
  optimizeRoute: (origin, destination, waypoints, options = {}) =>
    api.post('/api/maps/optimize-route', { origin, destination, waypoints, options }),
  
  // Calcular distancia
  calculateDistance: (point1, point2) =>
    api.post('/api/maps/calculate-distance', { point1, point2 }),
  
  // Verificar radio
  checkWithinRadius: (center, point, radius) =>
    api.post('/api/maps/check-radius', { center, point, radius })
}

// Utilidades para manejo de errores
export const handleAPIError = (error, defaultMessage = 'Ha ocurrido un error') => {
  if (error.response?.data?.error) {
    return error.response.data.error
  } else if (error.message) {
    return error.message
  } else {
    return defaultMessage
  }
}

// Utilidades para manejo de respuestas
export const extractData = (response) => {
  return response.data
}

export const extractSuccess = (response) => {
  return response.data.success !== false
}

// Configuración de timeouts específicos
export const createAPIWithTimeout = (timeout) => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// API para archivos (con timeout extendido)
export const fileAPI = createAPIWithTimeout(60000)

// Interceptor para archivos
fileAPI.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  }
)

// Servicios de archivos
export const uploadAPI = {
  // Subir imagen
  uploadImage: (file, onProgress) => {
    const formData = new FormData()
    formData.append('image', file)
    
    return fileAPI.post('/api/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: onProgress
    })
  },
  
  // Subir archivo
  uploadFile: (file, onProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    
    return fileAPI.post('/api/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: onProgress
    })
  }
}

// Configuración para desarrollo
if (import.meta.env.DEV) {
  // Logging en desarrollo
  api.interceptors.request.use(request => {
    console.log('🚀 API Request:', {
      method: request.method?.toUpperCase(),
      url: request.url,
      data: request.data,
      params: request.params
    })
    return request
  })
  
  api.interceptors.response.use(
    response => {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      })
      return response
    },
    error => {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data
      })
      return Promise.reject(error)
    }
  )
}

export default api

