import { apiService } from "~/services/api";
import type { IUser } from "~/types/IUser";

interface ICredentials {
    email: string;
    password: string;
}

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null as IUser | null,
        token: null as string | null,
        isLoggedIn: false
    }),
    getters: {
        userInfo: (state) => state.user
    },
    actions: {
        async login(credentials: ICredentials) {
            this.token = null;
            this.user = null;
            this.isLoggedIn = false;

            // 🔑 Panggil service layer yang sudah didefinisikan
            const { data, error } = await apiService.auth.login(credentials);

            if (error) {
                throw new Error(error);
            }

            if (data?.token && data.user) {
                this.token = data.token;
                this.user = data.user;
                this.isLoggedIn = true;
                return true;
            } else {
                throw new Error("Respons API tidak valid atau tidak lengkap.");
            }
        },
        logout() {
            this.user = null;
            this.token = null;
            this.isLoggedIn = false;
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.cookies(),
    }
})