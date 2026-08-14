<template>
  <section
id="drawer"
    class="fixed inset-x-0 bottom-0 rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden transition-all"
    :style="{
      top: isMounted ? `${currentTop}px` : '100vh',
      zIndex: 100,
      transform: `translateZ(0)`,
      transition: isDragging
        ? 'none'
        : 'top 0.8s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.7s ease, border-color 0.7s ease',
    }" :class="[
      ui.isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900',
      isMounted ? 'opacity-100' : 'opacity-0',
    ]">
    <div
id="cursor-grab" class="pt-6 pb-3 cursor-grab active:cursor-grabbing touch-none select-none"
      @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
      <div class="w-16 h-1.5 bg-gray-200 rounded-full mx-auto"/>
      <div class="title-path pt-4 text-xl px-6">Dashboard</div>
    </div>

    <div class="flex-1 overflow-y-auto px-6 pb-20 no-scrollbar">
      <DashboardNav />
      <slot>
        <!-- <div class="top-24 right-4 flex flex-col gap-2 opacity-50 hover:opacity-100">
          <button
            @click="
              transactionStore.addTransaction({
                title: 'Transaksi QRIS Berhasil',
                text: 'Transaksi di warmindo putra petir sebesar Rp15.000 berhasil',
                pkg: 'Aladin',
              })
            "
            class="bg-red-500 text-white text-[10px] px-3 py-2 rounded-xl shadow-lg active:scale-95"
          >
            🔥 Test QRIS
          </button>

          <button
            @click="
              transactionStore.addTransaction({
                title: 'Transaksi Uang Masuk Berhasil',
                text: 'Transaksi transfer masuk sebesar Rp100.000 dari Akbar berhasil',
                pkg: 'Aladin',
              })
            "
            class="bg-blue-500 text-white text-[10px] px-3 py-2 rounded-xl shadow-lg active:scale-95"
          >
            📸 Test Uang Masuk
          </button>
          <button
            @click="
              transactionStore.addTransaction({
                title: 'Transfer berhasil!',
                text:
                  'Transfer berhasil! Dana Rp100.000 telah terkirim ke Akbar Pratama (****1234) via BI-FAST. [REF-9922]. Terima kasih.',
                pkg: 'Aladin',
              })
            "
            class="bg-purple-500 text-white text-[10px] px-3 py-2 rounded-xl shadow-lg active:scale-95"
          >
            💸 Test TF Keluar
          </button>
          <button
            @click="
              transactionStore.addTransaction({
                title: 'Transaksi QRIS Berhasil',
                text: 'Transaksi di SPBU PERTAMINA COCO sebesar Rp50.000 berhasil.',
                pkg: 'Aladin',
              })
            "
            class="bg-slate-600 text-white text-[10px] px-3 py-2 rounded-xl shadow-lg active:scale-95"
          >
            ⛽ Test Isi Bensin
          </button>

          <button
            @click="
              transactionStore.addTransaction({
                title: 'Transaksi Berhasil',
                text: 'Pembayaran wifi Biznet Home bulan ini Rp350.000 sukses.',
                pkg: 'Aladin',
              })
            "
            class="bg-yellow-600 text-white text-[10px] px-3 py-2 rounded-xl shadow-lg active:scale-95"
          >
            ⚡ Test Tagihan
          </button>
        </div> -->
        <div class="flex items-center justify-between mt-8 mb-4">
          <h2
class="text-lg font-bold transition-colors duration-700"
            :class="ui.isDark ? 'text-white' : 'text-slate-900'">
            Recent Transactions
          </h2>
          <button
            class="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1"
            @click="uploadReceipt">
            Upload Transaction
            <UIcon name="i-heroicons-document-arrow-up" class="text-sm" />
          </button>
        </div>
        <div class="space-y-4 mt-4">
          <!-- //SECTION pending transaction list -->
          <div
