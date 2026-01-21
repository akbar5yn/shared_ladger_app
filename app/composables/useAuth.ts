// ... impor lainnya ...
import { useAuthStore } from '~/stores/auth';
import { loginService, type TCredentials } from '~/services/auth.service';
import type { ILoginResponse, TLoginFailed, TLoginResult, TLoginSuccess } from '~/types/IUser';

function handleLoginSuccess(data: ILoginResponse): TLoginSuccess {
    return {
        data: data,
        success: true
    }
}

function handleLoginFailed(data: TLoginFailed): TLoginFailed {
    return {
        success: false,
        message: data.message,
        errors: {
            email: data.errors.email,
            password: data.errors.password,
            status: data.errors.status
        },
    }
}

export const useAuth = () => {
    const authStore = useAuthStore();
    const { notifyError, notifySuccess } = useNotifier()
    const router = useRouter();
    const isLoading = ref(false);


    const useLogin = async (credentials: TCredentials): Promise<TLoginResult> => {
        isLoading.value = true
        const { data, error } = await loginService(credentials)
        if (error) {
            isLoading.value = false
            return handleLoginFailed(error)
        }
        const result = handleLoginSuccess(data)
        isLoading.value = false
        return result
    }

    const handleUserLogin = async (credentials: TCredentials) => {
        const res = await useLogin(credentials)

        if (!res.success) {
            notifyError(res.message, 'error')
        }

        if (res.success) {
            await authStore.setLoginAction(res.data)
            await router.push('/dashboard')
            await nextTick()
            setTimeout(() => {
                notifySuccess('Selamat datang di Shared Lager App', 'success')
            }, 300)

        }
    }

    const handleLogout = () => {
        authStore.logout();
        router.push('/login');
    };

    return {
        token: computed(() => authStore.token),
        isLoggedIn: computed(() => authStore.isLoggedIn),
        useLogin,
        handleUserLogin,
        logout: handleLogout,
        isLoading
    };
};