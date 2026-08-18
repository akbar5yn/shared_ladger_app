import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware(async (to, _from) => {
    const auth = useAuthStore()

    if (!auth.hydrated) {
        await auth.restoreSession()
    }

    if (!auth.token) {
        if (to.path !== '/auth' && !to.path.startsWith('/auth')) {
            return navigateTo('/auth')
        }
    }
})