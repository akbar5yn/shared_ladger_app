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
        <div class="flex-1 text-center group cursor-pointer">
          <UModal v-model:open="isOpen">
            <p
              class="text-xs mb-1 transition-colors duration-700 flex items-center justify-center gap-1"
              :class="ui.isDark ? 'text-slate-400' : 'text-gray-500'"
            >
              Current Balance
              <UIcon name="i-heroicons-pencil-square" class="text-[10px]" />
            </p>
            <p
              class="text-xl font-bold transition-colors duration-700"
              :class="ui.isDark ? 'text-white' : 'text-slate-900'"
            >
              {{ transactionStore.formatIDR(transactionStore.remainingBalance) }}
            </p>

            <template #content>
              <UCard
                :ui="{
                  root: 'shadow-xl bg-white dark:bg-white overflow-hidden border-none',
                  header:
                    'bg-gray-50/50 dark:bg-white border-b border-gray-100 dark:border-slate-800 p-4',
                  body: 'p-6 bg-white',
                  footer: 'p-4 bg-gray-50/30 dark:bg-white',
                }"
              >
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-base font-bold text-slate-900 dark:text-white">
                      Update Saldo Manual
                    </h3>
                  </div>
                </template>

                <div class="space-y-4">
                  <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Masukkan nominal untuk menambah saldo utama mu saat ini.
                  </p>

                  <UFieldGroup
                    label="Nominal Pemasukan (Rp)"
                    class="font-medium text-slate-700 dark:text-slate-200"
                  >
                    <UInput
                      v-model="displayAmount"
                      type="text"
                      inputmode="numeric"
                      placeholder="Masukan nominal mu"
                      icon="i-heroicons-banknotes"
                      class="w-full"
                      :ui="{
                        base:
                          'bg-white dark:bg-gray-200/50 border text-sm font-black text-slate-900 ring-0 focus:ring-0 focus-visible:ring-0 font-medium',
                      }"
                      autofocus
                    />
                  </UFieldGroup>
                </div>

                <template #footer>
                  <div class="flex justify-end gap-3">
                    <UButton
                      color="neutral"
                      variant="ghost"
                      label="Batal"
                      class="hover:bg-gray-100 text-black"
                      @click="isOpen = false"
                    />
                    <UButton
                      :ui="{
                        base: 'bg-amber-200',
                      }"
                      label="Update Saldo"
                      class="px-6 shadow-md"
                      @click="handleUpdateBalance"
                    />
                  </div>
                </template>
              </UCard>
            </template>
          </UModal>
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
            {{ transactionStore.formatIDR(transactionStore.totalExpenses) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from "~/stores/ui";
import { useTransactionStore } from "~/stores/useTransactionStore";
const ui = useUIStore();
const transactionStore = useTransactionStore();
const isOpen = ref(false);
const manualAmount = ref<number | null>(null);

const displayAmount = computed({
  get: () => {
    if (!manualAmount.value || manualAmount.value === 0) return "";
    return manualAmount.value.toLocaleString("id-ID");
  },
  set: (newValue) => {
    const numberValue = parseInt(newValue.replace(/\D/g, ""));
    manualAmount.value = isNaN(numberValue) ? 0 : numberValue;
  },
});

const handleUpdateBalance = () => {
  if (manualAmount.value && manualAmount.value > 0) {
    transactionStore.addManualIncome(Number(manualAmount.value));
    manualAmount.value = null;
    isOpen.value = false;
  }
};
</script>

<style lang="scss" scoped>
.card-wrapper {
  padding: 15px;
}

.bg-add-balance {
  background-color: red;
}

.card-container {
  isolation: isolate;
  backface-visibility: hidden;
}
</style>
