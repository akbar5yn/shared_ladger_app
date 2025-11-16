import { useNotificationStore } from "~/stores/notification"

export const useNotifier = () => {
    const notifierStore = useNotificationStore()

    const notifySuccess = (message: string) => {
        notifierStore.show(message)
    }

    const notifyError = (message: string) => {
        notifierStore.show(`Error: ${message}`, 5000)
    }

    return {
        notifySuccess,
        notifyError,
        isVisible: computed(() => notifierStore.isVisible),
        message: computed(() => notifierStore.message),
    }
}