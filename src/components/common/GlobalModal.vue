<template>
  <teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="appStore.modal.isOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="handleBackdropClick"
      >
        <div class="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
          <!-- Backdrop -->
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <!-- Modal -->
          <transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to-class="opacity-100 translate-y-0 sm:scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 sm:scale-100"
            leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              v-if="appStore.modal.isOpen"
              :class="modalSizeClasses"
              class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all"
              @click.stop
            >
              <!-- Botón de cerrar -->
              <button
                v-if="appStore.modal.options.closable !== false"
                @click="closeModal"
                class="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md p-1"
              >
                <span class="sr-only">Cerrar</span>
                <XMarkIcon class="h-6 w-6" />
              </button>

              <!-- Contenido del modal -->
              <component
                :is="appStore.modal.component"
                v-bind="appStore.modal.props"
                @close="closeModal"
              />
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { XMarkIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'GlobalModal',
  components: {
    XMarkIcon
  },
  setup() {
    const appStore = useAppStore()

    const modalSizeClasses = computed(() => {
      const size = appStore.modal.options.size || 'md'
      const sizes = {
        sm: 'sm:max-w-sm sm:w-full',
        md: 'sm:max-w-md sm:w-full',
        lg: 'sm:max-w-lg sm:w-full',
        xl: 'sm:max-w-xl sm:w-full',
        '2xl': 'sm:max-w-2xl sm:w-full',
        full: 'sm:max-w-full sm:w-full sm:h-full'
      }
      return sizes[size] || sizes.md
    })

    const closeModal = () => {
      appStore.closeModal()
    }

    const handleBackdropClick = () => {
      if (appStore.modal.options.closable !== false) {
        closeModal()
      }
    }

    return {
      appStore,
      modalSizeClasses,
      closeModal,
      handleBackdropClick
    }
  }
}
</script>

