import { loginService, type TCredentials } from '~/services/auth.service'
import { useAuthStore } from '~/stores/auth'
import type { TLoginResult } from '~/types/IUser'

export const useAuth = () => {
  const authStore = useAuthStore()
  const { notifyError, notifySuccess } = useNotifier()
  const router = useRouter()
  const isLoading = ref(false)

  const useLogin = async (credentials: TCredentials): Promise<TLoginResult> => {
    isLoading.value = true

    const { data, error } = await loginService(credentials)

    isLoading.value = false

    if (error) {
      return {
        success: false,
        message: error.message || 'Login failed',
        errors: error.errors || {
          Format: [],
          Email: [],
          Password: [],
        },
      }
    }

    return {
      success: true,
      data: data!,
    }
  }

  const handleUserLogin = async (credentials: TCredentials) => {
    const res = await useLogin(credentials)

    if (!res.success) {
      notifyError(res.message, 'error')
      authStore.setAuthError({
        errors: res.errors,
      })
      return
    }

    await authStore.setLoginAction(res.data)
    await router.push('/dashboard')

    setTimeout(() => {
      notifySuccess('Selamat datang di Shared Lager App', 'success')
    }, 300)
  }

  const handleLogout = () => {
    authStore.logout()
    router.push('/login')
  }

  return {
    token: computed(() => authStore.token),
    isLoggedIn: computed(() => authStore.isLoggedIn),
    useLogin,
    handleUserLogin,
    logout: handleLogout,
    isLoading,
  }
}
