import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

let appInstance = null
let authInstance = null
let dbInstance = null
let googleProviderInstance = null

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Inicializar Firebase
export const initializeFirebase = () => {
  try {
    if (!appInstance) {
      // Verificar que tenemos la configuración mínima
      if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
        console.warn('⚠️  Firebase no está completamente configurado')
        return null
      }

      appInstance = initializeApp(firebaseConfig)
      authInstance = getAuth(appInstance)
      dbInstance = getFirestore(appInstance)
      googleProviderInstance = new GoogleAuthProvider()
      
      console.log('✅ Firebase inicializado correctamente')
    }
    
    return appInstance
  } catch (error) {
    console.error('❌ Error inicializando Firebase:', error)
    throw error
  }
}

// Exportar instancias directamente
export const auth = authInstance || getAuth(initializeFirebase())
export const db = dbInstance || getFirestore(initializeFirebase())
export const googleProvider = googleProviderInstance || new GoogleAuthProvider()

// Verificar si Firebase está configurado
export const isFirebaseConfigured = () => {
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId)
}

// Configuración para desarrollo
if (import.meta.env.DEV) {
  // En desarrollo, puedes usar emuladores de Firebase si están configurados
  const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true'
  
  if (useEmulators) {
    console.log('🔧 Usando emuladores de Firebase para desarrollo')
    // Aquí puedes configurar los emuladores si los necesitas
    // connectAuthEmulator(auth, 'http://localhost:9099')
    // connectFirestoreEmulator(db, 'localhost', 8080)
  }
}



