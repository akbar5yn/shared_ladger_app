<template>
  <section class="navigation-wrapper">
    <div class="nav-container flex justify-center overflow-x-auto pb-4 no-scrollbar">
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

const ui = useUIStore();
const route = useRoute();

const menus = [
  { name: "Home", icon: "i-heroicons-home", path: "/dashboard" }, // Tambah path
  { name: "Bills", icon: "i-heroicons-document-text", path: "/dashboard/bills" },
  { name: "Send", icon: "i-heroicons-paper-airplane", path: "/dashboard/send" },
  { name: "History", icon: "i-heroicons-clock", path: "/dashboard/history" },
  { name: "Logout", icon: "i-heroicons-arrow-right-on-rectangle", path: "" },
];

const activeMenu = computed(() => {
  const currentMenu = menus.find((m) => m.path === route.path);
  return currentMenu ? currentMenu.name : "Home";
});

const isDark = computed(() => ui.isDark);

const setActive = (name: string) => {
  if (name === "Logout") {
    ui.openLogoutModal(true);
  } else {
    navigateTo(menus.find((m) => m.name === name)?.path);
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
