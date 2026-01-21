import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware(() => {
    const auth = useAuthStore()

    appLog(
        `[MW] check token=${!!auth.token} hydrated=${auth.hydrated}`
    )

    if (!auth.hydrated) return

    if (!auth.token) {
        appLog('[MW] redirect to /auth')
        return navigateTo('/auth')
    }
})
