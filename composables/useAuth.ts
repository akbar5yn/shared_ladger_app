// ... impor lainnya ...
import { useAuthStore } from '~/stores/auth';

export const useAuth = () => {
    const authStore = useAuthStore();
    const { notifyError, notifySuccess } = useNotifier()
    const router = useRouter();

    const isLoading = ref(false);

    const { user, isLoggedIn, token } = storeToRefs(authStore);


    const handleLogin = async (credentials: any) => {
        isLoading.value = true;
        try {
            await authStore.login(credentials);

            router.push('/dashboard');
            notifySuccess("Berhasil Login")


        } catch (error: any) {
            notifyError(error.message)

        } finally {
            isLoading.value = false;
        }
    };

    const handleLogout = () => {
        authStore.logout();
        router.push('/login');
    };

    return {
        token,
        user,
        isLoggedIn,
        handleLogin,
        logout: handleLogout,
        isLoading
    };
};