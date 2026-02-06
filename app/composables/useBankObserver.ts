import { registerPlugin } from '@capacitor/core';
import { useTransactionStore } from "~/stores/useTransactionStore";

const NotificationStorage = registerPlugin<any>('NotificationStorage');
let isObserved = false;

export const useBankObserver = () => {
    const transactionStore = useTransactionStore();
    const isLoadingGudang = ref(false);

    const checkPendingData = async (retryCount = 0) => {
        if (retryCount === 0) isLoadingGudang.value = true;
        try {
            const result = await NotificationStorage.getPendingNotifications();
            if ((!result?.data || result.data === "[]") && retryCount < 3) {
                await new Promise(resolve => setTimeout(resolve, 800));
                return checkPendingData(retryCount + 1);
            }
            if (result?.data) {
                const notifications = JSON.parse(result.data);
                notifications.forEach((item: any) => {
                    transactionStore.addTransaction({
                        title: item.title,
                        text: item.text,
                        pkg: item.pkg,
                        timestamp: item.time
                    });
                });
            }
        } catch (e) { console.error("Gagal cek gudang", e); }
    };

    const handleComeTransaction = () => {
        if (!process.client || isObserved) return

        window.addEventListener("onBankNotification", ((event: any) => {
            if (event.detail) {
                transactionStore.addTransaction(event.detail)
            }
        }) as EventListener)

        checkPendingData()

        isObserved = true
    }

    return { handleComeTransaction, checkPendingData };
};