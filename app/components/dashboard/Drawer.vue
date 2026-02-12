<template>
  <section
    class="fixed inset-x-0 bottom-0 rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden transition-all"
    :style="{
      top: isMounted ? `${currentTop}px` : '100vh',
      zIndex: 100,
      transform: `translateZ(0)`,
      transition: isDragging
        ? 'none'
        : 'top 0.8s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.7s ease, border-color 0.7s ease',
    }"
    :class="[
      ui.isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900',
      isMounted ? 'opacity-100' : 'opacity-0',
    ]"
  >
    <div
      id="cursor-grab"
      class="pt-6 pb-3 cursor-grab active:cursor-grabbing touch-none select-none"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div class="w-16 h-1.5 bg-gray-200 rounded-full mx-auto"></div>
      <div class="title-path px-10 pt-4 text-xl">Dashboard</div>
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
        </div> -->
        <div class="flex items-center justify-between mt-8 mb-4">
          <h2
            class="text-lg font-bold transition-colors duration-700"
            :class="ui.isDark ? 'text-white' : 'text-slate-900'"
          >
            Recent Transactions
          </h2>
          <button
            class="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors flex items-center gap-1"
            @click="uploadReceipt"
          >
            Upload Transaction
            <UIcon name="i-heroicons-document-arrow-up" class="text-sm" />
          </button>
        </div>
        <div class="space-y-4 mt-4">
          <div
            v-for="item in transactionStore.pendingTransactions"
            :key="item.id"
            class="flex flex-col p-4 rounded-2xl transition-colors gap-3 mb-4"
            :class="
              ui.isDark
                ? 'bg-slate-800/50 hover:bg-slate-800'
                : 'bg-[#fafafa] border-gray-200 border'
            "
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <div
                  class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0"
                >
                  <UIcon :name="item.icon" class="text-amber-500 text-lg" />
                </div>
                <div class="min-w-0 flex-1">
                  <p
                    class="font-bold text-sm truncate"
                    :class="ui.isDark ? 'text-white' : 'text-slate-900'"
                  >
                    {{ item.title }}
                  </p>
                  <p class="text-[10px] text-gray-500 truncate">
                    {{ item.date }} • {{ item.time }}
                  </p>
                </div>
              </div>
              <p
                class="font-bold text-sm shrink-0"
                :class="item.type === 'income' ? 'text-emerald-500' : 'text-red-500'"
              >
                {{ item.type === "income" ? "+" : "-" }}Rp
                {{ item.amount.toLocaleString("id-ID") }}
              </p>
            </div>

            <p class="text-[11px] text-gray-500 line-clamp-2 px-1">
              {{ item.text }}
            </p>

            <div
              class="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-slate-700"
            >
              <button
                v-for="opt in getOptions(
                  getSmartMetadata(item.text, item.metadata || 'DEFAULT')
                )"
                :key="opt.value"
                @click="
                  opt.value === 'Lainnya'
                    ? openEditModal(item)
                    : transactionStore.confirmTransaction(item.id, opt.value, opt.type)
                "
                :class="opt.color(ui.isDark)"
                class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-bold text-[10px] active:scale-95 transition-all shadow-sm"
              >
                <UIcon v-if="opt.icon" :name="opt.icon" class="text-xs shrink-0" />
                <span>{{ opt.label }}</span>
              </button>
              <button
                @click="transactionStore.removePending(item.id)"
                class="w-9 py-2 flex items-center justify-center rounded-lg active:scale-95"
                :class="
                  ui.isDark
                    ? 'bg-gray-300 text-slate-900'
                    : 'dark:bg-slate-700 text-gray-400'
                "
              >
                <UIcon name="i-heroicons-trash" />
              </button>
            </div>
          </div>
          <div
            v-if="transactionStore.pendingTransactions.length === 0"
            class="flex flex-col items-center justify-center py-16 px-10 text-center"
          >
            <div
              class="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors duration-700"
              :class="ui.isDark ? 'bg-slate-800' : 'bg-gray-50'"
            >
              <UIcon
                name="i-heroicons-clock"
                class="text-5xl transition-colors duration-700"
                :class="ui.isDark ? 'text-slate-600' : 'text-gray-300'"
              />
            </div>

            <h3
              class="font-bold text-sm mb-1 transition-colors duration-700"
              :class="ui.isDark ? 'text-slate-400' : 'text-gray-600'"
            >
              Belum Ada Notif Masuk
            </h3>
            <p class="text-[10px] text-gray-400 max-w-[200px] leading-relaxed">
              Transaksi dari Bank bakal otomatis muncul di sini buat lu validasi.
            </p>
          </div>
        </div>
      </slot>
    </div>
    <UModal v-model:open="isOcrModalOpen">
      <template #content>
        <UCard
          :ui="{
            root: `rounded-2xl border-none shadow-2xl ${
              ui.isDark ? 'bg-slate-900' : 'bg-white'
            }`,
            header: `border-b ${
              ui.isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'
            }`,
            body: 'p-6',
            footer: `p-4 ${ui.isDark ? 'bg-slate-800/50' : 'bg-gray-50/30'}`,
          }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-bold" :class="ui.isDark ? 'text-white' : 'text-slate-900'">
                Detail Struk Terdeteksi
              </h3>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-heroicons-x-mark"
                @click="isOcrModalOpen = false"
              />
            </div>
          </template>

          <div class="space-y-6">
            <div
              class="p-4 rounded-2xl flex flex-col items-center justify-center border border-dashed transition-colors"
              :class="
                ui.isDark
                  ? 'bg-slate-800/50 border-slate-700'
                  : 'bg-slate-50 border-slate-200'
              "
            >
              <p class="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                Total Transaksi
              </p>
              <p class="text-3xl font-black text-amber-500">
                Rp {{ ocrTempData.amount.toLocaleString("id-ID") }}
              </p>
              <div class="flex items-center gap-1 mt-2 text-gray-500 text-[10px]">
                <UIcon name="i-heroicons-calendar-days" />
                {{
                  new Date(ocrTempData.timestamp).toLocaleString("id-ID", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })
                }}
              </div>
            </div>

            <UField
              label="Masukan catatan disini"
              class="font-bold"
              :class="ui.isDark ? 'text-slate-200' : 'text-slate-700'"
            >
              <UInput
                v-model="ocrTempData.note"
                placeholder="Masukan catatan / alasan transaksi disini..."
                icon="i-heroicons-pencil-square"
                autofocus
                class="w-full"
                :ui="{
                  base: `
                h-12 rounded-xl text-md border border-gray-800 focus:border-gray-500 
                ring-0 focus:ring-0 transition-all focus-visible:ring-0
                ${ui.isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}
              `,
                }"
              />
            </UField>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <UButton
                color="neutral"
                variant="ghost"
                label="Batal"
                :class="ui.isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500'"
                @click="isOcrModalOpen = false"
              />
              <UButton
                color="warning"
                label="Konfirmasi & Simpan"
                class="px-8 shadow-lg font-bold rounded-xl"
                :loading="isSaving"
                @click="confirmAndSave"
              />
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
          }"
        >
          <template #header>
            <h3 class="font-bold">Edit & Kategori Lainnya</h3>
          </template>

          <div class="space-y-6">
            <UField label="Ubah Catatan / Alasan">
              <UInput
                v-model="manualNote"
                icon="i-heroicons-pencil-square"
                class="w-full"
                :ui="{
                  base: `
                    h-8 rounded-xl text-md border border-gray-800 focus:border-gray-500 
                    ring-0 focus:ring-0 transition-all focus-visible:ring-0
                    ${ui.isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}
                  `,
                }"
              />
            </UField>

            <div class="mt-2">
              <p
                class="text-[10px] mb-2 font-bold uppercase tracking-widest"
                :class="ui.isDark ? 'text-slate-400' : 'text-gray-500'"
              >
                Pilih Kategori Yang Sesuai
              </p>

              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="opt in [
                    ...(categoryOptions.INCOME_AUTO || []),
                    ...(categoryOptions.QRIS_AUTO || []),
                    ...(categoryOptions.TRANSFER_MANUAL || []),
                  ].filter((o) => o.value !== 'Lainnya')"
                  :key="opt.value"
                  @click="handleFinalConfirm(opt)"
                  :class="opt.color(ui.isDark)"
                  class="flex items-center gap-2 p-3 rounded-xl font-bold text-xs active:scale-95 transition-all border border-transparent hover:border-current"
                >
                  <UIcon :name="opt.icon ?? ''" />
                  {{ opt.label }}
                </button>
              </div>
            </div>
          </div>
        </UCard>
      </template>
    </UModal>
  </section>
