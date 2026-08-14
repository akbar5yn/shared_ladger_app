<template>
  <div class="flex flex-col gap-3">
    <DashboardHeader id="main-header" />
    <main id="main-slot" class="main-index flex flex-col gap-2">
      <ClientOnly>
        <Transition name="fade-layout" mode="out-in">
          <DashboardSkeleton v-if="isLoading" key="loading" />

          <div v-else key="content" class="flex flex-col gap-2">
            <BalanceCard id="balance-card" />
            <OverviewCard id="spending-card" />
            <!-- <Drawer /> -->
          </div>
        </Transition>
      </ClientOnly>
    </main>

    <!-- //SECTION MODAL -->

    <!-- <ToastModal /> -->
    <ToastModal />
    <CreateAccountModal />
  </div>
</template>

<script setup lang="ts">
import BalanceCard from "~/components/dashboard/BalanceCard.vue";
import OverviewCard from "~/components/dashboard/OverviewCard.vue";
import ToastModal from "~/components/ui/modals/ToastModal.vue";
import CreateAccountModal from "~/components/dashboard/CreateAccountModal.vue";
import { useBankStore } from "~/stores/banks";
import { useUIStore } from "~/stores/ui";
import { useTransactionStore } from "~/stores/useTransactionStore";

definePageMeta({ middleware: ["auth"], layout: "default" });

const ui = useUIStore();
const transactionStore = useTransactionStore();
const bankStore = useBankStore()
const { getAdvisor, getSummary } = useSummary()
const { handleComeTransaction, checkPendingData, getAccount, getPendingTransaction } = useBankObserver();

const isLoading = ref(true);

onMounted(async () => {
  try {
    ui.setPageLoading(true);
    await transactionStore.rehydrate();
    handleComeTransaction();
    getAccount()
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        console.log("Welcome back! Checking warehouse...");
        checkPendingData();
      }
    });
  } finally {
    setTimeout(() => {
      isLoading.value = false;
      ui.setPageLoading(false);
    }, 800);
  }
});

watch(
  () => bankStore.activeAccountId,
  async (newAccountId) => {
    // Di slide "Tambah Akun" gak ada akun aktif → tiadakan summary biar gak membingungkan.
    if (bankStore.atAddCard || !newAccountId) {
      transactionStore.setSummaryLoading(false)
      return
    }
    // Tampilkan skeleton loader saat fetch summary bulanan dari API.
    transactionStore.setSummaryLoading(true)
    try {
      await getPendingTransaction(newAccountId)
      await getAdvisor(newAccountId)
      await getSummary(newAccountId)
    } finally {
      transactionStore.setSummaryLoading(false)
    }
  }
)

// Pantau juga posisi slide tambah akun → kalau masuk/ keluar slide, refresh summary.
watch(
  () => bankStore.atAddCard,
  (isAdd) => {
    if (isAdd) {
      // Masuk slide tambah akun: sembunyikan summary (Placeholder di OverviewCard).
      transactionStore.setSummaryLoading(false)
    } else if (bankStore.activeAccountId) {
      // Keluar dari slide tambah → kembali ke akun terakhir, fetch ulang.
      transactionStore.setSummaryLoading(true)
      getPendingTransaction(bankStore.activeAccountId)
      getAdvisor(bankStore.activeAccountId)
      getSummary(bankStore.activeAccountId).finally(() =>
        transactionStore.setSummaryLoading(false)
      )
    }
  }
)
</script>

<style scoped>
.fade-layout-enter-active,
.fade-layout-leave-active {
  transition: all 0.4s ease;
}

.fade-layout-enter-from,
.fade-layout-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
