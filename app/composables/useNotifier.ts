import { useNotificationStore } from "~/stores/notification"
import type { TNotification } from "~/types/INotification"

export const useNotifier = () => {
    const notifierStore = useNotificationStore()

    const notifySuccess = (message: string, type: TNotification) => {
        notifierStore.show(message, 5000, type)
    }

    const notifyError = (message: string, type: TNotification) => {
        notifierStore.show(`Error: ${message}`, 5000, type)
    }

    return {
        notifySuccess,
        notifyError,
        isVisible: computed(() => notifierStore.isVisible),
        message: computed(() => notifierStore.message),
    }
}