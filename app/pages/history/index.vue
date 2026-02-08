<template>
  <div class="flex flex-col gap-5">
    <DashboardHeader id="history-header" />

    <main id="main-slot" class="main-history flex flex-col gap-4">
      <ClientOnly>
        <Transition name="fade-layout" mode="out-in">
          <DashboardSkeleton v-if="isLoading" key="loading" />

          <div v-else key="content" class="flex flex-col px-6">
            <section
              class="relative overflow-hidden p-6 rounded-2xl shadow"
              :class="
                ui.isDark
                  ? 'bg-slate-900/50 border border-slate-800 text-white'
                  : 'bg-slate-100/10 text-slate-900'
              "
            >
              <div
                class="absolute -right-4 -top-4 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl"
              ></div>

              <div class="flex justify-between relative z-10">
                <div class="space-y-1">
                  <p
                    class="text-[10px] font-medium opacity-60 uppercase tracking-[0.2em]"
                  >
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
                      {{ transactionStore.formatIDR(transactionStore.totalExpenses) }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="mt-6 space-y-2 relative z-10">
                <div
                  class="flex justify-between items-end text-[10px] font-bold uppercase tracking-wider"
                >
                  <span class="opacity-60">Efisiensi Saldo</span>
                  <span :class="expenseRatio > 80 ? 'text-rose-500' : 'text-amber-400'">
                    {{ expenseRatio.toFixed(1) }}% Terpakai
                  </span>
                </div>

                <div
                  class="w-full h-2 bg-white/10 dark:bg-slate-900/5 rounded-full overflow-hidden border border-white/5"
                >
                  <div
                    class="h-full transition-all duration-1000 ease-out rounded-full"
                    :class="[
                      expenseRatio > 90
                        ? 'bg-rose-500'
                        : expenseRatio > 70
                        ? 'bg-orange-400'
                        : 'bg-amber-400',
                    ]"
                    :style="{ width: `${Math.min(expenseRatio, 100)}%` }"
                  ></div>
                </div>

                <div class="flex items-center justify-between">
                  <p class="text-[9px] opacity-40 italic leading-none max-w-[60%]">
                    *Perbandingan total pengeluaran terhadap actual current balance.
                  </p>
                  <button
                    @click="handleImportAction"
                    class="flex items-center justify-center gap-2 px-3 py-1 rounded-md transition-colors active:scale-95 border border-black"
                    :class="
                      ui.isDark
                        ? ' border border-white'
                        : 'bg-slate-100/10 text-slate-900'
                    "
                  >
                    <UIcon
                      name="i-heroicons-arrow-up-tray"
                      class="text-[10px]"
                      :class="ui.isDark ? ' text-white' : ' text-slate-900'"
                    />
                    <span
                      class="text-[8px] font-bold text-black uppercase tracking-tight"
                      :class="ui.isDark ? ' text-white' : ' text-slate-900'"
                    >
                      Import History
                    </span>
                  </button>
                </div>
              </div>
            </section>

            <div
              id="content-container"
              v-if="transactionStore.history.length > 0"
              class="flex flex-col gap-8 no-scrollbar pt-6 pb-5"
            >
              <div
                v-for="(group, date) in groupedHistory"
                :key="date"
                class="flex flex-col gap-3"
              >
                <div class="top-2 z-10">
                  <span
                    class="text-xs font-bold px-3 py-1 rounded-full border shadow-sm"
                    :class="
                      ui.isDark
                        ? 'bg-slate-700 text-white'
                        : 'bg-slate-100/10 text-slate-900'
                    "
                  >
                    {{ date }}
                  </span>
                </div>

                <div class="flex flex-col gap-2">
                  <div
                    v-for="item in group"
                    :key="item.id"
                    class="flex items-center gap-4 p-4 rounded-2xl shadow-sm border-slate-200 hover:scale-[1.01] transition-transform"
                    :class="
                      ui.isDark
                        ? 'bg-slate-900 text-white border border-slate-800'
                        : 'bg-white text-slate-900'
                    "
                  >
                    <div
                      class="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                      :class="
                        item.type === 'income'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-rose-100 text-rose-600'
                      "
                    >
                      <UIcon :name="item.icon" />
                    </div>

                    <div class="flex-1 min-w-0">
                      <h4 class="font-bold text-sm truncate">
                        {{ item.title }}
                      </h4>
                      <p class="text-xs text-gray-500 truncate">
                        {{ item.text }}
                      </p>
                    </div>

                    <div class="text-right">
                      <p
                        class="font-bold text-sm"
                        :class="
                          item.type === 'income' ? 'text-green-600' : 'text-red-500'
                        "
                      >
                        {{ item.type === "income" ? "+" : "-" }}
                        {{ transactionStore.formatIDR(item.amount) }}
                      </p>
                      <p class="text-[10px] text-gray-400">{{ item.time }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else
              class="flex flex-col items-center justify-center py-20 opacity-50"
            >
              <UIcon name="i-heroicons-clock" class="text-6xl mb-2" />
              <p>Belum ada riwayat transaksi, Cok!</p>
            </div>
          </div>
        </Transition>
      </ClientOnly>
    </main>

    <ClientOnly>
      <ModalImport />
      <ModalLogout />
      <ToastModal />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from "~/components/dashboard/DashboardHeader.vue";
import ModalLogout from "~/components/ui/modals/ModalLogout.vue";
import ToastModal from "~/components/ui/modals/ToastModal.vue";
import { useUIStore } from "~/stores/ui";
import { useTransactionStore } from "~/stores/useTransactionStore";
import type { IRecentTransaction } from "~/types/INotification";
import { registerPlugin } from "@capacitor/core";
import ModalImport from "~/components/ui/modals/ModalImport.vue";

definePageMeta({ middleware: ["auth"], layout: "default" });

interface NotificationStoragePlugin {
  triggerImport(): Promise<void>;
}
const NotificationStorage = registerPlugin<NotificationStoragePlugin>(
  "NotificationStorage"
);

const ui = useUIStore();
const transactionStore = useTransactionStore();
const isLoading = ref(true);

const handleImportAction = async () => {
  try {
    await NotificationStorage.triggerImport();
  } catch (e) {
    alert("Gagal buka file picker");
  }
};

const groupedHistory = computed(() => {
  const groups: Record<string, IRecentTransaction[]> = {};

  const safeHistory = transactionStore.history || [];

  safeHistory.forEach((item) => {
    if (item && item.date) {
      const dateKey = item.date;

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(item);
    }
  });

  return groups;
});

const expenseRatio = computed(() => {
  const balance = transactionStore.actualBalance || 0;
  const expense = transactionStore.totalExpenses || 0;

  if (balance === 0) return expense > 0 ? 100 : 0;

  return (expense / balance) * 100;
});

const handleImportEvent = (event: any) => {
  try {
    console.log("Nuxt: Data diterima dari Native", event.detail);

    const rawString = event.detail.data;
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

onMounted(async () => {
  window.addEventListener("onImportData", handleImportEvent);

  try {
    ui.setPageLoading(true);
    await transactionStore.rehydrate();
  } finally {
    ui.setPageLoading(false);
    setTimeout(() => {
      isLoading.value = false;
    }, 800);
  }
});

onUnmounted(() => {
  window.removeEventListener("onImportData", handleImportEvent);
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
