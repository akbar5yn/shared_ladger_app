import { type TNotification } from "~/types/INotification"

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        message: "",
        isVisible: false,
        type: 'info' as TNotification,
        timer: null as ReturnType<typeof setTimeout> | null,
    }),
    actions: {
        show(message: string, duration = 3000, type: TNotification) {
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.message = message
            this.type = type
            this.isVisible = true
            this.timer = setTimeout(() => {
                this.isVisible = false
                this.message = ''
            }, duration)
        },
    },
})