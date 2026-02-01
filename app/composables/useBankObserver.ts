import { useTransactionStore } from "~/stores/useTransactionStore"
import type { MyBankEvent } from "~/types/INotification";

export const useBankObserver = () => {
    const transactionStore = useTransactionStore()

    const handleComeTransaction = () => {
        if (!process.client) return

        window.addEventListener("onBankNotification", ((event: MyBankEvent) => {
            const { pkg, title, text } = event.data;
            console.log("e", pkg, title, text);
            transactionStore.addTransaction(event.data)
        }) as EventListener)
    }


    return {
        handleComeTransaction
    }
}