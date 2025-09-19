// Funciones de utilidad

/**
 * Formatear fecha de manera legible
 */
export const formatDate = (date, format = 'short') => {
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

/**
 * Formatear tiempo transcurrido
 */
export const formatTimeAgo = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `${minutes}m`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}sem`
  
  const months = Math.floor(days / 30)
  return `${months}mes`
}

/**
 * Formatear distancia
 */
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  } else {
    return `${(meters / 1000).toFixed(1)} km`
  }
}

/**
 * Formatear duración
 */
export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

/**
 * Formatear tamaño de archivo
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Generar ID único
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Validar email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validar URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Capitalizar primera letra
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Truncar texto
 */
export const truncate = (str, length = 100) => {
  if (str.length <= length) return str
  return str.substring(0, length) + '...'
}

/**
 * Calcular distancia entre dos puntos (Haversine)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c * 1000 // Retornar en metros
}

/**
 * Verificar si un punto está dentro de un radio
 */
export const isWithinRadius = (centerLat, centerLon, pointLat, pointLon, radiusMeters) => {
  const distance = calculateDistance(centerLat, centerLon, pointLat, pointLon)
  return distance <= radiusMeters
}

/**
 * Obtener ubicación actual del usuario
 */
export const getCurrentLocation = (options = {}) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalización no soportada'))
      return
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        })
      },
      (error) => {
        let message = 'Error obteniendo ubicación'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Permiso de ubicación denegado'
            break
          case error.POSITION_UNAVAILABLE:
            message = 'Ubicación no disponible'
            break
          case error.TIMEOUT:
            message = 'Tiempo de espera agotado'
            break
        }
        reject(new Error(message))
      },
      { ...defaultOptions, ...options }
    )
  })
}

/**
 * Observar cambios de ubicación
 */
export const watchLocation = (callback, options = {}) => {
  if (!navigator.geolocation) {
    throw new Error('Geolocalización no soportada')
  }

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 30000
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      })
    },
    (error) => {
      console.error('Error watching location:', error)
    },
    { ...defaultOptions, ...options }
  )
}

/**
 * Copiar texto al portapapeles
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // Fallback para navegadores que no soportan clipboard API
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      return true
    } catch (err) {
      return false
    } finally {
      document.body.removeChild(textArea)
    }
  }
}

/**
 * Detectar si es dispositivo móvil
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * Detectar si está en modo oscuro
 */
export const isDarkMode = () => {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * Scroll suave a elemento
 */
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId)
  if (element) {
    const top = element.offsetTop - offset
    window.scrollTo({
      top,
      behavior: 'smooth'
    })
  }
}

export default {
  formatDate,
  formatTimeAgo,
  formatDistance,
  formatDuration,
  formatFileSize,
  generateId,
  debounce,
  throttle,
  isValidEmail,
  isValidUrl,
  capitalize,
  truncate,
  calculateDistance,
  isWithinRadius,
  getCurrentLocation,
  watchLocation,
  copyToClipboard,
  isMobile,
  isDarkMode,
  scrollToElement
}

