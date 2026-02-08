<template>
  <div class="flex flex-col gap-5">
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

    <ToastModal />
    <ModalLogout />
  </div>
</template>

<script setup lang="ts">
import BalanceCard from "~/components/dashboard/BalanceCard.vue";
import OverviewCard from "~/components/dashboard/OverviewCard.vue";
import ModalLogout from "~/components/ui/modals/ModalLogout.vue";
import ToastModal from "~/components/ui/modals/ToastModal.vue";
import { useTransactionStore } from "~/stores/useTransactionStore";

definePageMeta({ middleware: ["auth"], layout: "default" });

const transactionStore = useTransactionStore();
const { handleComeTransaction, checkPendingData } = useBankObserver();

const isLoading = ref(true);

onMounted(async () => {
  try {
    await transactionStore.rehydrate();
    handleComeTransaction();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        console.log("Welcome back! Checking warehouse...");
        checkPendingData();
      }
    });
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  }
});
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