</template>

<script setup lang="ts">
import { useUIStore } from "~/stores/ui";
import { useTransactionStore } from "~/stores/useTransactionStore";
import type { TTransactionCategory, TTransactionMetadata } from "~/types/INotification";
import { Ocr } from "@jcesarmobile/capacitor-ocr";
import { FilePicker } from "@capawesome/capacitor-file-picker";

/**
 * 1. INITIALIZATION & STORES
 */
const transactionStore = useTransactionStore();
const ui = useUIStore();

/**
 * 2. INTERFACES & CONFIGURATIONS
 */
interface ICategoryOption {
  label: string;
  icon?: string;
  value: TTransactionCategory;
  type: "income" | "expense";
  color: (isDark: boolean) => string;
}

const categoryOptions: Record<string, ICategoryOption[]> = {
  INCOME_AUTO: [
    {
      label: "Gaji",
      icon: "i-heroicons-banknotes",
      value: "Gaji/Income",
      type: "income",
      color: (isDark) =>
        isDark
          ? "bg-emerald-500/20 text-emerald-400"
          : "bg-emerald-500/10 text-emerald-600",
    },
    {
      label: "Nabung",
      icon: "i-heroicons-building-library",
      value: "Tabungan",
      type: "income",
      color: (isDark) =>
        isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Lainnya",
      icon: "i-heroicons-ellipsis-horizontal-circle",
      value: "Lainnya",
      type: "income",
      color: (isDark) =>
        isDark ? "bg-slate-500/20 text-slate-400" : "bg-slate-500/10 text-slate-600",
    },
  ],
  QRIS_AUTO: [
    {
      label: "Makan",
      icon: "i-heroicons-cake",
      value: "Makan/Minum",
      type: "expense",
      color: (isDark) =>
        isDark ? "bg-amber-200 text-black" : "bg-amber-200/40 text-amber-600",
    },
    {
      label: "Jajan",
      icon: "i-heroicons-ticket",
      value: "Jajan",
      type: "expense",
      color: (isDark) =>
        isDark ? "bg-amber-500 text-black" : "bg-amber-500/30 text-amber-600",
    },
    {
      label: "Belanja",
      icon: "i-heroicons-shopping-bag",
      value: "Belanja",
      type: "expense",
      color: (isDark) =>
        isDark ? "bg-teal-500 text-black" : "bg-teal-500/10 text-teal-600",
    },
    {
      label: "Lainnya",
      icon: "i-heroicons-ellipsis-horizontal-circle",
      value: "Lainnya",
      type: "expense",
      color: (isDark) =>
        isDark ? "bg-slate-500/20 text-slate-400" : "bg-slate-500/10 text-slate-600",
    },
  ],
  TRANSFER_MANUAL: [
    {
      label: "Transfer",
      icon: "i-heroicons-paper-airplane",
      value: "Transfer",
      type: "expense",
      color: (isDark) =>
        isDark ? "bg-emerald-500 text-black" : "bg-emerald-300/30 text-emerald-600",
    },
    {
      label: "Tagihan",
      icon: "i-heroicons-credit-card",
      value: "Cicilan/Tagihan",
      type: "expense",
      color: (isDark) =>
        isDark ? "bg-red-400 text-black" : "bg-red-400/20 text-red-600",
    },
    {
      label: "Invest",
      icon: "i-heroicons-chart-bar-square",
      value: "Investasi",
      type: "expense",
      color: (isDark) =>
        isDark ? "bg-indigo-500 text-black" : "bg-indigo-500/20 text-indigo-600",
    },
    {
      label: "Lainnya",
      icon: "i-heroicons-ellipsis-horizontal-circle",
      value: "Lainnya",
      type: "expense",
      color: (isDark) =>
        isDark ? "bg-slate-500/20 text-slate-400" : "bg-slate-500/10 text-slate-600",
    },
  ],
  DEFAULT: [
    {
      label: "Lainnya",
      icon: "i-heroicons-ellipsis-horizontal-circle",
      value: "Lainnya",
      type: "expense",
      color: (isDark) =>
        isDark ? "bg-slate-700 text-slate-300" : "bg-slate-500/10 text-slate-600",
    },
  ],
};

