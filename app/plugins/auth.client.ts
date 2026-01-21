import { useAuthStore } from "~/stores/auth"

export default defineNuxtPlugin(async () => {
    const auth = useAuthStore()

    await appLog('[PLUGIN] auth.client loaded')

    await auth.restoreSession()

    await appLog(
        `[PLUGIN] restore done | token=${auth.token ? 'YES' : 'NO'}`
    )
})
