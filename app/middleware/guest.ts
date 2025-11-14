import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAuth } from '~/composables/useAuth'

export default defineNuxtRouteMiddleware(() => {
    const { isLoggedIn } = useAuth()

    if (isLoggedIn.value) {
        return navigateTo('/dashboard')
    }
})
