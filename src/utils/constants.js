// Constantes de la aplicación

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  DRIVER: 'driver',
  PASSENGER: 'passenger',
  USER: 'user'
}

// Estados de room
export const ROOM_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  FULL: 'full',
  PRIVATE: 'private'
}

// Tipos de mensaje
export const MESSAGE_TYPES = {
  TEXT: 'text',
  SYSTEM: 'system',
  LOCATION: 'location',
  IMAGE: 'image',
  FILE: 'file'
}

// Tipos de vehículo
export const VEHICLE_TYPES = {
  CAR: 'car',
  TRUCK: 'truck',
  MOTORCYCLE: 'motorcycle',
  BICYCLE: 'bicycle',
  WALKING: 'walking'
}

// Modos de transporte para Google Maps
export const TRAVEL_MODES = {
  DRIVING: 'DRIVING',
  WALKING: 'WALKING',
  BICYCLING: 'BICYCLING',
  TRANSIT: 'TRANSIT'
}

// Configuración de mapa
export const MAP_CONFIG = {
  DEFAULT_ZOOM: 15,
  MIN_ZOOM: 10,
  MAX_ZOOM: 20,
  DEFAULT_CENTER: {
    lat: -34.6037,
    lng: -58.3816 // Buenos Aires
  }
}

// Configuración de ubicación
export const LOCATION_CONFIG = {
  HIGH_ACCURACY: true,
  TIMEOUT: 10000,
  MAXIMUM_AGE: 60000,
  UPDATE_INTERVAL: 30000 // 30 segundos
}

// Límites de la aplicación
export const LIMITS = {
  MAX_MESSAGE_LENGTH: 500,
  MAX_ROOM_NAME_LENGTH: 50,
  MAX_ROOM_DESCRIPTION_LENGTH: 200,
  MAX_PARTICIPANTS_PER_ROOM: 50,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
}

// Configuración de Socket.IO
export const SOCKET_CONFIG = {
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 2000,
  HEARTBEAT_INTERVAL: 30000,
  CONNECTION_TIMEOUT: 10000
}

// Eventos de Socket.IO
export const SOCKET_EVENTS = {
  // Conexión
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECTED: 'connected',
  ERROR: 'error',
  
  // Rooms
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  JOINED_ROOM: 'joined_room',
  LEFT_ROOM: 'left_room',
  USER_JOINED_ROOM: 'user_joined_room',
  USER_LEFT_ROOM: 'user_left_room',
  ROOM_UPDATED: 'room_updated',
  ROOM_DELETED: 'room_deleted',
  
  // Mensajes
  SEND_MESSAGE: 'send_message',
  NEW_MESSAGE: 'new_message',
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  USER_TYPING: 'user_typing',
  
  // Ubicación
  UPDATE_LOCATION: 'update_location',
  USER_LOCATION_UPDATE: 'user_location_update',
  
  // Heartbeat
  PING: 'ping',
  PONG: 'pong'
}

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000,
  ERROR_DURATION: 0, // Persistente
  SUCCESS_DURATION: 3000,
  WARNING_DURATION: 5000,
  INFO_DURATION: 4000
}

// Breakpoints para responsive design
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
}

// Colores del tema
export const THEME_COLORS = {
  PRIMARY: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  }
}

// Configuración de desarrollo
export const DEV_CONFIG = {
  ENABLE_LOGGING: import.meta.env.DEV,
  ENABLE_MOCK_DATA: import.meta.env.DEV,
  SHOW_DEBUG_INFO: import.meta.env.DEV
}

export default {
  USER_ROLES,
  ROOM_STATUS,
  MESSAGE_TYPES,
  VEHICLE_TYPES,
  TRAVEL_MODES,
  MAP_CONFIG,
  LOCATION_CONFIG,
  LIMITS,
  SOCKET_CONFIG,
  SOCKET_EVENTS,
  NOTIFICATION_CONFIG,
  BREAKPOINTS,
  THEME_COLORS,
  DEV_CONFIG
}

