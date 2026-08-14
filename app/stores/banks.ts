import { defineStore } from 'pinia'
import aladinIc from '~/assets/banks/aladinIc.png'
import bcaIc from '~/assets/banks/bcaIc.png'
import briIc from '~/assets/banks/briIc.png'
import type { IDataAccount } from '~/types/ITransaction';

const ASSET_MAP: Record<string, { logo: string; glowColor: string; imSize: string }> = {
    aladin: { logo: aladinIc, glowColor: '#3b82f6', imSize: 'w-14 h-10' },
    bca: { logo: bcaIc, glowColor: '#3b82f6', imSize: 'w-14 h-10' },
    bri: { logo: briIc, glowColor: '#0ea5e9', imSize: 'w-14 h-10' },
    default: { logo: aladinIc, glowColor: '#64748b', imSize: 'w-14 h-10' }
}

export const useBankStore = defineStore('banks', {
    state: () => ({
        accounts: [] as IDataAccount[],
        currentIndex: 0 as number,
        isLoading: false as boolean,
        activeAccountId: '' as string,
    }),

    getters: {
        currentAccount(state): IDataAccount | null {
            if (state.accounts.length === 0) return null

            const account = state.accounts[state.currentIndex] || state.accounts[0]

            if (!account) return null

            return account as unknown as IDataAccount
        },

        currentBankTheme(): { logo: string; glowColor: string; imSize: string } {
            const account = this.currentAccount
            if (!account) return ASSET_MAP.default as { logo: string; glowColor: string; imSize: string }

            const key = account.name.toLowerCase()
            const selectedAsset = ASSET_MAP[key]

            if (selectedAsset) {
                return selectedAsset as { logo: string; glowColor: string; imSize: string }
            }

            return ASSET_MAP.default as { logo: string; glowColor: string; imSize: string }
        }
    },

    actions: {
        updateActiveId() {
            if (this.currentAccount) {
                this.activeAccountId = this.currentAccount.id
            }
        },

        nextBank(): 'right' | 'none' {
            if (this.accounts.length <= 1) return 'none'
            this.currentIndex = (this.currentIndex + 1) % this.accounts.length
            this.updateActiveId()
            return 'right'
        },

        prevBank(): 'left' | 'none' {
            if (this.accounts.length <= 1) return 'none'
            this.currentIndex = (this.currentIndex - 1 + this.accounts.length) % this.accounts.length
            this.updateActiveId()
            return 'left'
        },

        // 🛠️ Tambahkan Action ini untuk menangkap data dari service API-mu
        setAccounts(payloadData: IDataAccount[]) {
            this.accounts = payloadData
            this.currentIndex = 0 // Kembalikan slide ke kartu pertama
            this.updateActiveId() // Otomatis set ID aktif dari kartu pertama tersebut
        }
    }
})