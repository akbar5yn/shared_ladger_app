<template>
  <div class="flex flex-col gap-5">
    <DashboardHeader id="main-header" />
    <main class="main-index flex flex-col gap-2">
      <BalanceCard id="balance-card" class="relative z-0" />
      <SpendingCard id="spending-card" />
      <Drawer />
    </main>

    <!-- //SECTION MODAL -->

    <ToastModal />
    <ModalLogout />
  </div>
</template>

<script setup lang="ts">
import BalanceCard from "~/components/dashboard/BalanceCard.vue";
import Drawer from "~/components/dashboard/Drawer.vue";
import SpendingCard from "~/components/dashboard/SpendingCard.vue";
import ModalLogout from "~/components/ui/modals/ModalLogout.vue";
import ToastModal from "~/components/ui/modals/ToastModal.vue";
import { useBankObserver } from "~/composables/useBankObserver";
import { useTransactionStore } from "~/stores/useTransactionStore";

definePageMeta({ middleware: ["auth"], layout: "default" });

const transactionStore = useTransactionStore();

const { handleComeTransaction } = useBankObserver();

onMounted(async () => {
  handleComeTransaction();
  await transactionStore.rehydrate();
});
</script>

<style scoped></style>
