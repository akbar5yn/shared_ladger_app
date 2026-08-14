<template>
  <div class="flex flex-col gap-5">
    <DashboardHeader id="history-header" />

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
              <div class="absolute -right-4 -top-4 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl"/>

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
                    <p class="text-lg font-black text-amber-400 dark:text-amber-500"/>
                  </div>
                </div>
              </div>

              <div class="mt-6 space-y-2 relative z-10">
                <div class="flex justify-between items-end text-[10px] font-bold uppercase tracking-wider">
                  <span class="opacity-60">Efisiensi Saldo</span>
                  <span :class="0 > 80 ? 'text-rose-500' : 'text-amber-400'">
                    {{ }}% Terpakai
                  </span>
                </div>

                <div
                  class="w-full h-2 bg-white/10 dark:bg-slate-900/5 rounded-full overflow-hidden border border-white/5">
                  <div
class="h-full transition-all duration-1000 ease-out rounded-full" :class="[
                    0 > 90
                      ? 'bg-rose-500'
                      : 0 > 70
                        ? 'bg-orange-400'
                        : 'bg-amber-400',
                  ]" :style="{ width: `${Math.min(0, 100)}%` }"/>
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
                      "
                    @click="handleImportAction">
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
              <!-- <div v-for="(group, date) in groupedHistory" :key="date" class="flex flex-col gap-3">
                <div class="top-2 z-10">
                  <span class="text-xs font-bold px-3 py-1 rounded-full border shadow-sm" :class="ui.isDark
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100/10 text-slate-900'
                    ">
                    {{ date }}
                  </span>
                </div>

                <div class="flex flex-col gap-2">
                  <div v-for="item in group" @click="openEditHistoryModal(item)" :key="item.id"
                    class="flex items-center gap-4 p-4 rounded-2xl shadow-sm border-slate-200 hover:scale-[1.01] transition-transform"
                    :class="ui.isDark
                      ? 'bg-slate-900 text-white border border-slate-800'
                      : 'bg-white text-slate-900'
                      ">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" :class="item.type === 'income'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-rose-100 text-rose-600'
                      ">
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
                      <p class="font-bold text-sm" :class="item.type === 'income' ? 'text-green-600' : 'text-red-500'
                        ">
                        {{ item.type === "income" ? "+" : "-" }}
                      </p>
                      <p class="text-[10px] text-gray-400">{{ item.time }}</p>
                    </div>
                  </div>
                </div>
              </div> -->
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
    <UModal
v-model:open="isEditHistoryModalOpen" :ui="{
      content: 'w-[92vw] sm:max-w-md mx-auto rounded-[28px] overflow-hidden',
    }">
      <template #content>
        <UCard
:ui="{
          root: `border-none shadow-2xl ${ui.isDark ? 'bg-slate-900' : 'bg-white'}`,
          header: `px-6 py-5 border-b ${ui.isDark
            ? 'bg-slate-800/40 border-slate-800'
            : 'bg-gray-50 border-gray-100'
            }`,
          body: 'p-5',
          footer: `px-6 py-4 border-none ${ui.isDark ? 'bg-slate-800/40' : 'bg-gray-50'
            }`,
        }">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500/10 text-amber-500">
                  <UIcon name="i-heroicons-document-magnifying-glass" class="text-xl" />
                </div>
                <div>
                  <h3 class="font-bold" :class="ui.isDark ? 'text-white' : 'text-slate-900'">
                    Detail Transaksi
                  </h3>
                  <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Update record data
                  </p>
                </div>
              </div>
              <UButton
color="neutral" variant="ghost" icon="i-heroicons-x-mark"
                class="rounded-full bg-gray-200/50 dark:bg-slate-800" @click="() => { isEditHistoryModalOpen = false }" />
            </div>
          </template>

          <div class="flex flex-col gap-4">
            <div
