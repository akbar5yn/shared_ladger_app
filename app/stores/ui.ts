// stores/theme.ts
export const useUIStore = defineStore('ui', {
    state: () => ({
        isDark: false,
        isLogoutModalOpen: false,
        isPageLoading: true,
    }),
    actions: {
        toggleTheme() {
            this.isDark = !this.isDark
            localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
        },
        initTheme() {
            const saved = localStorage.getItem('theme')
            this.isDark = saved === 'dark'
        },
        openLogoutModal(isOpen: boolean) {
            this.isLogoutModalOpen = isOpen
        },
        setPageLoading(status: boolean) {
            this.isPageLoading = status;
        }
    }
})