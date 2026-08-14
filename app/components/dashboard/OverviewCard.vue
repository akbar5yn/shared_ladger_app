<template>
  <div class="card-wrapper">
    <div
id="content-container"
      class="card-container relative w-full rounded-3xl px-6 py-5 mb-6 border transition-all duration-700 no-scrollbar"
      :class="ui.isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'
        ">
      <div class="flex justify-between items-center mb-1">
        <span :class="ui.isDark ? 'text-slate-400' : 'text-gray-500'" class="text-xs font-medium tracking-wider">
          {{ isIncomeMode ? "Summary Income" : "Summary of Monthly " }}
        </span>

        <button
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all active:scale-95 justify-center"
          style="min-width: 115px" :class="isIncomeMode
            ? 'bg-emerald-500/10 text-emerald-500'
            : 'bg-amber-500/10 text-amber-500'
            " @click="isIncomeMode = !isIncomeMode">
          <UIcon
:name="isIncomeMode
            ? 'i-heroicons-arrow-trending-up'
            : 'i-heroicons-arrow-trending-down'
            " />
          <span>Switch to {{ isIncomeMode ? "Spending" : "Income" }}</span>
        </button>
      </div>

      <!-- PLACEHOLDER: sedang di slide "Tambah Akun", tiadakan summary -->
      <div v-if="bankStore.atAddCard" class="mt-4 py-10 flex flex-col items-center gap-2 text-center">
        <UIcon name="i-heroicons-plus-circle" class="text-3xl text-amber-500" />
        <p class="text-xs italic text-slate-400">
          Buat akun dompet dulu untuk melihat ringkasan bulanannya.
        </p>
      </div>

      <!-- SKELETON: loading fetch summary/advisor saat ganti akun -->
      <div v-else-if="transactionStore.isSummaryLoading" class="mt-4 flex flex-col gap-4">
        <div class="h-8 w-48 animate-pulse rounded-lg" :class="ui.isDark ? 'bg-slate-700' : 'bg-slate-200'" />
        <div class="flex flex-col gap-3">
          <div v-for="i in 3" :key="i" class="flex flex-col gap-1.5">
            <div class="flex justify-between">
              <div class="h-3 w-16 animate-pulse rounded" :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-100'" />
              <div class="h-3 w-24 animate-pulse rounded" :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-100'" />
            </div>
            <div class="h-2 rounded-full overflow-hidden" :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-100'">
              <div
class="h-full w-1/3 animate-pulse rounded-full"
                :class="ui.isDark ? 'bg-slate-700' : 'bg-slate-200'" />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="mt-1 flex flex-col gap-4">
        <div class="flex items-baseline gap-2">
          <h1
class="text-2xl font-bold tracking-tight transition-colors duration-500" :class="[
            isIncomeMode
              ? 'text-emerald-500'
              : ui.isDark
                ? 'text-red-400'
                : 'text-red-500',
          ]">
            {{ transactionStore.formatIDR(currentTotal) }}
          </h1>
          <span
v-if="!isIncomeMode" :class="ui.isDark ? 'text-slate-400' : 'text-gray-400'"
            class="text-xs flex items-center gap-1">
            From your income
            <div class="relative flex items-center h-6">
              <Transition name="fade-fast" mode="out-in">
                <div v-if="true" class=" flex items-center gap-1">
                  <span class="text-amber-500 font-bold text-[10px]">{{
                    transactionStore.formatIDR(transactionStore.income) }}</span>
                </div>
              </Transition>
            </div>
          </span>
          <span v-else class="text-emerald-500/50 text-[10px] font-medium italic">Monthly Profit</span>
        </div>

        <!-- SECTION Financial Advisor -->

        <div v-if="transactionStore.advisorData && !isIncomeMode" class="transition-all duration-500">

          <!-- ANCHOR FINANCIAL BREAKDOWN -->
          <div class="space-y-4">

            <!-- ANCHOR NEEDS -->
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <div class="flex items-center gap-2">
                  <div class="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span class="text-xs font-semibold" :class="ui.isDark ? 'text-slate-200' : 'text-slate-700'">
                    Needs
                  </span>
                </div>
                <span class="text-[11px] text-red-400 font-bold">
                  {{
                    transactionStore.formatIDR(
                      transactionStore.advisorData?.breakdown?.needs
                    )
                  }}
                  /
                  {{
                    transactionStore.formatIDR(
                      transactionStore.advisorData?.limit?.needs
                    )
                  }}
                </span>
              </div>

              <div class="h-2 rounded-full overflow-hidden bg-slate-200/50 dark:bg-slate-800">
                <div
