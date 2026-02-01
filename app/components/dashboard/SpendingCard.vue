<template>
  <div class="card-wrapper">
    <div
      id="spending-container"
      class="card-container relative w-full rounded-3xl px-6 py-5 border transition-all duration-700"
      :class="
        ui.isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'
      "
    >
      <span
        :class="ui.isDark ? 'text-slate-400' : 'text-gray-500'"
        class="text-xs font-medium"
      >
        Spending Overview
      </span>

      <div class="mt-1 flex flex-col gap-4">
        <div class="flex items-baseline gap-2">
          <h1
            class="text-2xl font-bold tracking-tight"
            :class="ui.isDark ? 'text-white' : 'text-slate-900'"
          >
            Rp 12.521.100
          </h1>
          <span :class="ui.isDark ? 'text-slate-500' : 'text-gray-400'" class="text-xs">
            From Rp 20.000.000
          </span>
        </div>

        <div class="flex h-3 w-full gap-1.5 overflow-hidden rounded-full">
          <div
            class="h-full rounded-full transition-all duration-1000"
            style="width: 60%"
            :class="ui.isDark ? 'bg-amber-500' : 'bg-slate-900'"
          ></div>
          <div class="h-full w-[25%] rounded-full bg-teal-500"></div>
          <div
            class="h-full flex-1 rounded-full"
            :class="ui.isDark ? 'bg-slate-800' : 'bg-blue-100'"
          ></div>
        </div>

        <div class="flex flex-col gap-3 mt-2">
          <div class="flex justify-between items-center text-sm">
            <div class="flex items-center gap-3">
              <div
                class="w-2 h-2 rounded-full"
                :class="ui.isDark ? 'bg-amber-500' : 'bg-slate-900'"
              ></div>
              <span :class="ui.isDark ? 'text-slate-300' : 'text-gray-600'"
                >Subscription</span
              >
            </div>
            <span class="font-bold" :class="ui.isDark ? 'text-white' : 'text-slate-900'"
              >Rp 8.221.000</span
            >
          </div>
          <div class="flex justify-between items-center text-sm">
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-teal-500"></div>
              <span :class="ui.isDark ? 'text-slate-300' : 'text-gray-600'"
                >Friend & Family</span
              >
            </div>
            <span class="font-bold" :class="ui.isDark ? 'text-white' : 'text-slate-900'"
              >Rp 4.300.100</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from "~/stores/ui";
const ui = useUIStore();
</script>

<style scoped lang="scss">
.card-wrapper {
  /* Hilangkan padding default agar ukuran dikontrol parent */
  padding: 0 15px;
  width: 100%;
}

/* Animasi sederhana biar pas muncul bar-nya gerak */
@keyframes grow {
  from {
    width: 0;
  }
}
.rounded-full {
  animation: grow 1s ease-out;
}
</style>
