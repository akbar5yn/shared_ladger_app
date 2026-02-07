import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware(() => {
    const { isLoggedIn } = useAuth()

    if (isLoggedIn.value) {
        return navigateTo('/dashboard')
    }
})