v-for="item in transactionStore.pendingOfTransactions" :key="item.id"
            class="flex flex-col p-4 rounded-2xl transition-colors gap-3 mb-4" :class="ui.isDark
              ? 'bg-slate-800/50 hover:bg-slate-800'
              : 'bg-[#fafafa] border-gray-200 border'
              ">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <UIcon :name="getTypeIcon(item.type)" class="text-amber-500 text-lg" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="font-bold text-sm truncate" :class="ui.isDark ? 'text-white' : 'text-slate-900'">
                    {{ item.title }}
                  </p>
                  <p class="text-[10px] text-gray-500 truncate">
                    {{ formatDate(item.transactionDate) }} •
                    {{ formatTime(item.transactionDate) }}
                  </p>
                </div>
              </div>
              <p
class="font-bold text-sm shrink-0" :class="item.type === 'income' ? 'text-emerald-500' : 'text-red-500'
                ">
                {{ item.type === 'income' ? '+' : '-' }}Rp
                {{ item.amount.toLocaleString('id-ID') }}
              </p>
            </div>

            <p class="text-[11px] text-gray-500 line-clamp-2 px-1">
              {{ item.description }}
            </p>

            <div class="relative flex flex-wrap gap-2 border-t pt-2 border-gray-100 dark:border-slate-700">
              <!--ANCHOR OPTIONS -->
              <button
v-for="opt in item.dynamicOptions" :key="opt.value" :class="createColorFn(opt.color)(ui.isDark)" class="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-[10px] active:scale-95 transition-all shadow-sm flex-shrink-0"
                @click="
                opt.value === 'other'
                  ? openEditModal(item)
                  : handleFinalConfirm({
                    id: item.id,
                    category: opt.value as TCategory,
                    type: opt.type
                  }, item.accountId)
                ">
                <UIcon v-if="opt.icon" :name="opt.icon" class="shrink-0" />
                <span class="truncate">{{ opt.label }}</span>
              </button>
              <!--ANCHOR TRASH BUTTON (PIN DI KANAN ATAS AREA) -->
              <button
class="absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-lg active:scale-95"
                :class="ui.isDark
                  ? 'bg-gray-300 text-slate-900'
                  : 'bg-slate-100 text-gray-500'
                  "
                @click="deleteTransaction(item.accountId, item.id)">
                <UIcon name="i-heroicons-trash" />
              </button>
            </div>
          </div>

          <!-- //SECTION Empty list -->
          <div
v-if="transactionStore.pendingOfTransactions.length === 0"
            class="flex flex-col items-center justify-center py-16 px-10 text-center">
            <div
class="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors duration-700"
              :class="ui.isDark ? 'bg-slate-800' : 'bg-gray-50'">
              <UIcon
name="i-heroicons-clock" class="text-5xl transition-colors duration-700"
                :class="ui.isDark ? 'text-slate-600' : 'text-gray-300'" />
            </div>

            <h3
class="font-bold text-sm mb-1 transition-colors duration-700"
              :class="ui.isDark ? 'text-slate-400' : 'text-gray-600'">
              Belum Ada Notif Masuk
            </h3>
            <p class="text-[10px] text-gray-400 max-w-[200px] leading-relaxed">
              Transaksi dari Bank bakal otomatis muncul di sini buat lu
              validasi.
            </p>
          </div>
        </div>
      </slot>
    </div>

    <!-- //SECTION modal -->
    <UModal v-model:open="isOcrModalOpen">
      <template #content>
        <UCard
