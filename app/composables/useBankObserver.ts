import { useTransactionStore } from "~/stores/useTransactionStore"
import type { MyBankEvent } from "~/types/INotification";

let isObserved = false;

export const useBankObserver = () => {
    const transactionStore = useTransactionStore()

    const handleComeTransaction = () => {
        if (!process.client || isObserved) return

        window.addEventListener("onBankNotification", ((event: MyBankEvent) => {
            const { pkg, title, text } = event.data;
            transactionStore.addTransaction(event.data)
        }) as EventListener)
        isObserved = true;
    }

    return {
        handleComeTransaction
    }
}