/**
 * 3. REACTIVE STATES
 */
// UI Drawer States
const currentTop = ref(500);
const isDragging = ref(false);
const isMounted = ref(false);
const isSpendingLocked = ref<boolean>(false);
const startY = ref(0);
const startTop = ref(0);
const limits = reactive({ min: 80, max: 500 });
const initialHeight = ref(0);
let globalObserver: ResizeObserver | null = null;

// Modal & Temp Data States
const isOcrModalOpen = ref(false);
const isSaving = ref(false);
const isEditModalOpen = ref(false);
const selectedItemForEdit = ref<any>(null);
const manualNote = ref("");

const ocrTempData = ref({
  amount: 0,
  note: "",
  timestamp: Date.now(),
  personName: "",
  metadata: "UNCLEAR" as TTransactionMetadata,
  isIncome: false,
});

/**
 * 4. HELPER FUNCTIONS
 */
const getOptions = (metadata: string) => {
  return (
    categoryOptions[metadata as keyof typeof categoryOptions] || categoryOptions.DEFAULT
  );
};

const getSmartMetadata = (text: string, currentMetadata: string): string => {
  const lowerText = text.toLowerCase();
  if (lowerText.match(/makan|warung|resto|bakso|mie|kopi|coffee|cafe|food/))
    return "QRIS_AUTO";
  if (lowerText.match(/listrik|pdam|wifi|indihome|bpjs|asuransi|cicilan|transfer/))
    return "TRANSFER_MANUAL";
  return currentMetadata;
};

