import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from './auth'
import { useToast } from 'vue-toastification'
import { SOCKET_EVENTS } from '@/utils/constants'

export const useSocketStore = defineStore('socket', () => {
  // Estado
  const socket = ref(null)
  const connected = ref(false)
  const connecting = ref(false)
  const currentRoom = ref(null)
  const roomParticipants = ref([])
  const messages = ref([])
  const typingUsers = ref([])
  const onlineUsers = ref([])
  const lastPing = ref(null)

  // Timers / control
  const heartbeatInterval = ref(null)
  const typingCleanerInterval = ref(null)
  const heartbeatPaused = ref(false)

  const toast = useToast()

  // Getters
  const isConnected = computed(() => connected.value && socket.value?.connected)
  const isInRoom = computed(() => !!currentRoom.value)
  const participantCount = computed(() => roomParticipants.value.length)
  const unreadMessages = computed(() => messages.value.filter(m => !m.read).length)

  // Acciones
  const connect = () => {
    if (socket.value?.connected) return

    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      console.warn('No se puede conectar Socket.IO sin autenticación')
      return
    }

    try {
      connecting.value = true

      socket.value = io(import.meta.env.VITE_SOCKET_URL, {
        auth: { token: authStore.token },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000
      })

      setupEventListeners()
    } catch (error) {
      console.error('Error conectando Socket.IO:', error)
      connecting.value = false
    }
  }

  const disconnect = () => {
    if (socket.value) {
      try { socket.value.disconnect() } catch {}
      socket.value = null
    }

    connected.value = false
    connecting.value = false
    currentRoom.value = null
    roomParticipants.value = []
    messages.value = []
    typingUsers.value = []
    onlineUsers.value = []
    stopHeartbeat()
    stopTypingCleaner()
  }

  const setupEventListeners = () => {
    if (!socket.value) return

    // --- Conexión
    socket.value.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('✅ Socket.IO conectado')
      connected.value = true
      connecting.value = false
      toast.success('Conectado al servidor')
      if (!heartbeatPaused.value) startHeartbeat()
      startTypingCleaner()
    })

    socket.value.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
      console.log('❌ Socket.IO desconectado:', reason)
      connected.value = false
      if (reason === 'io server disconnect') {
        toast.error('Desconectado del servidor')
      }
      stopHeartbeat()
      stopTypingCleaner()
    })

    socket.value.on(SOCKET_EVENTS.CONNECTED, (data) => {
      console.log('🎉 Usuario autenticado en Socket.IO:', data)
    })

    socket.value.on(SOCKET_EVENTS.ERROR, (error) => {
      console.error('❌ Error de Socket.IO:', error)
      toast.error('Error de conexión')
    })

    // --- Rooms
    socket.value.on(SOCKET_EVENTS.JOINED_ROOM, (data) => {
      console.log('🏠 Unido al room:', data)
      currentRoom.value = data.room
      roomParticipants.value = data.participants || []
      messages.value = (data.messages || []).map(m => ({
        ...m,
        id: m.id || Date.now(),
        read: false,
        timestamp: new Date(m.timestamp)
      }))
      toast.success(`Te has unido al room "${data.room.name}"`)
    })

    socket.value.on(SOCKET_EVENTS.LEFT_ROOM, (data) => {
      console.log('🚪 Saliste del room:', data)
      currentRoom.value = null
      roomParticipants.value = []
      messages.value = []
      typingUsers.value = []
      toast.info('Has salido del room')
    })

    socket.value.on(SOCKET_EVENTS.USER_JOINED_ROOM, (data) => {
      console.log('👋 Usuario se unió al room:', data)
      const existingUser = roomParticipants.value.find(p => p.userId === data.userId)
      if (!existingUser) {
        roomParticipants.value.push({
          userId: data.userId,
          displayName: data.displayName,
          photoURL: data.photoURL,
          role: data.role,
          joinedAt: data.timestamp,
          isOnline: true
        })
      }
      addSystemMessage(`${data.displayName} se unió al room`)
    })

    socket.value.on(SOCKET_EVENTS.USER_LEFT_ROOM, (data) => {
      console.log('👋 Usuario salió del room:', data)
      roomParticipants.value = roomParticipants.value.filter(p => p.userId !== data.userId)
      typingUsers.value = typingUsers.value.filter(u => u.userId !== data.userId)
      addSystemMessage(`${data.displayName} salió del room`)
    })

    socket.value.on(SOCKET_EVENTS.ROOM_UPDATED, (data) => {
      console.log('🔄 Room actualizado:', data)
      if (currentRoom.value && currentRoom.value.id === data.room.id) {
        currentRoom.value = { ...currentRoom.value, ...data.room }
      }
    })

    socket.value.on(SOCKET_EVENTS.ROOM_DELETED, (data) => {
      console.log('🗑️ Room eliminado:', data)
      if (currentRoom.value && currentRoom.value.id === data.roomId) {
        currentRoom.value = null
        roomParticipants.value = []
        messages.value = []
        toast.warning('El room ha sido eliminado')
      }
    })

    // --- Mensajes
    socket.value.on(SOCKET_EVENTS.NEW_MESSAGE, (data) => {
      console.log('💬 Nuevo mensaje:', data)
      addMessage(data)
    })

    socket.value.on(SOCKET_EVENTS.USER_TYPING, (data) => {
      console.log('⌨️ Usuario escribiendo:', data)
      if (data.isTyping) {
        const existingUser = typingUsers.value.find(u => u.userId === data.userId)
        if (!existingUser) {
          typingUsers.value.push({
            userId: data.userId,
            displayName: data.displayName,
            timestamp: new Date()
          })
        } else {
          existingUser.timestamp = new Date()
        }
      } else {
        typingUsers.value = typingUsers.value.filter(u => u.userId !== data.userId)
      }
    })

    // --- Ubicación
    socket.value.on(SOCKET_EVENTS.USER_LOCATION_UPDATE, (data) => {
      console.log('📍 Ubicación actualizada:', data)
      const participant = roomParticipants.value.find(p => p.userId === data.userId)
      if (participant) {
        participant.location = data.location
      }
    })

    // --- Heartbeat (PONG desde el servidor)
    socket.value.on(SOCKET_EVENTS.PONG, () => {
      lastPing.value = new Date()
    })
  }

  // --- Heartbeat control ---
  const startHeartbeat = () => {
    if (heartbeatInterval.value) return
    heartbeatInterval.value = setInterval(() => {
      if (socket.value?.connected) {
        ping()
      }
    }, 15000) // cada 15s
  }

  const stopHeartbeat = () => {
    if (heartbeatInterval.value) {
      clearInterval(heartbeatInterval.value)
      heartbeatInterval.value = null
    }
  }

  const pauseHeartbeat = () => {
    heartbeatPaused.value = true
    stopHeartbeat()
  }

  const resumeHeartbeat = () => {
    heartbeatPaused.value = false
    if (socket.value?.connected) startHeartbeat()
  }

  // --- Limpiador de typingUsers ---
  const startTypingCleaner = () => {
    if (typingCleanerInterval.value) return
    typingCleanerInterval.value = setInterval(() => {
      const now = new Date()
      typingUsers.value = typingUsers.value.filter(user => {
        return now - new Date(user.timestamp) < 5000 // 5s
      })
    }, 1000)
  }

  const stopTypingCleaner = () => {
    if (typingCleanerInterval.value) {
      clearInterval(typingCleanerInterval.value)
      typingCleanerInterval.value = null
    }
  }

  // Unirse a room
  const joinRoom = (roomId, userData = {}) => {
    if (!socket.value?.connected) {
      toast.error('No hay conexión al servidor')
      return
    }
    console.log('🏠 Uniéndose al room:', roomId)
    socket.value.emit(SOCKET_EVENTS.JOIN_ROOM, { roomId, ...userData })
  }

  // Salir de room
  const leaveRoom = () => {
    if (!socket.value?.connected || !currentRoom.value) return
    console.log('🚪 Saliendo del room:', currentRoom.value.id)
    socket.value.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId: currentRoom.value.id })
  }

  // Enviar mensaje
  const sendMessage = (content, type = 'text') => {
    if (!socket.value?.connected || !currentRoom.value) {
      toast.error('No estás conectado a un room')
      return
    }
    const message = {
      roomId: currentRoom.value.id,
      content,
      type,
      timestamp: new Date()
    }
    console.log('💬 Enviando mensaje:', message)
    socket.value.emit(SOCKET_EVENTS.SEND_MESSAGE, message)
  }

  // Indicar que está escribiendo
  const setTyping = (isTyping) => {
    if (!socket.value?.connected || !currentRoom.value) return
    socket.value.emit(isTyping ? SOCKET_EVENTS.TYPING_START : SOCKET_EVENTS.TYPING_STOP, {
      roomId: currentRoom.value.id
    })
  }

  // Actualizar ubicación
  const updateLocation = (location) => {
    if (!socket.value?.connected) return
    socket.value.emit(SOCKET_EVENTS.UPDATE_LOCATION, {
      roomId: currentRoom.value?.id,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        timestamp: new Date()
      }
    })
  }

  // Enviar ping
  const ping = () => {
    if (!socket.value?.connected) return
    socket.value.emit(SOCKET_EVENTS.PING, { timestamp: new Date() })
  }

  // Utilidades para mensajes
  const addMessage = (message) => {
    messages.value.push({
      ...message,
      id: message.id || Date.now(),
      read: false,
      timestamp: new Date(message.timestamp || Date.now())
    })
    if (messages.value.length > 100) {
      messages.value = messages.value.slice(-100)
    }
  }

  const addSystemMessage = (content) => {
    addMessage({
      id: Date.now(),
      type: 'system',
      content,
      timestamp: new Date(),
      read: false
    })
  }

  const markMessagesAsRead = () => {
    messages.value.forEach(message => { message.read = true })
  }

  const clearMessages = () => { messages.value = [] }

  // Información de conexión
  const getConnectionInfo = () => {
    if (!socket.value) return null
    return {
      connected: socket.value.connected,
      id: socket.value.id,
      transport: socket.value.io.engine.transport.name,
      upgraded: socket.value.io.engine.upgraded,
      lastPing: lastPing.value
    }
  }

  return {
    // Estado
    socket,
    connected,
    connecting,
    currentRoom,
    roomParticipants,
    messages,
    typingUsers,
    onlineUsers,
    lastPing,

    // Getters
    isConnected,
    isInRoom,
    participantCount,
    unreadMessages,

    // Acciones
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    sendMessage,
    setTyping,
    updateLocation,
    ping,
    addMessage,
    addSystemMessage,
    markMessagesAsRead,
    clearMessages,
    getConnectionInfo,
    pauseHeartbeat,
    resumeHeartbeat
  }
})
