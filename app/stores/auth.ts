import { defineStore } from 'pinia'
import type { IUser, TLoginSuccess } from '~/types/IUser'
import { Preferences } from '@capacitor/preferences'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as IUser | null,
    token: null as string | null,
    isLoggedIn: false,
    hydrated: false,
    errors: null as Record<string, string[]> | null,
  }),
  getters: {
    userInfo: (state) => state.user
  },
  actions: {
    async setLoginAction(data: TLoginSuccess) {
      if (data) {
        this.user = data.data.user
        this.token = data.data.token
        this.isLoggedIn = true
        this.hydrated = true

        await Preferences.set({
          key: 'auth_token',
          value: data.data.token,
        })
      }
    },

    async restoreSession() {
      const { value } = await Preferences.get({ key: 'auth_token' })

      if (!value) {
        this.token = null
        this.isLoggedIn = false
        this.hydrated = true
      }
      if (value) {
        this.token = value
        this.isLoggedIn = true
      }

      this.hydrated = true
    },

    async logout() {
      await Preferences.remove({ key: 'auth_token' })
      document.cookie = 'auth_session=; Max-Age=0; path=/;'
      this.hydrated = false
      this.user = null
      this.token = null
      this.isLoggedIn = false
    },

    setAuthError(error: { errors: Record<string, string[]> }) {
      this.errors = error.errors
    },

    clearField(field: string) {
      if (!this.errors) return
      const { [field]: _, ...rest } = this.errors
      this.errors = rest
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.cookies({
      maxAge: 86400,
      path: '/',
      sameSite: 'lax',
    }),
    pick: ['user', 'token', 'isLoggedIn'],
    key: 'auth_session',
  },
})
