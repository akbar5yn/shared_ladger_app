import { Preferences } from '@capacitor/preferences'

export default defineNuxtPlugin(() => {
    const capacitorStorage = {
        getItem: async (key: string) => {
            const { value } = await Preferences.get({ key })
            return value
        },
        setItem: async (key: string, value: string) => {
            await Preferences.set({ key, value })
        },
        removeItem: async (key: string) => {
            await Preferences.remove({ key })
        }
    }

    return {
        provide: {
            capStorage: capacitorStorage
        }
    }
})