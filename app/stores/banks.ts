import { defineStore } from 'pinia'
import aladinIc from '~/assets/banks/aladinIc.png'
import bcaIc from '~/assets/banks/bcaIc.png'
import briIc from '~/assets/banks/briIc.png'
import bniIc from '~/assets/banks/bniIc.webp'
import danaIc from '~/assets/banks/danaIc.png'
import gopayIc from '~/assets/banks/gopayIc.webp'
import type { IDataAccount } from '~/types/ITransaction';

// logo bisa berupa URL gambar (bank yang didukung) ATAU string icon (fallback).
// isImage: true kalau logo berupa URL gambar, false kalau berupa nama UIcon.
interface BankAsset {
    logo: string
    glowColor: string
    imSize: string
    isImage: boolean
}

// Default fallback bertipe eksplisit BankAsset (bukan lewat Record index)
// supaya akses ASSET_MAP.default selalu BankAsset, bukan BankAsset | undefined.
const DEFAULT_ASSET: BankAsset = {
    logo: 'i-heroicons-credit-card',
    glowColor: '#64748b',
    imSize: 'w-14 h-10',
    isImage: false,
}

// Pakai tipe object dengan key pasti (bukan Record<string, ...>) biar
// akses .aladin/.bca/.default tidak di-infer undefined oleh noUncheckedIndexedAccess.
const ASSET_MAP: {
    aladin: BankAsset
    bca: BankAsset
    bri: BankAsset
    bni: BankAsset
    dana: BankAsset
    gopay: BankAsset
    default: BankAsset
} = {
    aladin: { logo: aladinIc, glowColor: '#3b82f6', imSize: 'w-14 h-10', isImage: true },
    bca: { logo: bcaIc, glowColor: '#3b82f6', imSize: 'w-14 h-10', isImage: true },
    bri: { logo: briIc, glowColor: '#0ea5e9', imSize: 'w-14 h-10', isImage: true },
    bni: { logo: bniIc, glowColor: '#F47325', imSize: 'w-14 h-10', isImage: true },
    dana: { logo: danaIc, glowColor: '#1e88e5', imSize: 'w-14 h-10', isImage: true },
    gopay: { logo: gopayIc, glowColor: '#00aa13', imSize: 'w-14 h-10', isImage: true },
    // Fallback untuk bank tak dikenal (custom): pakai icon, bukan gambar.
    default: DEFAULT_ASSET,
}

export const useBankStore = defineStore('banks', {
    state: () => ({
        accounts: [] as IDataAccount[],
        currentIndex: 0 as number,
        isLoading: false as boolean,
        activeAccountId: '' as string,
        // True saat user berada di slide "Tambah Akun" (bukan kartu akun sungguhan).
        atAddCard: false as boolean,
    }),

    getters: {
        currentAccount(state): IDataAccount | null {
            if (state.accounts.length === 0) return null

            const account = state.accounts[state.currentIndex] || state.accounts[0]

            if (!account) return null

            return account as unknown as IDataAccount
        },

        currentBankTheme(): BankAsset {
            const account = this.currentAccount
            if (!account) return DEFAULT_ASSET

            const key = account.name.toLowerCase()
            // key bertipe string → akses index bisa undefined; fallback eksplisit.
            const selectedAsset = (ASSET_MAP as Record<string, BankAsset>)[key]

            return selectedAsset ?? DEFAULT_ASSET
        }
    },

    actions: {
        updateActiveId() {
            if (this.currentAccount) {
                this.activeAccountId = this.currentAccount.id
            }
        },

        setAddCard(status: boolean) {
            this.atAddCard = status
        },

        nextBank(): 'right' | 'none' {
            // Jangan wrap-around: stop di akun terakhir (index 0..length-1).
            // Boundary "tambah akun" ditangani oleh BalanceCard lewat isAtLastAccount.
            if (this.currentIndex >= this.accounts.length - 1) return 'none'
            this.currentIndex = this.currentIndex + 1
            this.updateActiveId()
            return 'right'
        },

        prevBank(): 'left' | 'none' {
            // Stop di index 0 — ini yang diminta biar gak scroll terus ke kiri.
            if (this.currentIndex <= 0) return 'none'
            this.currentIndex = this.currentIndex - 1
            this.updateActiveId()
            return 'left'
        },

        // 🛠️ Tambahkan Action ini untuk menangkap data dari service API-mu
        setAccounts(payloadData: IDataAccount[]) {
            this.accounts = payloadData
            this.currentIndex = 0 // Kembalikan slide ke kartu pertama
            this.atAddCard = false // reset posisi slide tambah akun
            this.updateActiveId() // Otomatis set ID aktif dari kartu pertama tersebut
        }
    }
})