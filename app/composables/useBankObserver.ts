// todo 1. add some syncTransactionsTask

import { transactionService } from '~/services/transaction.service'
import { useTransactionStore } from '~/stores/useTransactionStore'
import { isAllowedPackage } from '../../constant/package.helper'
import type { TBankNotificationPayload } from '~/types/INotification';
import { useBankStore } from '~/stores/banks';
import { notificationStorage } from '~/services/notificationStorage';

const NotificationStorage = notificationStorage()
let isObserved = false

export const useBankObserver = () => {
  const transactionStore = useTransactionStore()
  const bankStore = useBankStore()
  const isLoadingGudang = ref(false)

  const sendToIngest = async (item: TBankNotificationPayload, source: string) => {
    try {
      if (!isAllowedPackage(item.pkg)) {
        console.warn('BLOCKED INGEST:', item.pkg)
        return
      }
      console.log('soruce:', source);

      return await transactionService().ingest({
        title: item.title,
        text: item.text,
        pkg: item.pkg,
        timestamp: item.timestamp,
      })
    } catch (err) {
      console.error('INGEST ERROR', err)
    }
  }

  const checkPendingData = async (retryCount = 0) => {
    if (retryCount === 0) isLoadingGudang.value = true
    try {
      const result = await NotificationStorage.getPendingNotifications()
      console.log('pendingData:', result)

      if ((!result?.data || result.data === '[]') && retryCount < 3) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        return checkPendingData(retryCount + 1)
      }
      if (!result?.data) return

      const notifications = JSON.parse(result.data)

      for (const item of notifications) {
        const res = await sendToIngest(item, 'pending')

        if (res?.success === true) {
          const tx = res.data.transactions
          // addPending sudah dedupe by id -> hindari duplikat dari
          // listener socket ledger:pending untuk notif yang sama.
          if (tx.accountId === bankStore.activeAccountId) {
            transactionStore.addPending(tx)
          }
          if (item.id) {
            await NotificationStorage.removePendingNotification({
              id: item.id,
            })
            console.log('🧹 REMOVED FROM GUDANG:', item.id)
          }
        }
        // transactionStore.addTransaction(item)
      }
    } catch (e) {
      console.error('Gagal cek gudang', e)
    }
  }

  const handleComeTransaction = () => {
    if (!import.meta.client || isObserved) return

    window.addEventListener('onBankNotification', (async (event: Event) => {
      const customEvent = event as CustomEvent<TBankNotificationPayload>
      console.log('onBankNotification', customEvent)

      if (customEvent.detail) {
        const res = await sendToIngest(customEvent.detail, 'realtime')
        if (res?.success === true) {
          const tx = res.data.transactions
          // addPending dedupe by id -> mencegah dobel sama seperti
          // listener socket ledger:pending.
          if (tx.accountId === bankStore.activeAccountId) {
            transactionStore.addPending(tx)
          }
          const pendingId = customEvent.detail.id
          if (pendingId) {
            await NotificationStorage.removePendingNotification({
              id: pendingId,
            })
            console.log('🧹 REMOVED FROM GUDANG:', pendingId)
          }
        }
        // transactionStore.addTransaction(customEvent.detail)
      }
    }) as EventListener)

    checkPendingData()

    isObserved = true
  }

  async function getPendingTransaction(accountId?: string) {
    try {
      const res = await transactionService().getPending(accountId ?? '')
      transactionStore.setPendingTransaction(res)
    } catch (err) {
      console.error('INGEST ERROR', err)
    }
  }

  async function getAccount() {
    try {
      const res = await transactionService().getAccount()
      if (res.success) {
        const prevIndex = bankStore.currentIndex
        bankStore.setAccounts(res.data)
        // Pertahankan posisi swipe (jangan reset ke 0) kalau masih valid,
        // biar notifikasi realtime gak "loncat" ke kartu pertama.
        if (prevIndex > 0 && prevIndex < res.data.length) {
          bankStore.currentIndex = prevIndex
          bankStore.updateActiveId()
        }
      }
    } catch (err) {
      console.error('GET ACCOUNT ERROR', err)
    }
  }

  return { handleComeTransaction, checkPendingData, getPendingTransaction, getAccount }
}