:ui="{
          root: `rounded-2xl border-none shadow-2xl ${ui.isDark ? 'bg-slate-900' : 'bg-white'
            }`,
          header: `border-b ${ui.isDark
            ? 'bg-slate-800 border-slate-700'
            : 'bg-gray-50 border-gray-100'
            }`,
          body: 'p-6',
          footer: `p-4 ${ui.isDark ? 'bg-slate-800/50' : 'bg-gray-50/30'}`,
        }">
          <template #header>
            <h3 class="font-bold" :class="ui.isDark ? 'text-white' : 'text-slate-900'">
              Detail Struk Terdeteksi
            </h3>
          </template>

          <div class="space-y-6">
            <div
              class="p-4 rounded-2xl flex flex-col items-center justify-center border border-dashed transition-colors"
              :class="ui.isDark
                ? 'bg-slate-800/50 border-slate-700'
                : 'bg-slate-50 border-slate-200'
                ">
              <p class="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                Total Transaksi
              </p>
              <p class="text-3xl font-black text-amber-500">
                Rp {{ ocrTempData.amount.toLocaleString('id-ID') }}
              </p>
              <div class="flex items-center gap-1 mt-2 text-gray-500 text-[10px]">
                <UIcon name="i-heroicons-calendar-days" />
                {{
                  new Date(ocrTempData.timestamp).toLocaleString('id-ID', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })
                }}
              </div>
            </div>

            <UFormField
label="Masukan catatan disini" class="font-bold"
              :class="ui.isDark ? 'text-slate-200' : 'text-slate-700'">
              <UInput
v-model="ocrTempData.note" placeholder="Masukan catatan / alasan transaksi disini..."
                icon="i-heroicons-pencil-square" autofocus class="w-full" :ui="{
                  base: `
                h-12 rounded-xl text-md border border-gray-800 focus:border-gray-500 
                ring-0 focus:ring-0 transition-all focus-visible:ring-0
                ${ui.isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}
              `,
                }" />
            </UFormField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
color="neutral" variant="ghost" label="Batal" :class="ui.isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-gray-500'
                " @click="() => { isOcrModalOpen = false }" />
              <UButton
color="warning" label="Konfirmasi & Simpan" class="px-8 shadow-lg font-bold rounded-xl"
                :loading="isSaving" />
            </div>
          </template>
        </UCard>
      </template>
    </UModal>

    <UModal v-model:open="isEditModalOpen">
      <template #content>
        <UCard
:ui="{
          header: ui.isDark
            ? 'bg-slate-800 border-slate-500'
            : 'bg-gray-50 border-slate-700 text-slate-900',
          root: ui.isDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-gray-200',
        }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-bold">Edit & Kategori Lainnya</h3>
              <UButton
color="neutral" variant="ghost" icon="i-heroicons-x-mark"
                class="rounded-full bg-gray-200/50 dark:bg-slate-800" @click="() => { isEditModalOpen = false }" />
            </div>
          </template>

          <div class="space-y-6">
            <UFormField
label="Ubah Catatan / Alasan" :ui="{
              label: `font-bold transition-colors duration-500 ${ui.isDark ? 'text-slate-100' : 'text-slate-600'
                }`,
            }">
              <UInput
v-model="manualNote" icon="i-heroicons-pencil-square" class="w-full" :ui="{
                base: `
                    h-10 rounded-xl text-md border border-gray-800 focus:border-gray-500 
                    ring-0 focus:ring-0 transition-all focus-visible:ring-0
                    ${ui.isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}
                  `,
              }" />
            </UFormField>

            <div class="mt-2">
              <p
class="text-[10px] mb-2 font-bold uppercase tracking-widest"
                :class="ui.isDark ? 'text-slate-400' : 'text-gray-500'">
                Pilih Kategori Yang Sesuai
              </p>

              <div class="grid grid-cols-2 gap-2">
                <button
v-for="item in transactionStore.allCategoryOptions" :key="item.label" :class="createColorFn(item.color)(ui.isDark)" class="flex items-center gap-2 p-3 rounded-xl font-bold text-xs active:scale-95 transition-all border border-transparent hover:border-current"
                  @click="
                  handleFinalConfirm({
                    id: detailTransaction?.id,
                    category: item.value as TCategory,
                    type: item.type,
                  }, detailTransaction?.accountId ?? '')
                  ">
                  <UIcon :name="item.icon" />
                  {{ item.label }}
                </button>
              </div>
            </div>
          </div>
        </UCard>
      </template>
    </UModal>

    <ConfirmModal
