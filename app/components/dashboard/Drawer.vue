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
        <div class="h-[1000px] from-gray-50 to-white p-4">
          <h1 class="text-black font-bold">Konten Drawer</h1>
          <p class="text-gray-500">Coba tarik handle di atas ke atas/bawah</p>
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
  const h = window.innerHeight;
  const headerEl = document.getElementById("main-header");

  if (headerEl) {
    const rect = headerEl.getBoundingClientRect();
    limits.min = rect.bottom + 10;
  } else {
    limits.min = 90;
  }

  limits.max = h * 0.55;
  currentTop.value = limits.max;
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
