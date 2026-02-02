<template>
  <div class="card-wrapper">
    <div
      id="spending-container"
      class="card-container relative w-full rounded-3xl px-6 py-5 border transition-all duration-700"
      :class="
        ui.isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'
      "
    >
      <div class="flex justify-between items-center mb-1">
        <span
          :class="ui.isDark ? 'text-slate-400' : 'text-gray-500'"
          class="text-xs font-medium tracking-wider"
        >
          {{ isIncomeMode ? "Income" : "Spending" }} Overview
        </span>

        <button
          @click="isIncomeMode = !isIncomeMode"
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all active:scale-95 justify-center"
          style="min-width: 115px"
          :class="
            isIncomeMode
              ? 'bg-emerald-500/10 text-emerald-500'
              : 'bg-amber-500/10 text-amber-500'
          "
        >
          <UIcon
            :name="
              isIncomeMode
                ? 'i-heroicons-arrow-trending-up'
                : 'i-heroicons-arrow-trending-down'
            "
          />
          <span>Switch to {{ isIncomeMode ? "Spending" : "Income" }}</span>
        </button>
      </div>

      <div class="mt-1 flex flex-col gap-4">
        <div class="flex items-baseline gap-2">
          <h1
            class="text-2xl font-bold tracking-tight transition-colors duration-500"
            :class="[
              isIncomeMode
                ? 'text-emerald-500'
                : ui.isDark
                ? 'text-white'
                : 'text-slate-900',
            ]"
          >
            {{ transactionStore.formatIDR(currentTotal) }}
          </h1>
          <span
            v-if="!isIncomeMode"
            :class="ui.isDark ? 'text-slate-500' : 'text-gray-400'"
            class="text-xs flex items-center gap-1"
          >
            From
            <div class="relative flex items-center h-6">
              <Transition name="fade-fast" mode="out-in">
                <div v-if="isEditingBudget" :key="'edit'" class="flex items-center gap-1">
                  <span class="text-amber-500 font-bold text-[10px]">Rp</span>
                  <input
                    v-focus
                    v-model="displayBudget"
                    type="text"
                    inputmode="numeric"
                    @input="onInputBudget"
                    @blur="finishEdit"
                    @keyup.enter="finishEdit"
                    class="w-24 bg-transparent border-b-2 border-amber-500 font-bold text-amber-500 outline-none p-0 h-6 transition-all"
                    placeholder="0"
                  />
                </div>

                <div
                  v-else
                  :key="'display'"
                  @click.stop="startEdit"
                  class="flex items-center gap-1.5 cursor-pointer group relative"
                >
                  <span class="font-bold hover:text-amber-500 transition-colors">
                    {{ transactionStore.formatIDR(transactionStore.monthlyBudget) }}
                  </span>

                  <div class="relative">
                    <UIcon
                      name="i-heroicons-pencil-square"
                      class="w-3.5 h-3.5 text-amber-500 transition-all"
                    />

                    <div
                      v-if="isGuidanceVisible"
                      class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded-lg whitespace-nowrap shadow-xl"
                    >
                      Isi budget lu dulu, Cok!
                      <div
                        class="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"
                      ></div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </span>
          <span v-else class="text-emerald-500/50 text-[10px] font-medium italic"
            >Monthly Profit</span
          >
        </div>

        <div v-if="currentTotal > 0" class="flex h-3 w-full gap-1.5 overflow-hidden">
          <div
            v-for="(cat, index) in activeCategories"
            :key="`${isIncomeMode ? 'in' : 'ex'}-${index}`"
            class="h-full rounded-full transition-all duration-1000 shadow-sm"
            :style="{ width: `${getPercentage(cat)}%` }"
            :class="getCategoryColor(cat)"
          ></div>

          <div
            v-if="!isIncomeMode && transactionStore.spendingPercentage < 100"
            class="h-full flex-1 rounded-full bg-slate-200 dark:bg-slate-700"
          ></div>
        </div>

        <div v-if="activeCategories.length > 0" class="flex flex-col gap-3 mt-2">
          <div
            v-for="cat in activeCategories"
            :key="cat"
            class="flex justify-between items-center text-sm animate-fade-in"
          >
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full" :class="getCategoryColor(cat)"></div>
              <span :class="ui.isDark ? 'text-slate-300' : 'text-gray-600'">{{
                cat
              }}</span>
            </div>
            <span
              class="font-bold"
              :class="
                isIncomeMode
                  ? 'text-emerald-500'
                  : ui.isDark
                  ? 'text-white'
                  : 'text-slate-900'
              "
            >
              {{
                transactionStore.formatIDR(
                  transactionStore.getCategoryTotal(
                    cat,
                    isIncomeMode ? "income" : "expense"
                  )
                )
              }}
            </span>
          </div>
        </div>

        <div v-else class="py-4 text-center text-xs italic text-slate-500">
          Belum ada data {{ isIncomeMode ? "income" : "spending" }} bulan ini.
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

const isIncomeMode = ref(false);
const isEditingBudget = ref(false);
const isGuidanceVisible = ref(false);
const displayBudget = ref("");
const tempBudget = ref(transactionStore.monthlyBudget);

const currentTotal = computed(() =>
  isIncomeMode.value ? transactionStore.totalIncomes : transactionStore.totalExpenses
);

const activeCategories = computed(() =>
  isIncomeMode.value
    ? transactionStore.activeIncomeCategories
    : transactionStore.activeCategories
);

const getPercentage = (cat: any) => {
  return isIncomeMode.value
    ? transactionStore.getIncomeCategoryPercentage(cat)
    : transactionStore.getCategoryPercentage(cat);
};

const startEdit = async () => {
  displayBudget.value = transactionStore.monthlyBudget.toLocaleString("id-ID");
  isEditingBudget.value = true;
  isGuidanceVisible.value = false;
};

const onInputBudget = (e: Event) => {
  const target = e.target as HTMLInputElement;
  let val = target.value.replace(/\D/g, "");

  if (val) {
    displayBudget.value = Number(val).toLocaleString("id-ID");
  } else {
    displayBudget.value = "";
  }
};

const finishEdit = () => {
  const cleanValue = parseInt(displayBudget.value.replace(/\./g, "")) || 0;

  if (cleanValue !== transactionStore.monthlyBudget) {
    transactionStore.setBudget(cleanValue);
  }
  isEditingBudget.value = false;
};

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    "Makan/Minum": "bg-amber-200",
    Belanja: "bg-teal-500",
    Jajan: "bg-amber-500",
    "Cicilan/Tagihan": "bg-red-400",
    Tabungan: "bg-blue-500",
    Transfer: "bg-emerald-300",
    "Gaji/Income": "bg-green-500",
    Investasi: "bg-indigo-500",
  };
  return colors[category] || "bg-slate-400";
};

const vFocus = {
  mounted: (el: HTMLInputElement) => {
    setTimeout(() => {
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }, 150);
  },
};

onMounted(() => {
  setTimeout(() => {
    if (transactionStore.monthlyBudget <= 0) {
      isGuidanceVisible.value = true;
    }
  }, 1000);
});

watch(
  () => transactionStore.monthlyBudget,
  (newVal) => {
    tempBudget.value = newVal;
  }
);
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

.card-wrapper {
  padding: 0 15px;
  width: 100%;
}
</style>
