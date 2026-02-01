import { Preferences } from "@capacitor/preferences";
import type { IRecentTransaction } from "~/types/INotification";

const extractNominal = (text: string): number => {
    const match = text.match(/Rp(\d{1,3}(?:\.\d{3})*)/)
    if (match && match[1]) {
        return parseInt(match[1].replace(/\./g, ''))
    }
    return 0
}


export const useTransactionStore = defineStore('transaction', {
    state: () => ({
        history: [] as IRecentTransaction[],
        pendingTransactions: [] as IRecentTransaction[]
    }),

    actions: {
        async rehydrate() {
            const { $capStorage } = useNuxtApp()
            const data = await ($capStorage as any).getItem('transaction_store')
            if (data) {
                this.$patch(JSON.parse(data))
            }
        },

        async saveToDisk() {
            try {
                const { $capStorage } = useNuxtApp()
                const dataToSave = JSON.stringify({
                    history: this.history,
                    pendingTransactions: this.pendingTransactions
                })
                await ($capStorage as any).setItem('transaction_store', dataToSave)
            } catch (e) {
                console.error("❌ Gagal simpan ke disk:", e)
            }
        },
        addTransaction(payload: { title: string, text: string, pkg: string }) {
            const amount = extractNominal(payload.text)
            const { title, text, pkg } = payload

            const isAladin = pkg.toLowerCase().includes('aladin')
            const isInstagram = pkg.toLowerCase().includes('instagram')

            if (!isAladin && !isInstagram) {
                console.log(`🚫 Notif dari ${pkg} diabaikan (Bukan Aladin/IG)`)
                return
            }

            const lowerTitle = title.toLowerCase()
            const lowerText = text.toLowerCase()

            let categoryType: 'INCOME_AUTO' | 'QRIS_AUTO' | 'TRANSFER_MANUAL' | 'UNCLEAR' = 'UNCLEAR'

            if (lowerTitle.includes('uang masuk') || lowerText.includes('transfer masuk')) {
                categoryType = 'INCOME_AUTO'
            } else if (lowerTitle.includes('qris')) {
                categoryType = 'QRIS_AUTO'
            } else if (lowerText.includes('transfer berhasil') || lowerText.includes('dana') && lowerText.includes('terkirim')) {
                categoryType = 'TRANSFER_MANUAL'
            }

            const newEntry: IRecentTransaction = {
                id: `tr-${Date.now()}`,
                title: title,
                text: text,
                amount: amount,
                icon: categoryType === 'INCOME_AUTO' ? 'i-heroicons-arrow-down-left' : 'i-heroicons-arrow-up-right',
                type: categoryType === 'INCOME_AUTO' ? 'income' : 'expense',
                date: new Date().toLocaleDateString('id-ID'),
                time: new Date().toLocaleTimeString('id-ID'),
                metadata: categoryType
            }

            this.pendingTransactions.unshift(newEntry)
            this.saveToDisk()
        },

        confirmTransaction(id: string | number, category: string, finalType: 'income' | 'expense') {
            const index = this.pendingTransactions.findIndex(t => t.id === id)

            if (index !== -1) {
                const item = this.pendingTransactions[index]
                if (item) {
                    const iconMap: Record<string, string> = {
                        'Makan/Minum': 'i-heroicons-utensils',
                        'Belanja': 'i-heroicons-shopping-bag',
                        'Gaji / Income': 'i-heroicons-banknotes',
                        'Tabungan': 'i-heroicons-building-library',
                        'Kirim Orang Tua': 'i-heroicons-heart',
                        'Cicilan/Tagihan': 'i-heroicons-document-text',
                        'Jajan': 'i-heroicons-ticket'
                    }

                    const confirmedData: IRecentTransaction = {
                        id: item.id,
                        title: category,
                        text: item.text,
                        icon: iconMap[category] || 'i-heroicons-hashtag',
                        date: item.date,
                        time: item.time,
                        amount: item.amount,
                        type: finalType
                    }

                    this.history.unshift(confirmedData)
                }
                this.pendingTransactions.splice(index, 1)
                this.saveToDisk()
            }
        },

        async removePending(id: string | number) {
            const index = this.pendingTransactions.findIndex(t => t.id === id)
            if (index !== -1) {
                this.pendingTransactions.splice(index, 1)
                await this.saveToDisk() // Jangan lupa simpan perubahan
            }
        }
    }
})