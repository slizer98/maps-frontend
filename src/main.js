import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

// Estilos
import './assets/css/main.css'

// Toast notifications
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Configuración de toast
const toastOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
}

// Crear aplicación
const app = createApp(App)

// Plugins
app.use(createPinia())
app.use(router)
app.use(Toast, toastOptions)

// Configuración global
app.config.globalProperties.$APP_NAME = 'Maps App'
app.config.globalProperties.$APP_VERSION = '1.0.0'

// Manejo de errores global
app.config.errorHandler = (err, vm, info) => {
  console.error('Error global:', err, info)
  
  // En producción, enviar errores a servicio de logging
  if (import.meta.env.PROD) {
    // TODO: Integrar con servicio de logging como Sentry
  }
}

// Montar aplicación
app.mount('#app')

// Service Worker para PWA (opcional)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}

