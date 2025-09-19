import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI, handleAPIError } from '@/services/api'
import { auth, googleProvider } from '@/services/firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth'
import { useToast } from 'vue-toastification'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref(null)
  const token = ref(localStorage.getItem('authToken'))
  const loading = ref(false)
  const initialized = ref(false)

  const toast = useToast()

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isDriver = computed(() => user.value?.role === 'driver')
  const isPassenger = computed(() => user.value?.role === 'passenger')

  // Acciones
  const setUser = (userData) => {
    user.value = userData
  }

  const setToken = (tokenValue) => {
    token.value = tokenValue
    if (tokenValue) {
      localStorage.setItem('authToken', tokenValue)
    } else {
      localStorage.removeItem('authToken')
    }
  }

  const clearAuth = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('authToken')
  }

  // Inicializar autenticación
  const initAuth = () => {
    return new Promise((resolve) => {
      if (initialized.value) {
        resolve()
        return
      }

      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser && token.value) {
          try {
            // Verificar usuario en backend
            const response = await authAPI.me()
            setUser(response.data.user)
          } catch (error) {
            console.error('Error verificando usuario:', error)
            clearAuth()
          }
        } else {
          clearAuth()
        }
        
        initialized.value = true
        resolve()
      })
    })
  }

  // Login con email y contraseña
  const loginWithEmail = async (email, password) => {
    try {
      loading.value = true

      // Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await userCredential.user.getIdToken()

      // Autenticar con backend
      const response = await authAPI.login(idToken)
      
      setToken(idToken)
      setUser(response.data.user)
      
      toast.success('¡Bienvenido de vuelta!')
      router.push('/')
      
      return response.data

    } catch (error) {
      console.error('Error en login:', error)
      const message = handleAPIError(error, 'Error al iniciar sesión')
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Login con Google
  const loginWithGoogle = async () => {
    try {
      loading.value = true

      // Autenticar con Firebase
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()

      // Autenticar con backend
      const response = await authAPI.login(idToken)
      
      setToken(idToken)
      setUser(response.data.user)
      
      toast.success('¡Bienvenido!')
      router.push('/')
      
      return response.data

    } catch (error) {
      console.error('Error en login con Google:', error)
      const message = handleAPIError(error, 'Error al iniciar sesión con Google')
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Registro con email y contraseña
  const registerWithEmail = async (email, password, userData = {}) => {
    try {
      loading.value = true

      // Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Actualizar perfil en Firebase si se proporciona displayName
      if (userData.displayName) {
        await updateFirebaseProfile(userCredential.user, {
          displayName: userData.displayName
        })
      }

      const idToken = await userCredential.user.getIdToken()

      // Registrar en backend
      const response = await authAPI.register(idToken, userData)
      
      setToken(idToken)
      setUser(response.data.user)
      
      toast.success('¡Cuenta creada exitosamente!')
      router.push('/')
      
      return response.data

    } catch (error) {
      console.error('Error en registro:', error)
      const message = handleAPIError(error, 'Error al crear cuenta')
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Registro con Google
  const registerWithGoogle = async (userData = {}) => {
    try {
      loading.value = true

      // Autenticar con Firebase
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()

      // Registrar en backend
      const response = await authAPI.register(idToken, userData)
      
      setToken(idToken)
      setUser(response.data.user)
      
      toast.success('¡Cuenta creada exitosamente!')
      router.push('/')
      
      return response.data

    } catch (error) {
      console.error('Error en registro con Google:', error)
      const message = handleAPIError(error, 'Error al crear cuenta con Google')
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = async () => {
    try {
      loading.value = true

      // Logout en backend
      if (token.value) {
        try {
          await authAPI.logout()
        } catch (error) {
          console.error('Error en logout backend:', error)
        }
      }

      // Logout en Firebase
      await signOut(auth)
      
      clearAuth()
      toast.success('Sesión cerrada correctamente')
      router.push('/login')

    } catch (error) {
      console.error('Error en logout:', error)
      clearAuth()
      router.push('/login')
    } finally {
      loading.value = false
    }
  }

  // Actualizar perfil
  const updateProfile = async (data) => {
    try {
      loading.value = true

      const response = await authAPI.updateProfile(data)
      setUser(response.data.user)
      
      toast.success('Perfil actualizado correctamente')
      return response.data

    } catch (error) {
      console.error('Error actualizando perfil:', error)
      const message = handleAPIError(error, 'Error al actualizar perfil')
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Actualizar ubicación
  const updateLocation = async (location) => {
    try {
      const response = await authAPI.updateLocation(location)
      
      // Actualizar ubicación en el usuario local
      if (user.value) {
        user.value.location = response.data.location
      }
      
      return response.data

    } catch (error) {
      console.error('Error actualizando ubicación:', error)
      throw error
    }
  }

  // Obtener usuarios online
  const getOnlineUsers = async () => {
    try {
      const response = await authAPI.getOnlineUsers()
      return response.data.users
    } catch (error) {
      console.error('Error obteniendo usuarios online:', error)
      throw error
    }
  }

  // Refrescar token
  const refreshToken = async () => {
    try {
      if (auth.currentUser) {
        const newToken = await auth.currentUser.getIdToken(true)
        setToken(newToken)
        return newToken
      }
    } catch (error) {
      console.error('Error refrescando token:', error)
      logout()
    }
  }

  // Verificar estado de autenticación
  const checkAuth = async () => {
    try {
      if (!token.value) return false

      const response = await authAPI.me()
      setUser(response.data.user)
      return true
    } catch (error) {
      console.error('Error verificando autenticación:', error)
      clearAuth()
      return false
    }
  }

  return {
    // Estado
    user,
    token,
    loading,
    initialized,
    
    // Getters
    isAuthenticated,
    isAdmin,
    isDriver,
    isPassenger,
    
    // Acciones
    initAuth,
    loginWithEmail,
    loginWithGoogle,
    registerWithEmail,
    registerWithGoogle,
    logout,
    updateProfile,
    updateLocation,
    getOnlineUsers,
    refreshToken,
    checkAuth,
    setUser,
    setToken,
    clearAuth
  }
})