variant="danger" icon="i-heroicons-trash" title="Hapus transaksi?"
      description="Saldo akun akan diperbarui otomatis setelah transaksi dihapus." confirm-text="Ya, hapus sekarang"
      cancel-text="Batal" />
  </section>
</template>

<script setup lang="ts">
import { useUIStore } from '~/stores/ui'
import { useTransactionStore } from '~/stores/useTransactionStore'
import { useDrawerUI } from '~/composables/drawer/useDrawerUI'
import { useDrawerActions } from '~/composables/drawer/useDrawerActions'
import ConfirmModal from '../ui/modals/ConfirmModal.vue'
import type { TCategory } from '~/types/ITransaction'


/**
 * // ANCHOR 1. INITIALIZATION & STORES
 */
const transactionStore = useTransactionStore()
const ui = useUIStore()
const route = useRoute()

/**
 * // ANCHOR 2. INITIALIZATION Compose
 */

const {
  currentTop,
  isDragging,
  isMounted,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  updatePositions,
  initialHeight,
  isSpendingLocked,
  initObserver,
} = useDrawerUI()

const {
  handleFinalConfirm,
  openEditModal,
  uploadReceipt,
  manualNote,
  isEditModalOpen,
  isOcrModalOpen,
  isSaving,
  ocrTempData,
  detailTransaction,
  deleteTransaction
} = useDrawerActions()

/**
 * ANCHOR 3. INTERFACES & CONFIGURATIONS
 */
// interface ICategoryOption {
//   label: string
//   icon?: string
//   value: TTransactionCategory
//   type: 'income' | 'expense'
//   color: (isDark: boolean) => string
// }

// const categoryOptions: Record<string, ICategoryOption[]> = {
//   INCOME_AUTO: [
//     {
//       label: "Gaji",
//       icon: "i-heroicons-banknotes",
//       value: "Gaji/Income",
//       type: "income",
//       color: (isDark) =>
//         isDark
//           ? "bg-emerald-500/20 text-emerald-400"
//           : "bg-emerald-500/10 text-emerald-600",
//     },
//   ],
//   QRIS_AUTO: [
//     {
//       label: "Makan",
//       icon: "i-heroicons-cake",
//       value: "Makan/Minum",
//       type: "expense",
//       color: (isDark) =>
//         isDark ? "bg-amber-200 text-black" : "bg-amber-200/40 text-amber-600",
//     },
//   ],
//   TRANSFER_MANUAL: [
//     {
//       label: "Transfer",
//       icon: "i-heroicons-paper-airplane",
//       value: "Transfer",
//       type: "expense",
//       color: (isDark) =>
//         isDark ? "bg-emerald-500 text-black" : "bg-emerald-300/30 text-emerald-600",
//     },
//   ],
//   DEFAULT: [
//     {
//       label: "Lainnya",
//       icon: "i-heroicons-ellipsis-horizontal-circle",
//       value: "Lainnya",
//       type: "expense",
//       color: (isDark) =>
//         isDark ? "bg-slate-700 text-slate-300" : "bg-slate-500/10 text-slate-600",
//     },
//   ],
// };

/**
 * ANCHOR 4. HELPER FUNCTIONS
 */

const getTypeIcon = (type: string) => {
  const map: Record<string, string> = {
    income: 'i-heroicons-arrow-down-circle',
    expense: 'i-heroicons-arrow-up-circle',
  }

  return map[type] || 'i-heroicons-question-mark-circle'
}

