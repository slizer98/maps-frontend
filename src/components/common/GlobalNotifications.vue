<template>
  <div class="fixed top-20 right-4 z-50 space-y-2">
    <transition-group
      name="notification"
      tag="div"
      class="space-y-2"
    >
      <div
        v-for="notification in appStore.notifications"
        :key="notification.id"
        :class="notificationClasses(notification.type)"
        class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <component
                :is="getIcon(notification.type)"
                :class="iconClasses(notification.type)"
                class="h-6 w-6"
              />
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p
                v-if="notification.title"
                class="text-sm font-medium text-gray-900"
              >
                {{ notification.title }}
              </p>
              <p class="text-sm text-gray-500">
                {{ notification.message }}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button
                @click="removeNotification(notification.id)"
                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span class="sr-only">Cerrar</span>
                <XMarkIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { useAppStore } from '@/stores/app'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'GlobalNotifications',
  components: {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
    XMarkIcon
  },
  setup() {
    const appStore = useAppStore()

    const getIcon = (type) => {
      const icons = {
        success: CheckCircleIcon,
        warning: ExclamationTriangleIcon,
        info: InformationCircleIcon,
        error: XCircleIcon
      }
      return icons[type] || InformationCircleIcon
    }

    const notificationClasses = (type) => {
      const classes = {
        success: 'border-l-4 border-green-400',
        warning: 'border-l-4 border-yellow-400',
        info: 'border-l-4 border-blue-400',
        error: 'border-l-4 border-red-400'
      }
      return classes[type] || classes.info
    }

    const iconClasses = (type) => {
      const classes = {
        success: 'text-green-400',
        warning: 'text-yellow-400',
        info: 'text-blue-400',
        error: 'text-red-400'
      }
      return classes[type] || classes.info
    }

    const removeNotification = (id) => {
      appStore.removeNotification(id)
    }

    return {
      appStore,
      getIcon,
      notificationClasses,
      iconClasses,
      removeNotification
    }
  }
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>

