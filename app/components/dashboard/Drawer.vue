<template>
  <section
    class="fixed inset-x-0 bottom-0 rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden"
    :style="{
      top: `${currentTop}px`,
      zIndex: 100,
      transform: `translateZ(0)`,
      transition: isDragging
        ? 'none'
        : 'top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1), background-color 0.7s ease, border-color 0.7s ease, color 0.7s ease',
    }"
    :class="[ui.isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900']"
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
        <div class="top-24 right-4 flex flex-col gap-2 opacity-50 hover:opacity-100">
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
        </div>
        <div class="flex items-center justify-between mt-8 mb-4">
          <h2
            class="text-lg font-bold transition-colors duration-700"
            :class="ui.isDark ? 'text-white' : 'text-slate-900'"
          >
            Recent Transactions
          </h2>
          <button
            class="text-xs font-semibold text-amber-500 hover:text-amber-600 transition-colors"
          >
            See All
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

            <p class="text-[11px] text-gray-500 line-clamp-2 px-1">{{ item.text }}</p>

            <div
              class="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-slate-700"
            >
              <template v-if="item.metadata === 'INCOME_AUTO'">
                <button
                  @click="
                    transactionStore.confirmTransaction(
                      item.id,
                      'Gaji / Income',
                      'income'
                    )
                  "
                  class="flex-1 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px] font-bold active:scale-95"
                >
                  💰 Gaji
                </button>
                <button
                  @click="
                    transactionStore.confirmTransaction(item.id, 'Tabungan', 'income')
                  "
                  class="flex-1 py-2 rounded-lg bg-blue-500/10 text-blue-600 text-[10px] font-bold active:scale-95"
                >
                  🏦 Nabung
                </button>
              </template>

              <template v-else-if="item.metadata === 'QRIS_AUTO'">
                <button
                  @click="
                    transactionStore.confirmTransaction(item.id, 'Makan/Minum', 'expense')
                  "
                  class="flex-1 py-2 rounded-lg bg-orange-500/10 text-orange-600 text-[10px] font-bold active:scale-95"
                >
                  🍔 Makan
                </button>
                <button
                  @click="
                    transactionStore.confirmTransaction(item.id, 'Belanja', 'expense')
                  "
                  class="flex-1 py-2 rounded-lg bg-amber-500/10 text-amber-600 text-[10px] font-bold active:scale-95"
                >
                  🛒 Belanja
                </button>
              </template>

              <template v-else-if="item.metadata === 'TRANSFER_MANUAL'">
                <button
                  @click="
                    transactionStore.confirmTransaction(
                      item.id,
                      'Kirim Orang Tua',
                      'expense'
                    )
                  "
                  class="flex-1 py-2 rounded-lg bg-purple-500/10 text-purple-600 text-[10px] font-bold active:scale-95"
                >
                  👨‍👩‍👧 Ortu
                </button>
                <button
                  @click="
                    transactionStore.confirmTransaction(
                      item.id,
                      'Cicilan/Tagihan',
                      'expense'
                    )
                  "
                  class="flex-1 py-2 rounded-lg bg-red-500/10 text-red-600 text-[10px] font-bold active:scale-95"
                >
                  🧾 Tagihan
                </button>
              </template>

              <template v-else>
                <button
                  @click="
                    transactionStore.confirmTransaction(item.id, 'Nabung', 'income')
                  "
                  class="flex-1 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 text-[10px] font-bold active:scale-95"
                >
                  Nabung
                </button>
                <button
                  @click="
                    transactionStore.confirmTransaction(item.id, 'Jajan', 'expense')
                  "
                  class="flex-1 py-2 rounded-lg bg-amber-500/10 text-amber-600 text-[10px] font-bold active:scale-95"
                >
                  Jajan
                </button>
              </template>

              <button
                @click="transactionStore.removePending(item.id)"
                class="w-9 py-2 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-400 active:scale-95"
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
              Transaksi dari Bank atau Instagram bakal otomatis muncul di sini buat lu
              validasi.
            </p>
          </div>
        </div>
      </slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUIStore } from "~/stores/ui";
import { useTransactionStore } from "~/stores/useTransactionStore";
const transactionStore = useTransactionStore();
const ui = useUIStore();
const currentTop = ref(500);
const isDragging = ref(false);
let isSpendingLocked = false;
const startY = ref(0);
const startTop = ref(0);
const limits = reactive({ min: 80, max: 500 });

onMounted(() => {
  const updatePositions = () => {
    const h = window.innerHeight;
    const headerEl = document.getElementById("main-header");
    const spendingEl = document.getElementById("spending-card");
    const navWrapper = document.getElementById("navigation-wrapper");
    const spendingContainer = document.getElementById("spending-container");
    const cursorGrab = document.getElementById("cursor-grab");

    if (headerEl) {
      limits.min = headerEl.getBoundingClientRect().bottom + 10;
    }

    let safeZone = h - 100;

    if (navWrapper) {
      safeZone = Math.floor(navWrapper.getBoundingClientRect().top);
    }

    if (spendingEl) {
      const spendingBottom = Math.floor(spendingEl.getBoundingClientRect().bottom + 20);
      let spendingHeight = spendingBottom;

      limits.max = spendingBottom > safeZone ? safeZone : spendingBottom;

      if (spendingBottom && navWrapper && cursorGrab && spendingContainer) {
        const navHeight = navWrapper.getBoundingClientRect().height;
        const cursorGrabH = cursorGrab.getBoundingClientRect().height;
        const stopTop = h - (navHeight + cursorGrabH);

        if (spendingBottom >= stopTop) {
          limits.max = stopTop;

          if (!isSpendingLocked) {
            const maxHeight =
              stopTop - spendingContainer.getBoundingClientRect().top - 20;

            spendingContainer.style.maxHeight = `${maxHeight}px`;
            spendingContainer.style.overflow = "scroll";

            isSpendingLocked = true;
          }
        } else {
          if (isSpendingLocked) {
            spendingEl.style.maxHeight = "";
            spendingEl.style.overflow = "";
            isSpendingLocked = false;
          }
        }
      }
    }

    currentTop.value = limits.max;
  };

  const resizeObserver = new ResizeObserver(() => {
    updatePositions();
  });

  const spendingEl = document.getElementById("spending-card");
  if (spendingEl) {
    resizeObserver.observe(spendingEl);
  }

  setTimeout(() => {
    updatePositions();
  }, 100);

  onUnmounted(() => {
    resizeObserver.disconnect();
    window.removeEventListener("resize", updatePositions);
  });
});

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
  if (newTop >= limits.min && newTop <= limits.max) {
    currentTop.value = newTop;
  }
};

const onTouchEnd = () => {
  isDragging.value = false;
  const mid = (limits.min + limits.max) / 2;
  currentTop.value = currentTop.value < mid ? limits.min : limits.max;
};
</script>

<style>
section {
  will-change: transform, background-color;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
}
</style>