class="p-4 rounded-[24px] flex flex-col items-center justify-center border border-dashed" :class="ui.isDark
              ? 'bg-slate-800/50 border-slate-700'
              : 'bg-slate-50 border-slate-200'
              ">
              <p class="text-[9px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">
                Total Transaksi
              </p>

              <input
:value="formattedDisplayAmount" type="text" class="bg-transparent text-3xl font-black text-amber-500 focus:outline-none border-none p-0 w-full text-center"
                placeholder="Rp 0"
                @input="onInputAmount" >

              <div class="flex items-center justify-center gap-1.5 mt-2 text-gray-500 text-[10px] font-bold">
                <UIcon name="i-heroicons-calendar-days" class="text-xs" />
                <span>{{ editTempData.date }} • {{ editTempData.time }}</span>
              </div>
            </div>

            <div class="flex flex-col gap-3">
              <div class="flex flex-col gap-1.5">
                <label
class="text-[10px] font-black uppercase tracking-wider px-1"
                  :class="ui.isDark ? 'text-slate-400' : 'text-slate-500'">Alasan / Catatan</label>
                <UInput
v-model="editTempData.text" icon="i-heroicons-pencil-square" :ui="{
                  base: `h-10 rounded-xl text-md border border-gray-800 focus:border-gray-500 ring-0 focus:ring-0 transition-all focus-visible:ring-0 ${ui.isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
                    }`,
                }" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label
class="text-[10px] font-black uppercase tracking-wider px-1"
                  :class="ui.isDark ? 'text-slate-400' : 'text-slate-500'">Tanggal Transaksi</label>
                <UInput
v-model="editTempData.date" type="date" icon="i-heroicons-calendar" :ui="{
                  base: `h-10 rounded-xl text-md border border-gray-800 focus:border-gray-500 ring-0 focus:ring-0 transition-all focus-visible:ring-0 ${ui.isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
                    }`,
                }" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label
class="text-[10px] font-black uppercase tracking-wider px-1"
                  :class="ui.isDark ? 'text-slate-400' : 'text-slate-500'">Waktu</label>
                <UInput
v-model="editTempData.time" type="time" icon="i-heroicons-clock" :ui="{
                  base: `h-10 rounded-xl text-md border border-gray-800 focus:border-gray-500 ring-0 focus:ring-0 transition-all focus-visible:ring-0 ${ui.isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
                    }`,
                }" />
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex items-center gap-3">
              <UButton
color="error" variant="soft"
                class="h-11 w-11 rounded-xl flex items-center justify-center p-0 shadow-sm"
                @click="handleDeleteHistory">
                <UIcon name="i-heroicons-trash" class="text-xl mx-auto" />
              </UButton>
              <UButton
color="warning" block label="Simpan"
                class="flex-1 h-11 rounded-xl font-bold uppercase tracking-wider shadow-md active:scale-95 transition-all"
                @click="handleUpdateHistory" />
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { registerPlugin } from "@capacitor/core";
import DashboardHeader from "~/components/dashboard/DashboardHeader.vue";
import ToastModal from "~/components/ui/modals/ToastModal.vue";
import ModalImport from "~/components/ui/modals/ModalImport.vue";
import { useUIStore } from "~/stores/ui";
import { useTransactionStore } from "~/stores/useTransactionStore";

// 1. CONFIG & PLUGINS
definePageMeta({ middleware: ["auth"], layout: "default" });

interface NotificationStoragePlugin {
  triggerImport(): Promise<void>;
}
const NotificationStorage = registerPlugin<NotificationStoragePlugin>(
  "NotificationStorage"
);

// 2. STORES & BASE STATES
const ui = useUIStore();
const transactionStore = useTransactionStore();
const isLoading = ref(true);

// 3. EDIT HISTORY MODAL STATE
const isEditHistoryModalOpen = ref(false);
const editTempData = ref({
  id: "",
  amount: 0,
  text: "",
  date: "",
  time: "",
  type: "",
});

