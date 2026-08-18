<template>
  <div class="layout-wrapper" :class="{ 'dark-mode': isDark }">
    <div class="layer light-layer">
      <div class="ambient"/>
    </div>
    <div class="layer dark-layer">
      <div class="ambient"/>
    </div>
    <div class="theme-toggle-wrapper">
      <button
        class="relative w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-md border overflow-hidden transition-all duration-300 active:scale-90"
        :class="[{ 'btn-is-dark': isDark, 'btn-is-light': !isDark }]" @click="toggleMode">
        <div v-if="isDark" key="moon" class="absolute">
          <svg
xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="text-yellow-400">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </div>
        <div v-else key="sun" class="absolute">
          <svg
xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="text-orange-300">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        </div>
      </button>
    </div>
    <div class="main-wrapper">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUIStore } from "~/stores/ui";
const themeStore = useUIStore();
const isDark = computed(() => themeStore.isDark);
const toggleMode = () => themeStore.toggleTheme();

onMounted(() => themeStore.initTheme());
</script>

<style scoped>
.layout-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 70px 30px;
  background-color: #f1f5f9;
  height: 100vh;
  transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.layout-wrapper.dark-mode {
  background-color: #0b1220;
}

.layer {
  position: absolute;
  inset: 0;
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.light-layer {
  background: linear-gradient(to bottom,
      rgba(255, 170, 0, 0.101) 20%,
      rgb(255, 255, 255) 50%);
  opacity: 1;
  z-index: 0;
  overflow: hidden;
}

.dark-layer {
  background: linear-gradient(to bottom,
      rgba(255, 170, 0, 0.15) 0%,
      rgb(11, 18, 32) 60%);
  opacity: 0;
  z-index: 0;
  overflow: hidden;
}

.layout-wrapper.dark-mode .light-layer {
  opacity: 0;
}

.layout-wrapper.dark-mode .dark-layer {
  opacity: 1;
}

.ambient {
  position: absolute;
  width: 400px;
  height: 400px;
  background: rgba(255, 213, 62, 0.4);
  filter: blur(50px);
  border-radius: 50%;
  top: 0%;
  left: 50%;
  z-index: 1;
  transform: translate(-50%, -50%);
}

.theme-toggle-wrapper {
  position: absolute;
  top: calc(env(safe-area-inset-top, 0px) + 1rem);
  right: 1rem;
  z-index: 2;
}

.main-wrapper {
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