/**
 * 5. CORE ACTIONS (OCR & TRANSACTION)
 */
const uploadReceipt = async () => {
  try {
    const result = await FilePicker.pickFiles({ types: ["image/png", "image/jpeg"] });
    if (!result.files.length) return;

    const { results } = await Ocr.process({ image: result.files[0]?.path! });
    const fullText = results.map((r) => r.text).join("\n");

    // Extract Amount
    const amountMatch = fullText.match(/(?:Jumlah Transfer|Rp)\s*[:.]?\s*([\d.,]+)/i);
    let cleanAmount = 0;
    if (amountMatch && amountMatch[1]) {
      const rawAmount = String(amountMatch[1]).split(",")[0];
      if (rawAmount) cleanAmount = parseInt(rawAmount.replace(/[.\s]/g, "")) || 0;
    }

    // Extract Name
    const nameMatch = fullText.match(/Tujuan\s+([A-Z\s]+?)\s+(?:Dari|Metode)/i);
    const personName = nameMatch?.[1]?.trim() ?? "Transfer Dana";

    // Extract Timestamp
    let transactionTimestamp = Date.now();
    const dateMatch = fullText.match(
      /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4}),\s+(\d{2}:\d{2})/
    );

    if (dateMatch) {
      const [_, day, monthStr, year, time] = dateMatch;
      const months: Record<string, string> = {
        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        Mei: "05",
        Jun: "06",
        Jul: "07",
        Agu: "08",
        Sep: "09",
        Okt: "10",
        Nov: "11",
        Des: "12",
      };

      if (monthStr) {
        const month = months[monthStr.substring(0, 3)] || "01";
        const isoDate = `${year}-${month}-${day?.padStart(2, "0")}T${time}:00`;
        const parsedDate = new Date(isoDate);
        if (!isNaN(parsedDate.getTime())) transactionTimestamp = parsedDate.getTime();
      }
    }

    // Determine Metadata
    const isIncome = fullText.toLowerCase().includes("masuk");
    let metadata: TTransactionMetadata = "UNCLEAR";
    if (
      fullText.toLowerCase().includes("bi fast") ||
      fullText.toLowerCase().includes("transfer")
    ) {
      metadata = "TRANSFER_MANUAL";
    } else if (isIncome) {
      metadata = "INCOME_AUTO";
    } else if (fullText.toLowerCase().includes("qris")) {
      metadata = "QRIS_AUTO";
    }

    // Prepare Temp Data & Show Modal
    ocrTempData.value = {
      amount: cleanAmount,
      note: `Transfer ke ${personName}`,
      timestamp: transactionTimestamp,
      personName,
      metadata,
      isIncome,
    };
    isOcrModalOpen.value = true;
  } catch (e) {
    console.error("Error Scan:", e);
  }
};

const confirmAndSave = async () => {
  isSaving.value = true;
  const { amount, note, timestamp, personName, metadata, isIncome } = ocrTempData.value;
  const metadataIconMap: Record<TTransactionMetadata, string> = {
    INCOME_AUTO: "i-heroicons-arrow-down-circle",
    QRIS_AUTO: "i-heroicons-qr-code",
    TRANSFER_MANUAL: "i-heroicons-paper-airplane",
    UNCLEAR: "i-heroicons-question-mark-circle",
  };

  await transactionStore.addTransaction({
    title: isIncome ? `Terima dari ${personName}` : `Transfer`,
    text: note,
    amount: Number(amount),
    metadata: metadata,
    pkg: "OCR",
    timestamp: timestamp,
    icon: metadataIconMap[metadata],
  });

  isSaving.value = false;
  isOcrModalOpen.value = false;
};

