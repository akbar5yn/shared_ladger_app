<template>
  <UModal v-model:open="ui.isImportModalOpen">
    <template #content>
      <UCard
        :ui="{
          root: [
            'shadow-xl overflow-hidden border-none transition-colors duration-500',
            ui.isDark ? 'bg-slate-700/10' : 'bg-white',
          ],
          header: [
            'p-3  ',
            ui.isDark ? 'bg-slate-900 border-slate-900' : 'border-b-1 border-gray-200',
          ],
          body: 'p-6 border-none',
          footer: [
            'p-4',
            ui.isDark ? 'bg-slate-900' : 'bg-gray-50/30 border-t-1 border-gray-200',
          ],
        }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="p-2 flex items-center bg-amber-500/10 rounded-lg">
              <UIcon name="i-heroicons-cloud-arrow-down" class="text-md text-amber-500" />
            </div>
            <h3 class="font-bold" :class="ui.isDark ? ' text-white' : ' text-slate-900'">
              Konfirmasi Import Data
            </h3>
          </div>
        </template>

        <div class="space-y-4">
          <div
            class="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-300"
          >
            <p
              class="text-xs font-medium mb-1 uppercase tracking-wider"
              :class="ui.isDark ? ' text-amber-400' : ' text-slate-900'"
            >
              Data Ditemukan
            </p>
            <div class="flex items-baseline gap-2">
              <span
                class="text-2xl font-black"
                :class="ui.isDark ? ' text-white' : ' text-slate-900'"
              >
                {{ ui.importData?.history?.length || 0 }}
              </span>
              <span class="text-xs text-slate-500">Transaksi</span>
            </div>
            <p class="text-[11px] mt-2 text-slate-500 leading-relaxed">
              Saldo dalam backup:
              <span class="font-bold text-slate-900 dark:text-amber-500">
                {{ transactionStore.formatIDR(ui.importData?.actualBalance || 0) }}
              </span>
            </p>
          </div>

          <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Mau ambil riwayat transaksinya aja atau sekalian update saldo utama lu, Cok?
          </p>
        </div>

        <template #footer>
          <div class="flex flex-col gap-2">
            <UButton
              block
              color="primary"
              label="Update Semua (History + Saldo)"
              class="font-bold py-2.5"
              @click="confirmImport(true)"
            />
            <div class="grid grid-cols-2 gap-2">
              <UButton
                block
                color="secondary"
                label="History Aja"
                class="font-medium"
                @click="confirmImport(false)"
              />
              <UButton
                block
                color="warning"
                label="Batal"
                @click="ui.closeImportModal()"
              />
            </div>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useUIStore } from "~/stores/ui";
import { useTransactionStore } from "~/stores/useTransactionStore";

const ui = useUIStore();
const transactionStore = useTransactionStore();

const confirmImport = async (withBalance: boolean) => {
  const data = ui.importData;
  if (!data) return;

  // 1. Merge History
  const importedHistory = data.history || [];
  const existingIds = new Set(transactionStore.history.map((t) => t.id));
  const uniqueNewData = importedHistory.filter((item: any) => !existingIds.has(item.id));

  if (uniqueNewData.length > 0) {
    transactionStore.history = [...uniqueNewData, ...transactionStore.history];
  }

  // 2. Update Saldo & Budget
  if (withBalance && data.actualBalance !== undefined) {
    transactionStore.actualBalance = data.actualBalance;
    if (data.monthlyBudget) transactionStore.monthlyBudget = data.monthlyBudget;
  }

  await transactionStore.saveToDisk();
  ui.closeImportModal();
  alert(`✅ Berhasil import ${uniqueNewData.length} data baru!`);
};
</script>
