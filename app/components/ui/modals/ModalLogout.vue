<template>
  <BaseModal v-model="ui.isLogoutModalOpen" :isDark="isDark">
    <div class="flex flex-col items-center text-center p-8">
      <div
        class="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-500"
      >
        <UIcon name="i-heroicons-exclamation-triangle" class="text-3xl" />
      </div>

      <h3 class="mb-2 text-xl font-bold">Yakin mau keluar?</h3>
      <p class="mb-8 text-sm opacity-70">
        Kamu harus login ulang nanti kalau mau cek saldo atau kirim duit lagi.
      </p>

      <div class="flex w-full flex-col gap-3">
        <button
          @click="confirmLogout"
          class="w-full rounded-2xl bg-amber-500 py-3 font-bold text-black border-black border transition-all active:scale-95 shadow-lg shadow-amber-500/30"
        >
          Ya, Keluar Sekarang
        </button>
        <button
          @click="ui.isLogoutModalOpen = false"
          class="w-full rounded-2xl py-3 font-semibold t ransition-all active:scale-95 opacity-60"
        >
          Nggak jadi, balik deh
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useUIStore } from "~/stores/ui";
import BaseModal from "./BaseModal.vue";

const router = useRouter();
const ui = useUIStore();
const { logout } = useAuthStore();

const confirmLogout = () => {
  logout();
  ui.isLogoutModalOpen = false;
  router.replace("/");
};

const isDark = computed(() => ui.isDark);
</script>
