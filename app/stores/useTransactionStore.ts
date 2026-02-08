import type { IRecentTransaction, TTransactionCategory, TTransactionMetadata } from "~/types/INotification";

const extractNominal = (text: string): number => {
    const match = text.match(/Rp(\d{1,3}(?:\.\d{3})*)/)
    if (match && match[1]) {
        return parseInt(match[1].replace(/\./g, ''))
    }
    return 0
}


export const useTransactionStore = defineStore('transaction', {
    state: () => ({
        monthlyBudget: 0,
        actualBalance: 0,
        history: [] as IRecentTransaction[],
        pendingTransactions: [] as IRecentTransaction[]
    }),

    getters: {
        totalIncomes: (state) => {
            return state.history
                .filter(t => t.type === 'income')
                .reduce((acc, curr) => acc + curr.amount, 0);
        },

        totalExpenses: (state) => {
            return state.history
                .filter(t => t.type === 'expense')
                .reduce((acc, curr) => acc + curr.amount, 0);
        },

        remainingBalance(): number {
            return (this.actualBalance + this.totalIncomes) - this.totalExpenses;
        },

        spendingPercentage(): number {
            return (this.totalExpenses / this.monthlyBudget) * 100;
        },

        formatIDR: () => (val: number): string => {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency', currency: 'IDR', minimumFractionDigits: 0
            }).format(val);
        },

        activeIncomeCategories(state): TTransactionCategory[] {
            const categories = state.history
                .filter(t => t.type === 'income')
                .map(t => t.category as TTransactionCategory);

            return [...new Set(categories.filter(Boolean))];
        },

        activeCategories(state): TTransactionCategory[] {
            const categories = state.history
                .filter(t => t.type === 'expense')
                .map(t => t.category as TTransactionCategory);

            return [...new Set(categories.filter(Boolean))];
        },

        getCategoryTotal: (state) => (category: TTransactionCategory, type: 'income' | 'expense' = 'expense'): number => {
            return state.history
                .filter(t => t.category === category && t.type === type)
                .reduce((acc, curr) => acc + curr.amount, 0);
        },

        getIncomeCategoryPercentage: (state) => (category: TTransactionCategory): number => {
            const total = state.history
                .filter(t => t.type === 'income')
                .reduce((acc, curr) => acc + curr.amount, 0);

            if (total === 0) return 0;

            const categoryTotal = state.history
                .filter(t => t.category === category && t.type === 'income')
                .reduce((acc, curr) => acc + curr.amount, 0);

            return (categoryTotal / total) * 100;
        },

        getCategoryPercentage: (state) => (category: TTransactionCategory): number => {
            const total = state.history
                .filter(t => t.type === 'expense')
                .reduce((acc, curr) => acc + curr.amount, 0);

            if (total === 0) return 0;

            const categoryTotal = state.history
                .filter(t => t.category === category && t.type === 'expense')
                .reduce((acc, curr) => acc + curr.amount, 0);

            return (categoryTotal / total) * 100;
        },

        formattedTotalExpenses(): string {
            return this.formatIDR(this.totalExpenses);
        }
    },

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
                    pendingTransactions: this.pendingTransactions,
                    monthlyBudget: this.monthlyBudget,
                    actualBalance: this.actualBalance
                })
                await ($capStorage as any).setItem('transaction_store', dataToSave)
            } catch (e) {
                console.error("❌ Gagal simpan ke disk:", e)
            }
        },
        async addTransaction(payload: { title: string, text: string, pkg: string, timestamp?: number }) {
            const { title, text, pkg, timestamp } = payload

            const nativeId = timestamp || Date.now()

            const isDuplicate = this.pendingTransactions.some(t => {
                const sameText = t.text === text;
                const isWithinTolerance = Math.abs((t.nativeId || 0) - nativeId) < 5000;
                return sameText && isWithinTolerance;
            }) || this.history.some(t => t.text === text && Math.abs((t.nativeId || 0) - nativeId) < 5000);

            if (isDuplicate) {
                return
            }

            const isAladin = pkg.toLowerCase().includes('aladin')
            const isBca = pkg.toLowerCase().includes('com.bca') || pkg.toLowerCase().includes('bca')

            if (!isAladin && !isBca) {
                return
            }

            const amount = extractNominal(text)
            const lowerTitle = title.toLowerCase()
            const lowerText = text.toLowerCase()

            let categoryType: TTransactionMetadata = 'UNCLEAR'

            if (
                lowerTitle.includes('transaksi uang masuk') ||
                lowerTitle.includes('BCA mobile') ||
                lowerText.includes('uang masuk berhasil') ||
                lowerText.includes('dana masuk') ||
                lowerText.includes('melalui layanan BI-Fast') ||
                lowerText.includes('transfer masuk')
            ) {
                categoryType = 'INCOME_AUTO'
            } else if (
                lowerTitle.includes('qris') ||
                lowerTitle.includes('transaksi qris')
            ) {
                categoryType = 'QRIS_AUTO'
            } else if (
                lowerText.includes('transfer berhasil') ||
                lowerText.includes('dana') && lowerText.includes('terkirim')
            ) {
                categoryType = 'TRANSFER_MANUAL'
            }

            const metadataIconMap: Record<string, string> = {
                'INCOME_AUTO': 'i-heroicons-arrow-down-circle',
                'QRIS_AUTO': 'i-heroicons-qr-code',
                'TRANSFER_MANUAL': 'i-heroicons-paper-airplane',
                'UNCLEAR': 'i-heroicons-question-mark-circle'
            }

            const newEntry: IRecentTransaction = {
                id: `tr-${Date.now()}`,
                nativeId: nativeId,
                title: title,
                text: text,
                amount: amount,
                icon: metadataIconMap[categoryType] || 'i-heroicons-bell',
                type: categoryType === 'INCOME_AUTO' ? 'income' : 'expense',
                date: new Date(nativeId).toLocaleDateString('id-ID'),
                time: new Date(nativeId).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
                metadata: categoryType
            }

            this.pendingTransactions.unshift(newEntry)
            await this.saveToDisk()
        },

        confirmTransaction(id: string | number, category: TTransactionCategory, finalType: 'income' | 'expense') {
            const index = this.pendingTransactions.findIndex(t => t.id === id)

            if (index !== -1) {
                const item = this.pendingTransactions[index]
                if (item) {
                    const iconMap: Record<string, string> = {
                        'Makan/Minum': 'i-heroicons-building-storefront',
                        'Belanja': 'i-heroicons-shopping-bag',
                        'Gaji/Income': 'i-heroicons-banknotes',
                        'Tabungan': 'i-heroicons-building-library',
                        'Cicilan/Tagihan': 'i-heroicons-credit-card',
                        'Transfer': 'i-heroicons-paper-airplane',
                        'Investasi': 'i-heroicons-chart-bar-square',
                        'Jajan': 'i-heroicons-ticket',
                        'Lainnya': 'i-heroicons-ellipsis-horizontal-circle'
                    }

                    const confirmedData: IRecentTransaction = {
                        id: item.id,
                        nativeId: item.nativeId,
                        title: category,
                        category: category,
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

        addManualIncome(amount: number) {
            this.actualBalance += amount;
            this.saveToDisk();
        },

        setBudget(amount: number) {
            this.monthlyBudget = amount;
            this.saveToDisk();
        },

        async removePending(id: string | number) {
            const index = this.pendingTransactions.findIndex(t => t.id === id)
            if (index !== -1) {
                this.pendingTransactions.splice(index, 1)
                await this.saveToDisk()
            }
        }
    }
})