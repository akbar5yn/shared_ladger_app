import { defineStore } from "pinia";
import type { IUser, ILoginResponse } from "~/types/IUser";

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
    setLoginAction(data: ILoginResponse) {
      if (data) {
        this.user = data.user
        this.token = data.token
        this.isLoggedIn = true
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isLoggedIn = false;
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      maxAge: 86400,
      path: "/",
      sameSite: "lax",
    }),
    key: 'auth_session'
  },
});
