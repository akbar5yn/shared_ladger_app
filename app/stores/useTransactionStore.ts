
import type { IDataTransaction, IDataTransactionResponse, IDynamicOption, IMonthlyAdvisorData } from '~/types/ITransaction';

interface CapStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

export const useTransactionStore = defineStore('transaction', {
  state: () => ({
    actualBalance: 0 as number,
    expense: 0 as number,
    income: 0 as number,
    history: [] as IDataTransaction[],
    pendingOfTransactions: [] as IDataTransaction[],
    allCategoryOptions: [] as IDynamicOption[],
    advisorData: null as IMonthlyAdvisorData | null,
    // Flag loading khusus fetch summary/advisor saat ganti akun (swipe).
    isSummaryLoading: false as boolean,
  }),

  getters: {
    // SECTION getter setelah implement service
    formatIDR:
      () =>
        (val: number | undefined): string => {
          return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(val ?? 0)
        },


  },

  actions: {
    async rehydrate() {
      const { $capStorage } = useNuxtApp()
      const capStorage = $capStorage as CapStorage
      const data = await capStorage.getItem('transaction_store')
      if (data) {
        const parsed = JSON.parse(data)
        // Pastikan history selalu array (data lama/persisted bisa non-array).
        if (parsed && !Array.isArray(parsed.history)) {
          parsed.history = []
        }
        if (parsed && !Array.isArray(parsed.pendingOfTransactions)) {
          parsed.pendingOfTransactions = []
        }
        this.$patch(parsed)
      }
    },

    async saveToDisk() {
      try {
        const { $capStorage } = useNuxtApp()
        const capStorage = $capStorage as CapStorage
        const dataToSave = JSON.stringify({
          history: this.history,
          // pendingTransactions: this.pendingTransactions,
          actualBalance: this.actualBalance,
          pendingOfTransactions: this.pendingOfTransactions,
        })
        await capStorage.setItem('transaction_store', dataToSave)
      } catch (e) {
        console.error('❌ Gagal simpan ke disk:', e)
      }
    },

    async removePending(id: string | number) {
      this.pendingOfTransactions = this.pendingOfTransactions.filter(
        (t) => t.id !== id
      )
    },

    // SECTION action setelah implement service 

    async setPendingTransaction(payload: IDataTransactionResponse) {
      this.pendingOfTransactions = payload.data.transactions
      this.allCategoryOptions = payload.data.allCategoryOptions
      await this.saveToDisk()
      console.log(this.pendingOfTransactions, 'cekkk')
    },

    // Set riwayat transaksi terkonfirmasi dari backend (page History).
    setHistory(transactions: IDataTransaction[]) {
      this.history = Array.isArray(transactions) ? transactions : []
      this.saveToDisk()
    },

    // Tambah satu transaksi pending (dari event realtime) tanpa duplikat.
    addPending(tx: IDataTransaction) {
      if (!tx?.id) return
      if (this.pendingOfTransactions.some((t) => t.id === tx.id)) return
      this.pendingOfTransactions.unshift(tx)
      this.saveToDisk()
    },

    async setActualBalance(amount: number) {
      this.actualBalance = amount
      await this.saveToDisk()
    },

    updateActualBalance(amount: number, type?: 'income' | 'expense') {
      if (type === 'income') {
        this.actualBalance += amount
      } else {
        this.actualBalance -= amount
      }
      this.saveToDisk()
    },


    async confirmTransaction(tx: IDataTransaction) {
      console.log('tx id:', tx.id)
      console.log('pending ids:', this.pendingOfTransactions.map(t => t.id))
      console.log('pending', this.pendingOfTransactions);

      const index = this.pendingOfTransactions.findIndex(
        (t) => t.id === tx.id
      )

      if (index !== -1) {
        this.pendingOfTransactions.splice(index, 1)
      }

      const confirmedTx: IDataTransaction = {
        ...tx,
        status: 'confirmed',
      }

      this.history.unshift(confirmedTx)

      this.updateActualBalance(tx.amount, tx.type)
    },

    async setMonthlyAdvisor(payload: IMonthlyAdvisorData) {
      this.advisorData = payload
      this.updateActualBalance(payload.income, 'income')
    },

    setSummaryLoading(status: boolean) {
      this.isSummaryLoading = status
    },
  },

})
