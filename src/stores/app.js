import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

export const useAppStore = defineStore('app', () => {
  // Estado
  const isLoading = ref(false)
  const loadingMessage = ref('')
  const config = ref({
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    firebaseConfig: {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
    }
  })
  
  // Estado de la aplicación
  const isOnline = ref(navigator.onLine)
  const isMobile = ref(window.innerWidth < 768)
  const theme = ref(localStorage.getItem('theme') || 'light')
  
  // Modal global
  const modal = ref({
    isOpen: false,
    component: null,
    props: {},
    options: {}
  })
  
  // Confirmación global
  const confirm = ref({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'info', // info, warning, danger, success
    onConfirm: null,
    onCancel: null
  })
  
  // Notificaciones
  const notifications = ref([])
  
  const toast = useToast()

  // Getters
  const isConfigured = computed(() => {
    return config.value.googleMapsApiKey && 
           config.value.firebaseConfig.apiKey &&
           config.value.firebaseConfig.projectId
  })

  // Acciones de loading
  const setLoading = (loading, message = '') => {
    isLoading.value = loading
    loadingMessage.value = message
  }

  // Acciones de configuración
  const loadConfig = async () => {
    try {
      // Aquí se podría cargar configuración adicional desde el servidor
      // Por ahora usamos las variables de entorno
      
      // Detectar cambios de tamaño de pantalla
      const handleResize = () => {
        isMobile.value = window.innerWidth < 768
      }
      
      // Detectar cambios de conexión
      const handleOnline = () => {
        isOnline.value = true
      }
      
      const handleOffline = () => {
        isOnline.value = false
      }
      
      window.addEventListener('resize', handleResize)
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
      
      return config.value
    } catch (error) {
      console.error('Error cargando configuración:', error)
      throw error
    }
  }

  // Acciones de tema
  const setTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    
    // Aplicar tema al documento
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  // Acciones de modal
  const openModal = (component, props = {}, options = {}) => {
    modal.value = {
      isOpen: true,
      component,
      props,
      options: {
        closable: true,
        size: 'md', // sm, md, lg, xl, full
        ...options
      }
    }
  }

  const closeModal = () => {
    modal.value = {
      isOpen: false,
      component: null,
      props: {},
      options: {}
    }
  }

  // Acciones de confirmación
  const showConfirm = (options) => {
    return new Promise((resolve) => {
      confirm.value = {
        isOpen: true,
        title: options.title || '¿Estás seguro?',
        message: options.message || '',
        confirmText: options.confirmText || 'Confirmar',
        cancelText: options.cancelText || 'Cancelar',
        type: options.type || 'info',
        onConfirm: () => {
          closeConfirm()
          resolve(true)
        },
        onCancel: () => {
          closeConfirm()
          resolve(false)
        }
      }
    })
  }

  const closeConfirm = () => {
    confirm.value = {
      isOpen: false,
      title: '',
      message: '',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      type: 'info',
      onConfirm: null,
      onCancel: null
    }
  }

  // Acciones de notificaciones
  const addNotification = (notification) => {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      type: 'info', // info, success, warning, error
      title: '',
      message: '',
      duration: 5000,
      persistent: false,
      ...notification
    }
    
    notifications.value.push(newNotification)
    
    // Auto-remover si no es persistente
    if (!newNotification.persistent && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
    
    return id
  }

  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  // Helpers para toast
  const showSuccess = (message, title = '') => {
    toast.success(message)
    if (title) {
      addNotification({
        type: 'success',
        title,
        message,
        duration: 3000
      })
    }
  }

  const showError = (message, title = 'Error') => {
    toast.error(message)
    addNotification({
      type: 'error',
      title,
      message,
      duration: 0, // Persistente para errores
      persistent: true
    })
  }

  const showWarning = (message, title = 'Advertencia') => {
    toast.warning(message)
    addNotification({
      type: 'warning',
      title,
      message,
      duration: 5000
    })
  }

  const showInfo = (message, title = 'Información') => {
    toast.info(message)
    if (title) {
      addNotification({
        type: 'info',
        title,
        message,
        duration: 4000
      })
    }
  }

  // Utilidades
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date, format = 'short') => {
    const d = new Date(date)
    
    if (format === 'short') {
      return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } else if (format === 'long') {
      return d.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } else if (format === 'time') {
      return d.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } else if (format === 'datetime') {
      return d.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    return d.toLocaleDateString('es-ES')
  }

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`
    } else {
      return `${(meters / 1000).toFixed(1)} km`
    }
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else {
      return `${minutes}m`
    }
  }

  // Inicializar tema
  if (theme.value === 'dark') {
    document.documentElement.classList.add('dark')
  }

  return {
    // Estado
    isLoading,
    loadingMessage,
    config,
    isOnline,
    isMobile,
    theme,
    modal,
    confirm,
    notifications,
    
    // Getters
    isConfigured,
    
    // Acciones
    setLoading,
    loadConfig,
    setTheme,
    toggleTheme,
    openModal,
    closeModal,
    showConfirm,
    closeConfirm,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Utilidades
    formatFileSize,
    formatDate,
    formatDistance,
    formatDuration
  }
})

