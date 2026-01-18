// stores/theme.ts
export const useThemeStore = defineStore('theme', {
    state: () => ({
        isDark: false
    }),
    actions: {
        toggleTheme() {
            this.isDark = !this.isDark
            localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
        },
        initTheme() {
            const saved = localStorage.getItem('theme')
            this.isDark = saved === 'dark'
        }
    }
})