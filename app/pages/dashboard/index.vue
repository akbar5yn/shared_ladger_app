<template>
  <div class="flex flex-col gap-5">
    <DashboardHeader id="main-header" />
    <main class="main-index flex flex-col gap-10">
      <BalanceCard class="relative z-0" />
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
import ModalLogout from "~/components/ui/modals/ModalLogout.vue";
import ToastModal from "~/components/ui/modals/ToastModal.vue";
definePageMeta({ middleware: ["auth"] });
</script>

<style scoped></style>
