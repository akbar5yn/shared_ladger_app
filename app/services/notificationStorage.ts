import { registerPlugin } from '@capacitor/core'

// Interface gabungan dari dua pemanggil lama (history page + useBankObserver).
export interface NotificationStoragePlugin {
    triggerImport(): Promise<void>
    getPendingNotifications(): Promise<{ data?: string }>
    removePendingNotification(options: { id: string }): Promise<void>
}

// Daftarkan plugin sekali saja. Pemanggil pakai getter ini supaya
// registerPlugin tidak dipanggil berulang (yang memunculkan warning Capacitor).
let plugin: NotificationStoragePlugin | null = null

export const notificationStorage = (): NotificationStoragePlugin => {
    if (!plugin) {
        plugin = registerPlugin<NotificationStoragePlugin>('NotificationStorage')
    }
    return plugin
}
