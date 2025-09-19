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
        v-if="appStore.confirm.isOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
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
              v-if="appStore.confirm.isOpen"
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div class="sm:flex sm:items-start">
                <!-- Icono -->
                <div
                  :class="iconBackgroundClasses"
                  class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10"
                >
                  <component
                    :is="getIcon(appStore.confirm.type)"
                    :class="iconClasses"
                    class="h-6 w-6"
                  />
                </div>

                <!-- Contenido -->
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg font-medium leading-6 text-gray-900">
                    {{ appStore.confirm.title }}
                  </h3>
                  <div v-if="appStore.confirm.message" class="mt-2">
                    <p class="text-sm text-gray-500">
                      {{ appStore.confirm.message }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Botones -->
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  @click="handleConfirm"
                  :class="confirmButtonClasses"
                  class="inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {{ appStore.confirm.confirmText }}
                </button>
                <button
                  @click="handleCancel"
                  class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  {{ appStore.confirm.cancelText }}
                </button>
              </div>
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
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'GlobalConfirm',
  components: {
    ExclamationTriangleIcon,
    InformationCircleIcon,
    CheckCircleIcon,
    XCircleIcon
  },
  setup() {
    const appStore = useAppStore()

    const getIcon = (type) => {
      const icons = {
        warning: ExclamationTriangleIcon,
        danger: ExclamationTriangleIcon,
        info: InformationCircleIcon,
        success: CheckCircleIcon,
        error: XCircleIcon
      }
      return icons[type] || InformationCircleIcon
    }

    const iconBackgroundClasses = computed(() => {
      const type = appStore.confirm.type
      const classes = {
        warning: 'bg-yellow-100',
        danger: 'bg-red-100',
        info: 'bg-blue-100',
        success: 'bg-green-100',
        error: 'bg-red-100'
      }
      return classes[type] || classes.info
    })

    const iconClasses = computed(() => {
      const type = appStore.confirm.type
      const classes = {
        warning: 'text-yellow-600',
        danger: 'text-red-600',
        info: 'text-blue-600',
        success: 'text-green-600',
        error: 'text-red-600'
      }
      return classes[type] || classes.info
    })

    const confirmButtonClasses = computed(() => {
      const type = appStore.confirm.type
      const classes = {
        warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
        error: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
      }
      return classes[type] || classes.info
    })

    const handleConfirm = () => {
      if (appStore.confirm.onConfirm) {
        appStore.confirm.onConfirm()
      }
    }

    const handleCancel = () => {
      if (appStore.confirm.onCancel) {
        appStore.confirm.onCancel()
      }
    }

    return {
      appStore,
      getIcon,
      iconBackgroundClasses,
      iconClasses,
      confirmButtonClasses,
      handleConfirm,
      handleCancel
    }
  }
}
</script>

