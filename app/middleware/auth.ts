import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware(async (to, from) => {
    const auth = useAuthStore()

    if (!auth.hydrated) {
        await auth.restoreSession()
    }

    if (!auth.token) {
        appLog('[MW] No token found, redirecting to /auth')

        if (to.path !== '/auth') {
            return navigateTo('/auth')
        }
    }
})