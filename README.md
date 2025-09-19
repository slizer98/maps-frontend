# Maps App Frontend

Cliente frontend para la aplicación Maps App, construido con Vue 3, Vite, Tailwind CSS y Socket.IO.

## 🚀 Instalación Rápida

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## 📋 Variables de Entorno Requeridas

```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Google Maps API
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## 🛠️ Tecnologías

- **Vue 3** - Framework frontend con Composition API
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos utility-first
- **Pinia** - Gestión de estado para Vue
- **Vue Router** - Enrutamiento SPA
- **Socket.IO Client** - Cliente para tiempo real
- **Firebase SDK** - Autenticación
- **Heroicons** - Iconografía

## 📁 Estructura

```
src/
├── components/       # Componentes reutilizables
│   ├── auth/        # Componentes de autenticación
│   ├── common/      # Componentes comunes
│   ├── layout/      # Componentes de layout
│   ├── map/         # Componentes de mapa
│   └── rooms/       # Componentes de rooms
├── views/           # Vistas/páginas principales
├── stores/          # Stores de Pinia
├── services/        # Servicios (API, Firebase)
├── utils/           # Utilidades y helpers
├── assets/          # Recursos estáticos
└── router/          # Configuración de rutas
```

## 🎨 Componentes Principales

### Layout
- `AppNavigation` - Barra de navegación principal
- `AppFooter` - Footer de la aplicación

### Comunes
- `GlobalModal` - Modal reutilizable
- `GlobalNotifications` - Sistema de notificaciones
- `GlobalConfirm` - Diálogos de confirmación

### Vistas
- `Home` - Página de inicio
- `Login/Register` - Autenticación
- `Rooms` - Lista de rooms
- `Map` - Visualización de mapa
- `Profile` - Perfil de usuario

## 🗄️ Stores (Pinia)

### `authStore`
- Gestión de autenticación con Firebase
- Login/logout con email y Google
- Estado del usuario actual

### `socketStore`
- Conexión Socket.IO
- Gestión de rooms en tiempo real
- Chat y mensajería
- Tracking de ubicaciones

### `appStore`
- Estado global de la aplicación
- Configuración y tema
- Notificaciones y modales
- Utilidades globales

## 🛣️ Rutas Principales

- `/` - Página de inicio
- `/login` - Iniciar sesión
- `/register` - Registrarse
- `/rooms` - Lista de rooms
- `/rooms/:id` - Vista de room específico
- `/map` - Mapa principal
- `/profile` - Perfil de usuario
- `/settings` - Configuración

## 🎨 Diseño Responsive

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Características
- Navegación adaptable
- Componentes responsive
- Touch-friendly en móvil
- Optimizado para diferentes pantallas

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

Los archivos se generan en la carpeta `dist/` y están listos para servir desde cualquier servidor web estático.

### Variables de Entorno en Producción
Asegúrate de configurar las variables de entorno correctas para producción, especialmente:
- URLs del API backend
- Credenciales de Firebase
- API Key de Google Maps

## 🔒 Autenticación

La aplicación utiliza Firebase Authentication con soporte para:
- Email/contraseña
- Google OAuth
- Gestión automática de tokens
- Rutas protegidas

## 🌐 Comunicación en Tiempo Real

Socket.IO se utiliza para:
- Chat en tiempo real
- Actualizaciones de ubicación
- Notificaciones de rooms
- Estado de conexión de usuarios

## 📱 PWA (Futuro)

El proyecto está preparado para convertirse en PWA con:
- Service Worker configurado
- Manifest.json
- Instalación en dispositivos móviles

## 🎯 Optimizaciones

- Lazy loading de rutas
- Componentes optimizados
- Bundle splitting automático
- Imágenes optimizadas
- CSS purging con Tailwind

## 📝 Notas de Desarrollo

- Utiliza Composition API de Vue 3
- Sigue las convenciones de Tailwind CSS
- Componentes modulares y reutilizables
- TypeScript ready (configuración incluida)
- ESLint y Prettier configurados