// 4. COMPUTED PROPERTIES
// Logic formatting rupiah buat di input modal
const formattedDisplayAmount = computed(() => {
  const val = editTempData.value.amount;
  if (!val && val !== 0) return "";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val);
});

// Pengelompokan riwayat berdasarkan tanggal
// const groupedHistory = computed(() => {
//   // const groups: Record<string, IRecentTransaction[]> = {};
//   // const safeHistory = [...(transactionStore.history || [])];

//   // safeHistory.sort((a, b) => {
//   //   const parse = (d: string = "", t: string = "") => {
//   //     if (!d) return 0;

//   //     const p = d.split("/");
//   //     if (p.length !== 3) return 0;
//   //     const day = parseInt(p[0] || "0");
//   //     const month = parseInt(p[1] || "1") - 1;
//   //     const year = parseInt(p[2] || "0");

//   //     const tm = (t || "00:00").split(":");
//   //     const hour = parseInt(tm[0] || "0");
//   //     const minute = parseInt(tm[1] || "0");

//   //     return new Date(year, month, day, hour, minute).getTime();
//   //   };

//   //   const valA = parse(a.date as string, a.time as string);
//   //   const valB = parse(b.date as string, b.time as string);

//   //   return valB - valA;
//   // });

//   // safeHistory.forEach((item) => {
//   //   if (item && item.date) {
//   //     const dateKey = item.date;

//   //     if (!groups[dateKey]) {
//   //       groups[dateKey] = [];
//   //     }

//   //     groups[dateKey].push(item);
//   //   }
//   // });

//   // return groups;
// });

// 5. METHODS / ACTIONS
// Handle input mask rupiah
const onInputAmount = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const rawValue = target.value.replace(/[^0-9]/g, "");
  const numericValue = parseInt(rawValue) || 0;
  editTempData.value.amount = numericValue;
};

// Modal Actions
const handleUpdateHistory = async () => {
  // const history = transactionStore?.history;
  // if (!history) return;

  // const index = history.findIndex((t) => t.id === editTempData.value.id);
  // if (index !== -1 && history[index]) {
  //   const oldItem = history[index];
  //   const newAmount = Number(editTempData.value.amount);

  //   if (oldItem.type === "income") {
  //     transactionStore.actualBalance =
  //       transactionStore.actualBalance - oldItem.amount + newAmount;
  //   } else {
  //     transactionStore.actualBalance =
  //       transactionStore.actualBalance + oldItem.amount - newAmount;
  //   }

  //   history[index].amount = newAmount;
  //   history[index].text = editTempData.value.text;

  //   const rawDate = editTempData.value.date;
  //   if (rawDate && rawDate.includes("-")) {
  //     const [y, m, d] = rawDate.split("-");
  //     history[index].date = `${d}/${m}/${y}`;
  //   } else {
  //     history[index].date = rawDate;
  //   }
  //   history[index].time = editTempData.value.time;

  //   await transactionStore.saveToDisk();
  //   isEditHistoryModalOpen.value = false;
  // }
};

const handleDeleteHistory = async () => {
  // if (confirm("Yakin mau hapus riwayat ini, Cok?")) {
  //   if (!transactionStore) return;

  //   const itemToDelete = transactionStore.history.find(
  //     (t) => t.id === editTempData.value.id
  //   );

  //   if (itemToDelete) {
  //     if (itemToDelete.type === "income") {
  //       transactionStore.actualBalance -= Number(itemToDelete.amount);
  //     } else {
  //       transactionStore.actualBalance += Number(itemToDelete.amount);
  //     }

  //     transactionStore.history = transactionStore.history.filter(
  //       (t) => t.id !== editTempData.value.id
  //     );

  //     await transactionStore.saveToDisk();
  //     isEditHistoryModalOpen.value = false;
  //   }
  // }
};

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
onMounted(async () => {
  window.addEventListener("onImportData", handleImportEvent as EventListener);

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
  window.removeEventListener("onImportData", handleImportEvent as EventListener);
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
