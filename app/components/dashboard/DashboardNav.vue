<template>
  <section id="navigation-wrapper" class="navigation-wrapper">
    <div
      id="nav-container"
      class="nav-container flex justify-center overflow-x-auto pb-4 no-scrollbar"
    >
      <div
        v-for="menu in menus"
        :key="menu.name"
        @click="setActive(menu.name)"
        class="nav-item flex flex-col items-center gap-2 min-w-[70px]"
      >
        <div
          class="icon-box flex items-center border justify-center w-14 h-14 rounded-2xl transition-all duration-300 active:scale-90"
          :class="[
            {
              'border-gray-500/50 glasses-nav': !isDark && activeMenu !== menu.name,
              'border-white/30 glasses-nav': isDark && activeMenu !== menu.name,
            },
            activeMenu === menu.name
              ? isDark
                ? 'border-amber-500 btn-is-dark'
                : 'border-amber-500 btn-is-light'
              : '',
          ]"
        >
          <UIcon
            :name="menu.icon"
            class="text-2xl transition-all duration-300"
            :class="[
              {
                'font-light': isDark,
                'text-amber-500': activeMenu === menu.name,
              },
            ]"
          />
        </div>
        <span
          class="text-xs font-medium transition-all duration-300"
          :class="[
            { 'text-slate-300': isDark, 'text-amber-500': activeMenu === menu.name },
          ]"
        >
          {{ menu.name }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUIStore } from "~/stores/ui";
import { registerPlugin } from "@capacitor/core";
import { useTransactionStore } from "~/stores/useTransactionStore";

interface NotificationStoragePlugin {
  exportData(options: { dataExport: string }): Promise<void>;
}
const NotificationStorage = registerPlugin<NotificationStoragePlugin>(
  "NotificationStorage"
);
const ui = useUIStore();
const route = useRoute();
const transactionStore = useTransactionStore();

const menus = [
  { name: "Home", icon: "i-heroicons-home", path: "/dashboard" },
  { name: "History", icon: "i-heroicons-clock", path: "/history" },
  { name: "Send", icon: "i-heroicons-paper-airplane", path: "/dashboard/send" },
  { name: "Export", icon: "i-heroicons-arrow-down-tray", path: "action:export" },
  { name: "Logout", icon: "i-heroicons-arrow-right-on-rectangle", path: "" },
];

const activeMenu = computed(() => {
  const currentMenu = menus.find((m) => m.path === route.path);
  return currentMenu ? currentMenu.name : "Home";
});

const isDark = computed(() => ui.isDark);

const setActive = async (name: string) => {
  if (name === "Logout") {
    ui.openLogoutModal(true);
  }
  if (name === "Export") {
    try {
      const historyData = transactionStore.history;
      if (historyData.length === 0) return alert("Kosong, Cok!");
      const backupData = {
        history: transactionStore.history,
        actualBalance: transactionStore.actualBalance, // Simpen saldo
        exportedAt: new Date().toISOString(),
      };
      const jsonData = JSON.stringify(backupData, null, 2);

      const header = "Tanggal,Waktu,Kategori,Tipe,Nominal,Keterangan\n";
      const rows = historyData
        .map((item) => {
          return [
            item.date,
            item.time,
            item.category,
            item.type,
            item.amount,
            `"${item.text}"`,
          ].join(",");
        })
        .join("\n");
      const csvData = header + rows;

      await NotificationStorage.exportData({ dataExport: jsonData });

      await NotificationStorage.exportData({ dataExport: csvData });

      alert("✅ Double Export Berhasil! Cek folder Download, ada file JSON & CSV.");
    } catch (e) {
      alert("Gagal export dua-duanya, Cok!");
    }
  }
  const targetPath = menus.find((m) => m.name === name)?.path;
  if (targetPath) {
    navigateTo(targetPath);
  }
};
</script>

<style scoped lang="scss">
.navigation-wrapper {
  margin: 0 -20px;
  padding: 1px 20px;

  .nav-container {
    padding: 8px 0;
  }

  .nav-item {
    .glasses-nav {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }
  }
}
</style>
