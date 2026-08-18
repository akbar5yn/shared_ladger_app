<template>
  <div class="flex flex-col gap-5">
    <DashboardHeader id="history-header" />

    <!-- Selector akun: pilih bank tanpa harus swipe di Home -->
    <ClientOnly>
      <div v-if="bankStore.accounts.length > 0" class="flex gap-2 overflow-x-auto no-scrollbar px-6 -mt-1">
        <button
v-for="(acc, i) in bankStore.accounts" :key="acc.id" type="button"
          class="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95"
          :class="bankStore.currentIndex === i
            ? 'bg-amber-400 text-slate-900 border-amber-400'
            : (ui.isDark ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200')
            " @click="selectAccount(i)">
          <UIcon :name="bankIcon(acc.name)" class="text-sm" />
          <span class="truncate max-w-[120px]">{{ acc.name }}</span>
        </button>
      </div>
    </ClientOnly>

    <main id="main-slot" class="main-history flex flex-col gap-4">
      <ClientOnly>
        <Transition name="fade-layout" mode="out-in">
          <DashboardSkeleton v-if="isLoading" key="loading" />

          <div v-else key="content" class="flex flex-col px-6">
            <section
class="relative overflow-hidden p-6 rounded-2xl shadow" :class="ui.isDark
              ? 'bg-slate-900/50 border border-slate-800 text-white'
              : 'bg-slate-100/10 text-slate-900'
              ">
              <div class="absolute -right-4 -top-4 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl" />

              <div class="flex justify-between relative z-10">
                <div class="space-y-1">
                  <p class="text-[10px] font-medium opacity-60 uppercase tracking-[0.2em]">
                    Summary Riwayat
                  </p>
                  <div class="flex items-baseline gap-1">
                    <h2 class="text-3xl font-black">
                      {{ transactionStore.history.length }}
                    </h2>
                    <span class="text-xs opacity-60 font-medium">Items</span>
                  </div>
                </div>

                <div class="text-right space-y-2">
                  <div>
                    <p class="text-[10px] opacity-50 uppercase font-bold">
                      Total Pengeluaran
                    </p>
                    <p class="text-lg font-black text-amber-400 dark:text-amber-500">
                      {{ transactionStore.formatIDR(totalExpense) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-[10px] opacity-50 uppercase font-bold">
                      Total Pemasukan
                    </p>
                    <p class="text-sm font-black text-emerald-500">
                      {{ transactionStore.formatIDR(totalIncome) }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="mt-6 space-y-2 relative z-10">
                <div class="flex justify-between items-end text-[10px] font-bold uppercase tracking-wider">
                  <span class="opacity-60">Efisiensi Saldo</span>
                  <span :class="usedPercent > 80 ? 'text-rose-500' : 'text-amber-400'">
                    {{ usedPercent }}% Terpakai
                  </span>
                </div>

                <div
                  class="w-full h-2 bg-white/10 dark:bg-slate-900/5 rounded-full overflow-hidden border border-white/5">
                  <div
class="h-full transition-all duration-1000 ease-out rounded-full" :class="[
                    usedPercent > 90
                      ? 'bg-rose-500'
                      : usedPercent > 70
                        ? 'bg-orange-400'
                        : 'bg-amber-400',
                  ]" :style="{ width: `${usedPercent}%` }" />
                </div>

                <div class="flex items-center justify-between">
                  <p class="text-[9px] opacity-40 italic leading-none max-w-[60%]">
                    *Perbandingan total pengeluaran terhadap actual current balance.
                  </p>
                  <button
                    class="flex items-center justify-center gap-2 px-3 py-1 rounded-md transition-colors active:scale-95 border border-black"
                    :class="ui.isDark
                      ? ' border border-white'
                      : 'bg-slate-100/10 text-slate-900'
                      " @click="handleImportAction">
                    <UIcon
name="i-heroicons-arrow-up-tray" class="text-[10px]"
                      :class="ui.isDark ? ' text-white' : ' text-slate-900'" />
                    <span
class="text-[8px] font-bold text-black uppercase tracking-tight"
                      :class="ui.isDark ? ' text-white' : ' text-slate-900'">
                      Import History
                    </span>
                  </button>
                </div>
              </div>
            </section>

            <div
v-if="transactionStore.history.length > 0" id="content-container"
              class="flex flex-col gap-8 no-scrollbar pt-6 pb-5">
              <div v-for="(group, date) in groupedHistory" :key="date" class="flex flex-col gap-3">
                <div class="top-2 z-10">
                  <span
class="text-xs font-bold px-3 py-1 rounded-full border shadow-sm" :class="ui.isDark
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100/10 text-slate-900'
                    ">
                    {{ date }}
                  </span>
                </div>

                <div class="flex flex-col gap-2">
                  <div
v-for="item in group" :key="item.id"
                    class="flex items-center gap-4 p-4 rounded-2xl shadow-sm border transition-transform hover:scale-[1.01]"
                    :class="ui.isDark
                      ? 'bg-slate-900 text-white border border-slate-800'
                      : 'bg-white text-slate-900 border-slate-200'
                      ">
                    <div
class="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" :class="item.type === 'income'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-rose-100 text-rose-600'
                      ">
                      <UIcon :name="categoryIcon(item.category)" />
                    </div>

                    <div class="flex-1 min-w-0">
                      <h4 class="font-bold text-sm truncate">
                        {{ item.title }}
                      </h4>
                      <p class="text-xs text-gray-500 truncate">
                        {{ item.description }}
                      </p>
                    </div>

                    <div class="text-right">
                      <p
class="font-bold text-sm" :class="item.type === 'income' ? 'text-green-600' : 'text-red-500'
                        ">
                        {{ item.type === "income" ? "+" : "-" }}
                        {{ transactionStore.formatIDR(item.amount) }}
                      </p>
                      <p class="text-[10px] text-gray-400">
                        {{ new Date(item.transactionDate ?? item.createdAt).toLocaleTimeString('id-ID', {
                          hour:
                            '2-digit', minute: '2-digit'
                        }) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-20 opacity-50">
              <UIcon name="i-heroicons-clock" class="text-6xl mb-2" />
              <p>Belum ada riwayat transaksi, Cok!</p>
            </div>
          </div>
        </Transition>
      </ClientOnly>
    </main>

    <ClientOnly>
      <ModalImport />
      <ToastModal />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from "~/components/dashboard/DashboardHeader.vue";
import ToastModal from "~/components/ui/modals/ToastModal.vue";
import ModalImport from "~/components/ui/modals/ModalImport.vue";
import { notificationStorage } from "~/services/notificationStorage";
import { useUIStore } from "~/stores/ui";
import { useTransactionStore } from "~/stores/useTransactionStore";
import { useBankStore } from "~/stores/banks";
import { transactionService } from "~/services/transaction.service";
import { useBankObserver } from "~/composables/useBankObserver";
import { useHistoryReloader } from "~/composables/useSocket";
import { ICON_LIBRARY, getSmartVisuals } from "~/utils/useIconMapper";
import type { IDataTransaction } from "~/types/ITransaction";

// 1. CONFIG & PLUGINS
definePageMeta({ middleware: ["auth"], layout: "default" });

const NotificationStorage = notificationStorage();

// 2. STORES & BASE STATES
const ui = useUIStore();
const transactionStore = useTransactionStore();
const bankStore = useBankStore();
const { getAccount } = useBankObserver();
const isLoading = ref(true);

// Ambil riwayat transaksi terkonfirmasi dari backend untuk akun aktif.
const loadHistory = async () => {
  // Pastikan daftar akun (dan activeAccountId) sudah dimuat dulu.
  if (!bankStore.activeAccountId && bankStore.accounts.length === 0) {
    await getAccount()
  }
  const activeId = bankStore.activeAccountId || bankStore.currentAccount?.id
  if (!activeId) return
  try {
    const res = await transactionService().getHistory(activeId)
    if (res?.success) {
      // Backend /confirmed mengembalikan { account, transactions, allCategoryOptions }
      transactionStore.setHistory(res.data.transactions ?? [])
    }
  } catch (e) {
    console.error('Gagal load history', e)
  }
};

// 3. EDIT HISTORY MODAL STATE
// (removed: modal edit localStorage sudah tidak dipakai sejak migrasi backend)

// 4. COMPUTED PROPERTIES
// Pengelompokan riwayat berdasarkan tanggal (terbaru di atas).
const groupedHistory = computed(() => {
  const groups: Record<string, IDataTransaction[]> = {}
  const raw = transactionStore.history
  const safeHistory = Array.isArray(raw) ? [...raw] : []

  safeHistory.sort((a, b) => {
    const ta = new Date(a.transactionDate ?? a.createdAt ?? 0).getTime()
    const tb = new Date(b.transactionDate ?? b.createdAt ?? 0).getTime()
    return tb - ta
  })

  safeHistory.forEach((item) => {
    const d = new Date(item.transactionDate ?? item.createdAt ?? 0)
    const dateKey = d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(item)
  })

  return groups
})

// Total pemasukan & pengeluaran dari riwayat.
const totalIncome = computed(() => {
  const raw = transactionStore.history
  const list = Array.isArray(raw) ? raw : []
  return list
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)
})

const totalExpense = computed(() => {
  const raw = transactionStore.history
  const list = Array.isArray(raw) ? raw : []
  return list
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)
})

// Persentase saldo terpakai (pengeluaran terhadap saldo aktual).
const usedPercent = computed(() => {
  const balance = transactionStore.actualBalance || 0
  if (balance <= 0) return 0
  return Math.min(100, Math.round((totalExpense.value / balance) * 100))
})

// Mapping icon berdasarkan kategori transaksi (pakai ICON_LIBRARY backend).
const categoryIcon = (category: IDataTransaction['category']): string => {
  if (!category) return 'i-heroicons-banknotes'
  const key = String(category).toLowerCase()
  return ICON_LIBRARY[key]?.icon ?? 'i-heroicons-banknotes'
}

// Icon bank untuk chip selector (cocokkan nama akun dgn keyword ICON_LIBRARY).
const bankIcon = (name: string): string => {
  const found = getSmartVisuals(name)
  return found?.icon ?? 'i-heroicons-building-library'
}

// Pilih akun dari chip -> update posisi aktif & refetch history.
const selectAccount = async (index: number) => {
  if (index === bankStore.currentIndex) return
  bankStore.currentIndex = index
  bankStore.updateActiveId()
  isLoading.value = true
  try {
    await loadHistory()
  } finally {
    isLoading.value = false
  }
}

// 5. METHODS / ACTIONS
// Native/Import Actions
const handleImportAction = async () => {
  try {
    await NotificationStorage.triggerImport();
  } catch {
    alert("Gagal buka file picker");
  }
};

const handleImportEvent = (event: Event) => {
  try {
    const customEvent = event as CustomEvent<{ data: string }>;
    console.log("Nuxt: Data diterima dari Native", customEvent.detail);
    const rawString = customEvent.detail.data;
    if (!rawString) return;

    const parsed = JSON.parse(rawString);
    if (parsed && parsed.history) {
      ui.openImportModal(parsed);
    } else {
      alert("File JSON bener, tapi kaga ada data history-nya, Cok!");
    }
  } catch (e) {
    console.error("Detail Error:", e);
    alert("Waduh! Gagal baca file. Format JSON-nya kayaknya ngaco.");
  }
};

// 6. LIFECYCLE HOOKS
// Daftarkan reloader ke socket agar history ikut refresh saat ada
// update realtime (ledger:updated) pada akun aktif.
const historyReloader = useHistoryReloader()
historyReloader.value = () => loadHistory()

onMounted(async () => {
  window.addEventListener("onImportData", handleImportEvent as EventListener);

  try {
    ui.setPageLoading(true);
    await transactionStore.rehydrate();
    await loadHistory();
  } finally {
    ui.setPageLoading(false);
    setTimeout(() => {
      isLoading.value = false;
    }, 800);
  }
});

onUnmounted(() => {
  window.removeEventListener("onImportData", handleImportEvent as EventListener);
  historyReloader.value = null;
});
</script>

<style scoped>
.fade-layout-enter-active,
.fade-layout-leave-active {
  transition: all 0.4s ease;
}

.fade-layout-enter-from,
.fade-layout-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
