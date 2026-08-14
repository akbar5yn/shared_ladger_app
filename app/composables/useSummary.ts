import { transactionService } from "~/services/transaction.service";
import { useTransactionStore } from "~/stores/useTransactionStore";

export const useSummary = () => {

    const transactionStore = useTransactionStore()

    async function getMonthlySummary(accountId: string) {
        try {
            const res = await transactionService().getMonthlySummary(accountId)
            if (res.success) {
                transactionStore.expense = res.data.totalExpenses
                transactionStore.income = res.data.totalIncome
            }
        } catch (err) {
            console.error('Error fetching monthly summary:', err)
        }

    }

    async function getMonthlyAdvisor(accountId: string, month?: number) {
        try {
            const res = await transactionService().getMonthlyAdvisor(accountId, month)
            if (res.success) {
                transactionStore.setMonthlyAdvisor(res.data)
            }
        } catch (err) {
            console.error('Get advisor error', err)
        }

    }

    return {
        getSummary: getMonthlySummary,
        getAdvisor: getMonthlyAdvisor,
    }
}