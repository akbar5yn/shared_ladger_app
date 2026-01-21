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
            v-for="i in 5"
            :key="i"
            class="flex items-center justify-between p-4 rounded-2xl transition-colors"
            :class="
              ui.isDark
                ? 'bg-slate-800/50 hover:bg-slate-800'
                : 'bg-[#fafafa] hover:bg-gray-100 border-gray-200 border'
            "
          >
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center"
              >
                <UIcon name="i-heroicons-shopping-bag" class="text-amber-500 text-xl" />
              </div>
              <div>
                <p
                  class="font-bold text-sm"
                  :class="ui.isDark ? 'text-white' : 'text-slate-900'"
                >
                  Indomaret Point
                </p>
                <p class="text-xs text-gray-500">20 Jan 2026 • 18:30</p>
              </div>
            </div>
            <p class="font-bold text-red-500">-Rp 45.000</p>
          </div>
        </div>
      </slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUIStore } from "~/stores/ui";

const ui = useUIStore();
const currentTop = ref(500);
const isDragging = ref(false);
const startY = ref(0);
const startTop = ref(0);
const limits = { min: 80, max: 500 };

onMounted(() => {
  const updatePositions = () => {
    const h = window.innerHeight;
    const headerEl = document.getElementById("main-header");
    const balanceEl = document.getElementById(".balance-card");
    const spendingEl = document.getElementById("spending-card");

    if (headerEl) {
      limits.min = headerEl.getBoundingClientRect().bottom + 10;
    }

    if (balanceEl && spendingEl) {
      const balanceRect = balanceEl.getBoundingClientRect();
      const spendingRect = spendingEl.getBoundingClientRect();

      const gap = spendingRect.top - balanceRect.bottom;

      limits.max = spendingRect.bottom + gap;
    } else if (spendingEl) {
      limits.max = spendingEl.getBoundingClientRect().bottom + 20;
    }

    currentTop.value = limits.max;
  };

  setTimeout(updatePositions, 100);
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
