import { defineStore } from "pinia";
import type { IUser } from "~/types/IUser";

interface ICredentials {
  email: string;
  password: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as IUser | null,
    token: null as string | null,
    isLoggedIn: false,
  }),
  getters: {
    userInfo: (state) => state.user,
  },
  actions: {
    async login(credentials: ICredentials) {
      this.token = null;
      this.user = null;
      this.isLoggedIn = false;

      try {
        const { data, error } = await useFetch("/api/auth/login", {
          method: "POST",
          body: credentials,
        });

        if (error.value) {
          throw error.value;
        }

        const response: any = data.value;
        if (response) {
          console.log('res', JSON.stringify(response, null, 2));
          this.token = response.token;
          this.user = response.user;
          this.isLoggedIn = true;
          return true;

        } else {
          throw new Error(
            "Respons API tidak valid atau tidak lengkap dari proxy."
          );
        }

      } catch (error: any) {
        const msg = error.data?.error || "Login gagal, periksa kredensial.";
        throw new Error(msg);
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      this.isLoggedIn = false;
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies(),
  },
});
