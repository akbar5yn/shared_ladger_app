export const useNotificationStore = defineStore('notification', {
    state: () => ({
        message: "",
        isVisible: false,
        timer: null as ReturnType<typeof setTimeout> | null,
    }),
    actions: {
        show(message: string, duration = 3000) {
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.message = message
            this.isVisible = true

            this.timer = setTimeout(() => {
                this.isVisible = false
                this.message = ''
            }, duration)
        },
        hide() {
            this.isVisible = false
            this.message = ''
        }
    }
})