class="h-full rounded-full bg-red-400 transition-all duration-700" :style="{
                  width: `${Math.min(
                    ((transactionStore.advisorData?.breakdown.needs || 0) /
                      transactionStore.income) * 100,
                    100
                  )}%`
                }" />
              </div>
            </div>

            <!-- ANCHOR WANTS -->
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <div class="flex items-center gap-2">
                  <div class="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span class="text-xs font-semibold" :class="ui.isDark ? 'text-slate-100' : 'text-slate-700'">
                    Wants
                  </span>
                </div>

                <span class="text-[11px] text-red-400 font-bold">
                  {{
                    transactionStore.formatIDR(
                      transactionStore.advisorData?.breakdown?.wants
                    )
                  }}
                  /
                  {{
                    transactionStore.formatIDR(
                      transactionStore.advisorData?.limit?.wants
                    )
                  }}
                </span>
              </div>

              <div class="h-2 rounded-full overflow-hidden bg-slate-200/50 dark:bg-slate-800">
                <div
class="h-full rounded-full bg-amber-400 transition-all duration-700" :style="{
                  width: `${Math.min(
                    ((transactionStore.advisorData?.breakdown?.wants || 0) /
                      transactionStore.income) * 100,
                    100
                  )}%`
                }" />
              </div>
            </div>

            <!-- ANCHOR SAVINGS -->
            <div>
              <div class="flex justify-between items-center mb-1.5">
                <div class="flex items-center gap-2">
                  <div class="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span class="text-xs font-semibold" :class="ui.isDark ? 'text-white' : 'text-slate-700'">
                    Savings
                  </span>
                </div>

                <span class="text-[11px] text-red-400 font-bold">
                  {{
                    transactionStore.formatIDR(
                      transactionStore.advisorData?.breakdown?.savings
                    )
                  }}
                  /
                  {{
                    transactionStore.formatIDR(
                      transactionStore.advisorData?.limit?.savings
                    )
                  }}
                </span>
              </div>

              <div class="h-2 rounded-full overflow-hidden bg-slate-200/50 dark:bg-slate-800">
                <div
class="h-full rounded-full bg-emerald-400 transition-all duration-700" :style="{
                  width: `${Math.min(
                    ((transactionStore.advisorData?.breakdown.savings || 0) /
                      transactionStore.income) * 100,
                    100
                  )}%`
                }" />
              </div>
            </div>
          </div>

          <!-- ANCHOR FORECAST -->
          <div
