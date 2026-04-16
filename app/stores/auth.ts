import { defineStore } from "pinia";
import type { IUser, ILoginResponse } from "~/types/IUser";
import { Preferences } from '@capacitor/preferences'

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as IUser | null,
    isGuest: false,
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
        await Preferences.set({ key: 'is_guest', value: 'false' })
      }
    },

    async setGuestMode(status: boolean) {
      this.isGuest = status;
      this.isLoggedIn = false;
      this.token = null;
      this.hydrated = true;

      await Preferences.set({
        key: 'is_guest',
        value: status.toString()
      });
      await Preferences.remove({ key: 'auth_token' });
    },

    async restoreSession() {
      // await appLog('[AUTH] restoreSession start')

      const { value } = await Preferences.get({ key: 'auth_token' })
      const { value: guestStatus } = await Preferences.get({ key: 'is_guest' })

      // await appLog('[AUTH] token = ' + (value ? 'FOUND' : 'EMPTY'))
      // await appLog('[AUTH] isGuest = ' + guestStatus)

      if (!value) {
        this.token = null;
        this.isLoggedIn = false;
        this.hydrated = true;
        // return await appLog('Token empty, isGuest: ' + this.isGuest)
      }
      if (value) {
        this.token = value
        this.isLoggedIn = true
        this.isGuest = false
      }

      this.hydrated = true
      // await appLog('[AUTH] hydrated = true')
    },

    async logout() {

      await Preferences.remove({ key: 'auth_token' })
      await Preferences.remove({ key: 'is_guest' })
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
    pick: ['user', 'token', 'isLoggedIn', 'isGuest'],
    key: 'auth_session'
  },
});
