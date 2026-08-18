import { useAuthStore } from "~/stores/auth"
import { useSocket } from "~/composables/useSocket"
import { setApiBase } from "~/composables/useApiBase"

export default defineNuxtPlugin(async () => {
    const auth = useAuthStore()

    // Cache apiBase dari runtimeConfig saat boot (ada Nuxt context) supaya
    // socket & fetch di luar setup (pasca-await) tetap pakai host yang benar.
    setApiBase(useRuntimeConfig().public.apiBase)

    await appLog('[PLUGIN] auth.client loaded')

    await auth.restoreSession()

    await appLog(
        `[PLUGIN] restore done | token=${auth.token ? 'YES' : 'NO'}`
    )

    // Token persisten ada -> sambungkan realtime socket.
    if (auth.isLoggedIn && auth.token) {
        useSocket().connect()
    }
})