v-if="transactionStore.advisorData?.forecast" class="mt-5 rounded-2xl p-4" :class="ui.isDark
            ? 'bg-slate-800/70'
            : 'bg-slate-50'">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-[10px] uppercase tracking-wider text-slate-400">
                  AI Forecast
                </p>

                <h3 class="text-sm font-bold" :class="ui.isDark ? 'text-white' : 'text-slate-800'">
                  Prediksi akhir bulan
                </h3>
              </div>

              <UIcon name="i-heroicons-chart-bar-square" class="text-xl text-indigo-400" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <!-- ANCHOR Daily Burn -->
              <div>
                <p class="text-[10px] text-slate-400 mb-1">
                  Daily Burn
                </p>

                <h4 class="font-bold text-sm" :class="ui.isDark ? 'text-white' : 'text-slate-800'">
                  {{
                    transactionStore.formatIDR(
                      transactionStore.advisorData.forecast.dailyBurnRate
                    )
                  }} / hari
                </h4>
              </div>

              <!-- ANCHOR Projected Expense -->
              <div>
                <p class="text-[10px] text-slate-400 mb-1">
                  Monthly Projection
                </p>

                <h4 class="font-bold text-sm" :class="ui.isDark ? 'text-white' : 'text-slate-800'">
                  {{
                    transactionStore.formatIDR(
                      transactionStore.advisorData.forecast.projectedMonthlyExpense
                    )
                  }} / bulan
                </h4>
              </div>

              <!-- ANCHOR Balance -->
              <div class="col-span-2">
                <p class="text-[10px] text-slate-400 mb-1">
                  Estimated Remaining Balance
                </p>

                <h4 class="font-bold text-sm" :class="ui.isDark ? 'text-white' : 'text-slate-800'">
                  {{
                    transactionStore.formatIDR(
                      transactionStore.advisorData.forecast.projectedBalance
                    )
                  }}
                </h4>
              </div>

              <!-- ANCHOR Burn Ratio -->
              <div class="col-span-2">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-[10px] text-slate-400">
                    Burn Ratio
                  </p>

                  <span
class="text-[10px] font-bold" :class="transactionStore.advisorData.forecast.burnRatio >= 80
                    ? 'text-red-400'
                    : transactionStore.advisorData.forecast.burnRatio >= 50
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                    ">
                    {{
                      transactionStore.advisorData.forecast.burnRatio.toFixed(1)
                    }}%
                  </span>
                </div>

                <div class="h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <div
class="h-full transition-all duration-700" :class="transactionStore.advisorData.forecast.burnRatio >= 80
                    ? 'bg-red-400'
                    : transactionStore.advisorData.forecast.burnRatio >= 50
                      ? 'bg-amber-400'
                      : 'bg-emerald-400'
                    " :style="{
                      width: `${Math.min(
                        transactionStore.advisorData.forecast.burnRatio,
                        100
                      )}%`
                    }" />
                </div>
              </div>
            </div>
          </div>

          <!-- ANCHOR FLAGS -->
          <div v-if="transactionStore.advisorData?.flags.length" class="flex flex-wrap gap-2 mt-4">
            <div
v-for="flag in transactionStore.advisorData?.flags" :key="flag"
              class="px-2.5 py-1 rounded-full text-[10px] font-bold" :class="[
                flag.includes('DANGER')
                  ? 'bg-red-500/10 text-red-400'
                  : flag.includes('WARNING')
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-emerald-500/10 text-emerald-400'
              ]">
              {{ flag.replaceAll('_', ' ') }}
            </div>
          </div>
        </div>



        <div v-else class="py-4 text-center text-xs italic text-slate-500 flex flex-col items-center gap-2">
          <UIcon name="i-heroicons-circle-stack" class="text-2xl opacity-20" />
          Belum ada data {{ isIncomeMode ? "income" : "spending" }} bulan ini.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from "~/stores/ui";
import { useTransactionStore } from "~/stores/useTransactionStore";
import { useBankStore } from "~/stores/banks";

const transactionStore = useTransactionStore();
const bankStore = useBankStore();
const ui = useUIStore();

const isIncomeMode = ref(false);
const isGuidanceVisible = ref(false);
const currentTotal = computed(() =>
  isIncomeMode.value ? transactionStore.income : transactionStore.expense
);


onMounted(async () => {
  setTimeout(() => {
    if (transactionStore.actualBalance <= 0) {
      isGuidanceVisible.value = true;
    }
  }, 1000);

});
</script>

<style scoped lang="scss">
.card-wrapper {
  padding: 0 15px;
  width: 100%;
}

@keyframes grow {
  from {
    width: 0;
  }
}

.rounded-full {
  animation: grow 1s ease-out;
}

.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-fast-enter-from,
.fade-fast-leave-to {
  opacity: 0;
  transform: translateY(2px);
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-5px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
