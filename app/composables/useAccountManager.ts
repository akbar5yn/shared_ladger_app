import { transactionService } from '~/services/transaction.service'
import { useBankObserver } from '~/composables/useBankObserver'
import { useBankStore } from '~/stores/banks'
import { useTransactionStore } from '~/stores/useTransactionStore'

// Daftar bank yang didukung backend (nama akun harus mengandung keyword ini,
// cek detectBank di backend: aladin, bca, bni, telegram).
export interface ISupportedBank {
    name: string // keyword untuk backend (account.name)
    label: string // teks yang ditampilkan ke user
    icon: string
}

export const SUPPORTED_BANKS: ISupportedBank[] = [
    { name: 'telegram', label: 'Telegram', icon: 'i-heroicons-paper-airplane' },
    { name: 'aladin', label: 'Aladin', icon: 'i-heroicons-banknotes' },
    { name: 'bca', label: 'BCA', icon: 'i-heroicons-building-library' },
    { name: 'bni', label: 'BNI', icon: 'i-heroicons-building-office-2' },
]

export const useAccountManager = () => {
    const isOpen = useState<boolean>('accountManager_isOpen', () => false)
    const isCreating = useState<boolean>('accountManager_isCreating', () => false)

    const bankStore = useBankStore()
    const transactionStore = useTransactionStore()
    const { getAccount } = useBankObserver()
    const { createAccount } = transactionService()

    const open = () => { isOpen.value = true }
    const close = () => { isOpen.value = false }

    // Cek apakah akun untuk bank tertentu sudah dibuat (case-insensitive match).
    const isCreated = (name: string): boolean =>
        bankStore.accounts.some((a) => a.name.toLowerCase().includes(name.toLowerCase()))

    const createOne = async (name: string) => {
        try {
            await createAccount(name)
        } catch {
            // abaikan kalau sudah ada / gagal, akan diverifikasi via refreshAccount
        } finally {
            await refreshAccount()
        }
    }

    const refreshAccount = async () => {
        await getAccount()
        const first = bankStore.accounts[0]
        if (first) {
            await transactionStore.setActualBalance(first.balance)
            bankStore.updateActiveId()
        }
    }

    const createSelected = async (names: string[]) => {
        isCreating.value = true
        try {
            for (const name of names) {
                await createOne(name)
            }
        } finally {
            isCreating.value = false
        }
    }

    return { isOpen, isCreating, open, close, isCreated, createOne, createSelected, refreshAccount, SUPPORTED_BANKS }
}
