export default defineNuxtRouteMiddleware((to) => {
    const { token } = useAuth();

    if (!token.value) {
        return navigateTo('/login');
    }
})