import { defineStore } from "pinia";
import type { IUser, ILoginResponse } from "~/types/IUser";
import { Preferences } from '@capacitor/preferences'

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as IUser | null,
    token: null as string | null,
    isLoggedIn: false,
    hydrated: false
  }),
  getters: {
    userInfo: (state) => state.user,
  },
  actions: {
    async setLoginAction(data: ILoginResponse) {
      if (data) {
        this.user = data.user
        this.token = data.token
        this.isLoggedIn = true
        this.hydrated = true

        await Preferences.set({
          key: 'auth_token',
          value: data.token
        })
      }
    },

    async restoreSession() {
      await appLog('[AUTH] restoreSession start')

      const { value } = await Preferences.get({ key: 'auth_token' })

      await appLog('[AUTH] token = ' + (value ? 'FOUND' : 'EMPTY'))

      if (!value) {
        this.token = null;
        this.isLoggedIn = false;
        this.hydrated = true;
        return await appLog('because token is empty so hydrate is false')
      }
      if (value) {
        this.token = value
        this.isLoggedIn = true
      }

      this.hydrated = true
      await appLog('[AUTH] hydrated = true')
    },

    async logout() {

      await Preferences.remove({ key: 'auth_token' })
      document.cookie = 'auth_session=; Max-Age=0; path=/;'
      this.hydrated = false
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
    pick: ['user', 'token', 'isLoggedIn'],
    key: 'auth_session'
  },
});
