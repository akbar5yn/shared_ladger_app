import { Ocr } from '@jcesarmobile/capacitor-ocr'
import { FilePicker } from '@capawesome/capacitor-file-picker'
import { useTransactionStore } from '~/stores/useTransactionStore'
import { transactionService } from '~/services/transaction.service'
import type { IConfirmTransaction, IDataTransaction } from '~/types/ITransaction';
import { useUIStore } from '~/stores/ui';
import { useAuthStore } from '~/stores/auth';

export const useDrawerActions = () => {
  const transactionStore = useTransactionStore()
  const router = useRouter();
  const ui = useUIStore()

  const { notifyError, notifySuccess } = useNotifier()
  const { logout } = useAuthStore();

  const isOcrModalOpen = ref(false)
  const isSaving = ref(false)
  const isEditModalOpen = ref(false)
  const selectedItemForEdit = ref<IDataTransaction | undefined>()
  const manualNote = ref('')
  const ocrTempData = ref({
    amount: 0,
    note: '',
    timestamp: Date.now(),
    personName: '',
    metadata: 'UNCLEAR',
    isIncome: false,
  })

  const uploadReceipt = async () => {
    try {
      const result = await FilePicker.pickFiles({
        types: ['image/png', 'image/jpeg'],
      })
      if (!result.files.length) return

      const filePath = result.files[0]?.path
      if (!filePath) return

      const { results } = await Ocr.process({ image: filePath })
      const fullText = results.map((r) => r.text).join('\n')

      // Extract Amount
      const amountMatch = fullText.match(
        /(?:Jumlah Transfer|Rp)\s*[:.]?\s*([\d.,]+)/i,
      )
      let cleanAmount = 0
      if (amountMatch && amountMatch[1]) {
        const rawAmount = String(amountMatch[1]).split(',')[0]
        if (rawAmount)
          cleanAmount = parseInt(rawAmount.replace(/[.\s]/g, '')) || 0
      }

      // Extract Name
      const nameMatch = fullText.match(
        /Tujuan\s+([A-Z\s]+?)\s+(?:Dari|Metode)/i,
      )
      const personName = nameMatch?.[1]?.trim() ?? 'Transfer Dana'

      // Extract Timestamp
      let transactionTimestamp = Date.now()
      const dateMatch = fullText.match(
        /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4}),\s+(\d{2}:\d{2})/,
      )

      if (dateMatch) {
        const [_, day, monthStr, year, time] = dateMatch
        const months: Record<string, string> = {
          Jan: '01',
          Feb: '02',
          Mar: '03',
          Apr: '04',
          Mei: '05',
          Jun: '06',
          Jul: '07',
          Agu: '08',
          Sep: '09',
          Okt: '10',
          Nov: '11',
          Des: '12',
        }

        if (monthStr) {
          const month = months[monthStr.substring(0, 3)] || '01'
          const isoDate = `${year}-${month}-${day?.padStart(2, '0')}T${time}:00`
          const parsedDate = new Date(isoDate)
          if (!isNaN(parsedDate.getTime()))
            transactionTimestamp = parsedDate.getTime()
        }
      }

      // Determine Metadata
      const isIncome = fullText.toLowerCase().includes('masuk')
      let metadata = 'UNCLEAR'
      if (
        fullText.toLowerCase().includes('bi fast') ||
        fullText.toLowerCase().includes('transfer')
      ) {
        metadata = 'TRANSFER_MANUAL'
      } else if (isIncome) {
        metadata = 'INCOME_AUTO'
      } else if (fullText.toLowerCase().includes('qris')) {
        metadata = 'QRIS_AUTO'
      }

      // Prepare Temp Data & Show Modal
      ocrTempData.value = {
        amount: cleanAmount,
        note: `Transfer ke ${personName}`,
        timestamp: transactionTimestamp,
        personName,
        metadata,
        isIncome,
      }
      isOcrModalOpen.value = true
    } catch (e) {
      console.error('Error Scan:', e)
    }
  }

  const openEditModal = (item: IDataTransaction) => {
    console.log('detail item', item);

    selectedItemForEdit.value = item
    manualNote.value = item.description
    isEditModalOpen.value = true
  }

  const handleFinalConfirm = async (params: IConfirmTransaction, accountId: string) => {
    try {
      console.log(params);

      const res = await transactionService().confirm(params, accountId)
      console.log('CONFIRM RES:', res)
      if (!res.success) {
        setTimeout(() => {
          notifyError('Gagal Mencatat Transaksi', 'error')
        }, 300)
      }
      if (res.success) {
        // Update lokal langsung (optimistic) dari response confirm.
        transactionStore.confirmTransaction(res.data)
        // Selanjutnya UI di-refresh murni dari realtime: server emit
        // `ledger:updated` (balance + summary + advisor) via Socket.IO
        // setelah transaksi tersimpan di DB. Tidak ada REST fallback polling.
        setTimeout(() => {
          notifySuccess('Transaksi berhasil dicatat', 'success')
        }, 300)
        isEditModalOpen.value = false
      }
    } catch (err) {
      console.log(err);

      console.error('INGEST ERROR', err)
    }

  }

  async function handleDeletePendingTransaction(accountId: string, transactionId: string) {
    ui.openConfirmModal({
      title: 'Hapus Transaksi?',
      description: 'Notifikasi transaksi pending ini akan dibuang permanen dari gudang local maupun database server.',
      confirmText: 'Hapus Permanen',
      cancelText: 'Gak jadi, simpan deh',
      variant: 'danger',
      icon: 'i-heroicons-trash',

      onConfirm: async () => {
        try {
          const res = await transactionService().deletePendingTransaction(accountId, transactionId)

          if (res.success) {
            // Hapus dari state global pinia transaksi
            transactionStore.removePending(res.data.id)

            // Trigger notifikasi sukses model kaca dropdown atas kita
            setTimeout(() => {
              notifySuccess(res.data.message || 'Transaksi berhasil dihapus', 'success')
            }, 300)
          }
        } catch (err) {
          console.error('Delete pending error', err)
          setTimeout(() => {
            notifyError('Gagal menghapus transaksi pending', 'error')
          }, 300)
        }
      }
    })
  }

  function handleLogout() {
    ui.openConfirmModal({
      title: 'Yakin mau keluar ?',
      description: 'Kamu harus login lagi nanti kalau mau cek pengeluaran dan monitroing keuangan mu.',
      confirmText: 'Ya, Keluar Aja',
      cancelText: 'Nggak jadi',
      variant: 'warning',
      icon: 'i-heroicons-arrow-right-on-rectangle',

      onConfirm: () => {
        logout()
        router.replace("/");
      }
    })
  }

  return {
    uploadReceipt,
    openEditModal,
    handleFinalConfirm,
    manualNote,
    isEditModalOpen,
    isOcrModalOpen,
    isSaving,
    ocrTempData,
    detailTransaction: selectedItemForEdit,
    deleteTransaction: handleDeletePendingTransaction,
    handleLogout
  }
}
