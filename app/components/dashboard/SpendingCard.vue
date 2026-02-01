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
            {{ transactionStore.formatIDR(transactionStore.totalExpenses) }}
          </h1>
          <span :class="ui.isDark ? 'text-slate-500' : 'text-gray-400'" class="text-xs">
            From {{ transactionStore.formatIDR(transactionStore.monthlyBudget) }}
          </span>
        </div>

        <div
          v-if="transactionStore.totalExpenses > 0"
          class="flex h-3 w-full gap-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
        >
          <div
            v-for="(cat, index) in transactionStore.activeCategories"
            :key="index"
            class="h-full transition-all duration-1000"
            :style="{ width: `${transactionStore.getCategoryPercentage(cat)}%` }"
            :class="getCategoryColor(cat)"
          ></div>
        </div>

        <div
          v-if="transactionStore.activeCategories.length > 0"
          class="flex flex-col gap-3 mt-2"
        >
          <div
            v-for="cat in transactionStore.activeCategories"
            :key="cat"
            class="flex justify-between items-center text-sm animate-fade-in"
          >
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full" :class="getCategoryColor(cat)"></div>
              <span :class="ui.isDark ? 'text-slate-300' : 'text-gray-600'">{{
                cat
              }}</span>
            </div>
            <span class="font-bold" :class="ui.isDark ? 'text-white' : 'text-slate-900'">
              {{ transactionStore.formatIDR(transactionStore.getCategoryTotal(cat)) }}
            </span>
          </div>
        </div>
        <div v-else class="py-4 text-center text-xs italic text-slate-500">
          Belum ada transaksi terkonfirmasi bulan ini.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from "~/stores/ui";
import { useTransactionStore } from "~/stores/useTransactionStore";
const transactionStore = useTransactionStore();
const ui = useUIStore();

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    "Makan/Minum": "bg-amber-500",
    Belanja: "bg-teal-500",
    Jajan: "bg-rose-500",
    "Cicilan/Tagihan": "bg-blue-500",
    Tabungan: "bg-indigo-500",
    "Kirim Orang Tua": "bg-emerald-500",
    "Gaji/Income": "bg-green-500",
  };

  // Fallback kalau kategori nggak ketemu
  return colors[category] || "bg-slate-400";
};
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
