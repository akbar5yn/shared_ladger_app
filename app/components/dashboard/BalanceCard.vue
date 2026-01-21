<template>
  <div class="card-wrapper">
    <div
      class="card-container relative w-full rounded-3xl p-6 pt-10 border transition-colors duration-700 ease-in-out"
      :class="[
        ui.isDark
          ? 'bg-slate-900 border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
          : 'bg-white border-gray-100 shadow-sm',
      ]"
    >
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-700"
        :class="[
          ui.isDark
            ? 'bg-amber-500 border-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
            : 'bg-black border-[#fafafa]',
        ]"
      >
        <UIcon
          name="i-heroicons-banknotes"
          class="text-xl transition-colors duration-700"
          :class="ui.isDark ? 'text-slate-950' : 'text-white'"
        />
      </div>

      <div
        class="flex justify-between items-center divide-x divide-gray-300 transition-colors duration-700"
        :class="ui.isDark ? 'divide-slate-600' : 'divide-gray-200'"
      >
        <div class="flex-1 text-center">
          <p
            class="text-xs mb-1 transition-colors duration-700"
            :class="ui.isDark ? 'text-slate-400' : 'text-gray-500'"
          >
            Current Balance
          </p>
          <p
            class="text-xl font-bold transition-colors duration-700"
            :class="ui.isDark ? 'text-white' : 'text-slate-900'"
          >
            Rp 500.000
          </p>
        </div>

        <div class="flex-1 text-center">
          <p
            class="text-xs mb-1 transition-colors duration-700"
            :class="ui.isDark ? 'text-slate-400' : 'text-gray-500'"
          >
            Total Expenses
          </p>
          <p
            class="text-xl font-bold transition-colors duration-700"
            :class="ui.isDark ? 'text-amber-500' : 'text-slate-900'"
          >
            Rp 50.000
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from "~/stores/ui";
const ui = useUIStore();
</script>

<style lang="scss" scoped>
.card-wrapper {
  padding: 15px;
}

.card-container {
  isolation: isolate;
  backface-visibility: hidden;
}
</style>