const openEditModal = (item: any) => {
  selectedItemForEdit.value = item;
  manualNote.value = item.text;
  isEditModalOpen.value = true;
};

const handleFinalConfirm = (opt: any) => {
  if (!selectedItemForEdit.value) return;
  selectedItemForEdit.value.text = manualNote.value;
  transactionStore.confirmTransaction(
    selectedItemForEdit.value.id,
    opt.value as TTransactionCategory,
    opt.type
  );
  isEditModalOpen.value = false;
};

/**
 * 6. UI & DRAWER LOGIC
 */
const updatePositions = () => {
  const h = initialHeight.value || window.innerHeight;
  const headerEl = document.getElementById("main-header");
  const mainSlot = document.getElementById("main-slot");
  const navWrapper = document.getElementById("navigation-wrapper");
  const contentContainer = document.getElementById("content-container");
  const cursorGrab = document.getElementById("cursor-grab");

  if (headerEl) limits.min = headerEl.getBoundingClientRect().bottom + 10;

  let safeZone = h - 100;
  if (navWrapper) {
    const bottomInset = 16;
    const drawerHandleHeight = cursorGrab?.getBoundingClientRect().height ?? 0;
    safeZone = window.innerHeight - drawerHandleHeight - bottomInset;
  }

  if (mainSlot) {
    const spendingBottom = Math.floor(mainSlot.getBoundingClientRect().bottom);
    limits.max = spendingBottom > safeZone ? safeZone : spendingBottom;

    if (spendingBottom && navWrapper && cursorGrab && contentContainer) {
      const navHeight = navWrapper.getBoundingClientRect().height;
      const cursorGrabH = cursorGrab.getBoundingClientRect().height;
      const stopTop = h - (navHeight + cursorGrabH);

      if (spendingBottom >= stopTop) {
        limits.max = stopTop;
        if (!isSpendingLocked.value) {
          const maxHeight = stopTop - contentContainer.getBoundingClientRect().top;
          contentContainer.style.maxHeight = `${maxHeight}px`;
          contentContainer.style.overflow = "scroll";
          isSpendingLocked.value = true;
        }
      } else {
        if (isSpendingLocked.value) {
          mainSlot.style.maxHeight = "";
          mainSlot.style.overflow = "";
          isSpendingLocked.value = false;
        }
      }
    }
  }
  currentTop.value = limits.max;
};

const onTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0];
  if (!touch) return;
  isDragging.value = true;
  startY.value = touch.clientY;
  startTop.value = currentTop.value;
};

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;
  const touch = e.touches[0];
  if (!touch) return;
  const deltaY = touch.clientY - startY.value;
  const newTop = startTop.value + deltaY;
  if (newTop >= limits.min && newTop <= limits.max) currentTop.value = newTop;
};

const onTouchEnd = () => {
  isDragging.value = false;
  const mid = (limits.min + limits.max) / 2;
  currentTop.value = currentTop.value < mid ? limits.min : limits.max;
};

const initObserver = () => {
  if (globalObserver) globalObserver.disconnect();
  const mainSlot = document.getElementById("main-slot");
  if (mainSlot) {
    globalObserver = new ResizeObserver(() => updatePositions());
    globalObserver.observe(mainSlot);
  }
};

/**
 * 7. WATCHERS & LIFECYCLE
 */
watch(
  () => ui.isPageLoading,
  async (loading) => {
    if (!loading) {
      await nextTick();
      setTimeout(() => {
        updatePositions();
        initObserver();
      }, 500);
    }
  }
);

onMounted(() => {
  initialHeight.value = window.innerHeight;
  const mainSlot = document.getElementById("main-slot");
  if (mainSlot) {
    const resizeObserver = new ResizeObserver(() => updatePositions());
    resizeObserver.observe(mainSlot);
    // Cleanup reference in closure
    onUnmounted(() => resizeObserver.disconnect());
  }

  setTimeout(() => {
    updatePositions();
    isMounted.value = true;
  }, 500);

  window.addEventListener("resize", updatePositions);
});

onUnmounted(() => {
  window.removeEventListener("resize", updatePositions);
});
</script>

<style>
section {
  will-change: transform, background-color;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
}
</style>
