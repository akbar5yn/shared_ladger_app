import type { FetchError } from 'ofetch'
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

    try {
      const res = await loginService(credentials)

      isLoading.value = false

      return {
        success: res.success,
        data: res.data,
      }
    } catch (error: unknown) {
      const errData = (error as FetchError)?.data

      isLoading.value = false

      return {
        success: false,
        message: errData.message ?? 'Login failed',
        errors: errData?.errors ?? {
          Format: [],
          Email: [],
          Password: [],
        },
      }
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

    await authStore.setLoginAction(res)
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