const createColorFn = (colorKey: string) => {
  return (isDark: boolean): string => {
    // Mapping style manual lu yang legendaris
    const styleMap: Record<string, { dark: string; light: string }> = {
      'emerald-income': {
        dark: 'bg-emerald-500/20 text-emerald-400',
        light: 'bg-emerald-500/10 text-emerald-600',
      },
      'amber-makan': {
        dark: 'bg-amber-200 text-black',
        light: 'bg-amber-200/40 text-amber-600',
      },
      'amber-jajan': {
        dark: 'bg-amber-500 text-black',
        light: 'bg-amber-500/30 text-amber-600',
      },
      'teal-belanja': {
        dark: 'bg-teal-500 text-black',
        light: 'bg-teal-500/10 text-teal-600',
      },
      'blue-transfer': {
        dark: 'bg-emerald-500 text-black', // Lu tadi di style lama pake emerald buat TF kan?
        light: 'bg-emerald-300/30 text-emerald-600',
      },
      'red-bill': {
        dark: 'bg-red-400 text-black',
        light: 'bg-red-400/20 text-red-600',
      },
      'indigo-invest': {
        dark: 'bg-indigo-500 text-black',
        light: 'bg-indigo-500/20 text-indigo-600',
      },
      'slate-transport': {
        dark: 'bg-slate-700 text-slate-300',
        light: 'bg-slate-500/10 text-slate-600',
      },
    }

    const style =
      styleMap[colorKey] ||
      (styleMap['slate-transport'] as { dark: string; light: string })
    return isDark ? style.dark : style.light
  }
}
// const getDynamicOptions = (item: any): ICategoryOption[] => {
//   const text = item.text.toLowerCase()
//   const isIncome = item.type === 'income'
//   const match = getSmartVisuals(text)

//   const finalOptions: ICategoryOption[] = []

//   // 1. Rekomendasi Utama (Pake createColorFn level atas)
//   if (match) {
//     finalOptions.push({
//       label: match.label,
//       icon: match.icon,
//       value: match.label as TTransactionCategory,
//       type: isIncome ? 'income' : 'expense',
//       color: createColorFn(match.color), // Manggil fungsi yang pake styleMap
//     })
//   }

//   // 2. Fallback / Defaults
//   const fallbackKeys = isIncome ? ['salary', 'transfer'] : ['food', 'grocery']

//   fallbackKeys.forEach((key) => {
//     const d = ICON_LIBRARY[key]
//     // Pastikan tidak duplikat dengan rekomendasi utama
//     if (d && finalOptions.length < 3 && (!match || d.label !== match.label)) {
//       finalOptions.push({
//         label: d.label,
//         icon: d.icon,
//         value: d.label as TTransactionCategory,
//         type: isIncome ? 'income' : 'expense',
//         color: createColorFn(d.color),
//       })
//     }
//   })

//   // 3. Tombol Lainnya
//   finalOptions.push({
//     label: 'Lainnya',
//     icon: 'i-heroicons-ellipsis-horizontal-circle',
//     value: 'Lainnya',
//     type: isIncome ? 'income' : 'expense',
//     color: (isDark: boolean): string =>
//       isDark
//         ? 'bg-slate-800 text-slate-300 border border-slate-700'
//         : 'bg-slate-100 text-slate-600 border border-slate-200',
//   })

//   return finalOptions
// }

/**
 * ANCHOR 5. WATCHERS & LIFECYCLE
 */

watch(
  () => ui.isPageLoading,
  async (loading) => {
    if (!loading) {
      await nextTick()
      setTimeout(() => {
        updatePositions()
        initObserver()
      }, 500)
    }
  },
)

watch(
  () => route.fullPath,
  async () => {
    isSpendingLocked.value = false
  },
)

onMounted(() => {
  initialHeight.value = window.innerHeight
  const mainSlot = document.getElementById('main-slot')
  if (mainSlot) {
    const resizeObserver = new ResizeObserver(() => updatePositions())
    resizeObserver.observe(mainSlot)
    // Cleanup reference in closure
    onUnmounted(() => resizeObserver.disconnect())
  }

  setTimeout(() => {
    updatePositions()
    isMounted.value = true
  }, 500)

  window.addEventListener('resize', updatePositions)
})

onUnmounted(() => {
  window.removeEventListener('resize', updatePositions)
})


/**
 * ANCHOR 6. Logical function
 */

</script>

<style>
section {
  will-change: transform, background-color;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
}
</style>
