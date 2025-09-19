<template>
  <div class="bg-white">
    <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 sm:text-5xl">
          Acerca de Maps App
        </h1>
        <p class="mt-4 text-xl text-gray-600">
          Una plataforma moderna para tracking en tiempo real y colaboración
        </p>
      </div>

      <div class="mt-16">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h2>
            <p class="text-gray-600 mb-4">
              Maps App fue creada para facilitar la colaboración y comunicación entre usuarios 
              que necesitan compartir ubicaciones en tiempo real. Ya sea para delivery, 
              transporte de pasajeros, o cualquier actividad que requiera coordinación espacial.
            </p>
            <p class="text-gray-600">
              Nuestra plataforma combina la potencia de Google Maps con comunicación en tiempo 
              real para crear una experiencia única y eficiente.
            </p>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Características Principales</h2>
            <ul class="space-y-3 text-gray-600">
              <li class="flex items-start">
                <CheckIcon class="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                Tracking de ubicación en tiempo real
              </li>
              <li class="flex items-start">
                <CheckIcon class="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                Rooms colaborativos para grupos
              </li>
              <li class="flex items-start">
                <CheckIcon class="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                Chat en tiempo real
              </li>
              <li class="flex items-start">
                <CheckIcon class="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                Cálculo de rutas optimizadas
              </li>
              <li class="flex items-start">
                <CheckIcon class="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                Autenticación segura con Google
              </li>
              <li class="flex items-start">
                <CheckIcon class="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                Interfaz responsive y moderna
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">Tecnologías Utilizadas</h2>
        <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div class="text-center">
            <div class="bg-green-100 rounded-lg p-4 mb-2">
              <span class="text-2xl font-bold text-green-600">Vue 3</span>
            </div>
            <p class="text-sm text-gray-600">Frontend Framework</p>
          </div>
          <div class="text-center">
            <div class="bg-blue-100 rounded-lg p-4 mb-2">
              <span class="text-2xl font-bold text-blue-600">Express</span>
            </div>
            <p class="text-sm text-gray-600">Backend API</p>
          </div>
          <div class="text-center">
            <div class="bg-yellow-100 rounded-lg p-4 mb-2">
              <span class="text-2xl font-bold text-yellow-600">Firebase</span>
            </div>
            <p class="text-sm text-gray-600">Autenticación</p>
          </div>
          <div class="text-center">
            <div class="bg-red-100 rounded-lg p-4 mb-2">
              <span class="text-2xl font-bold text-red-600">Socket.IO</span>
            </div>
            <p class="text-sm text-gray-600">Tiempo Real</p>
          </div>
        </div>
      </div>

      <div class="mt-16 text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">¿Tienes preguntas?</h2>
        <p class="text-gray-600 mb-8">
          Estamos aquí para ayudarte. Contáctanos si tienes alguna duda o sugerencia.
        </p>
        <div class="space-x-4">
          <a
            href="mailto:support@mapsapp.com"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Contactar Soporte
          </a>
          <router-link
            to="/"
            class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Volver al Inicio
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CheckIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'About',
  components: {
    CheckIcon
  }
}
</script>

