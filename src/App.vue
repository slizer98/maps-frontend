<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Loading global -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-white z-50 flex items-center justify-center"
    >
      <div class="text-center">
        <div class="loading-spinner mx-auto mb-4"></div>
        <p class="text-gray-600">{{ loadingMessage }}</p>
      </div>
    </div>

    <!-- Aplicación principal -->
    <div v-else class="min-h-screen">
      <!-- Navegación -->
      <AppNavigation v-if="showNavigation" />

      <!-- Contenido principal -->
      <main :class="mainClasses">
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>

      <!-- Footer (solo en ciertas páginas) -->
      <AppFooter v-if="showFooter" />
    </div>

    <!-- Notificaciones globales -->
    <GlobalNotifications />

    <!-- Modal global -->
    <GlobalModal />

    <!-- Confirmación global -->
    <GlobalConfirm />
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useAppStore } from "@/stores/app";
import { useSocketStore } from "@/stores/socket";

// Componentes globales
import AppNavigation from "@/components/layout/AppNavigation.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import GlobalNotifications from "@/components/common/GlobalNotifications.vue";
import GlobalModal from "@/components/common/GlobalModal.vue";
import GlobalConfirm from "@/components/common/GlobalConfirm.vue";

export default {
  name: "App",
  components: {
    AppNavigation,
    AppFooter,
    GlobalNotifications,
    GlobalModal,
    GlobalConfirm,
  },
  setup() {
    const route = useRoute();
    const authStore = useAuthStore();
    const appStore = useAppStore();
    const socketStore = useSocketStore();

    const isLoading = ref(true);
    const loadingMessage = ref("Inicializando aplicación...");

    // Páginas que no muestran navegación
    const noNavigationPages = ["login", "register", "forgot-password"];

    // Páginas que no muestran footer
    const noFooterPages = ["room", "map"];

    const showNavigation = computed(() => {
      return authStore.isAuthenticated && !noNavigationPages.includes(route.name);
    });

    const showFooter = computed(() => {
      return !noFooterPages.includes(route.name);
    });

    const mainClasses = computed(() => {
      const classes = [];

      if (showNavigation.value) {
        classes.push("pt-16"); // Espacio para navbar fija
      }

      if (route.name === "room" || route.name === "map") {
        classes.push("h-screen"); // Altura completa para mapas
      } else {
        classes.push("min-h-screen");
      }

      return classes.join(" ");
    });

    // Inicialización de la aplicación
    const initializeApp = async () => {
      try {
        loadingMessage.value = "Verificando autenticación...";

        // Inicializar Firebase y verificar autenticación
        await authStore.initAuth();

        if (authStore.isAuthenticated) {
          loadingMessage.value = "Conectando a servidor...";

          // Conectar Socket.IO si está autenticado
          await socketStore.connect();

          loadingMessage.value = "Cargando configuración...";

          // Cargar configuración de la aplicación
          await appStore.loadConfig();
        }

        loadingMessage.value = "Finalizando...";

        // Simular un pequeño delay para mejor UX
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Error inicializando aplicación:", error);
        appStore.showError("Error al inicializar la aplicación");
      } finally {
        isLoading.value = false;
      }
    };

    // Watcher para cambios de autenticación
    watch(
      () => authStore.isAuthenticated,
      (isAuth) => {
        if (isAuth && !socketStore.isConnected) {
          socketStore.connect();
        } else if (!isAuth && socketStore.isConnected) {
          socketStore.disconnect();
        }
      }
    );

    // Manejo de visibilidad de la página
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Página oculta - reducir actividad
        socketStore.pauseHeartbeat();
      } else {
        // Página visible - reanudar actividad
        socketStore.resumeHeartbeat();

        // Verificar si necesitamos reconectar
        if (authStore.isAuthenticated && !socketStore.isConnected) {
          socketStore.connect();
        }
      }
    };

    // Manejo de conexión de red
    const handleOnline = () => {
      appStore.showSuccess("Conexión restaurada");
      if (authStore.isAuthenticated && !socketStore.isConnected) {
        socketStore.connect();
      }
    };

    const handleOffline = () => {
      appStore.showWarning("Sin conexión a internet");
    };

    // Lifecycle
    onMounted(() => {
      initializeApp();

      // Event listeners
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    });

    return {
      isLoading,
      loadingMessage,
      showNavigation,
      showFooter,
      mainClasses,
    };
  },
};
</script>

<style scoped>
.loading-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
