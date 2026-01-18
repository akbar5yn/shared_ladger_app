<template>
  <div class="layout-wrapper">
    <div class="layer light-layer">
      <div class="ambient"></div>
    </div>
    <div class="main-wrapper">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useThemeStore } from "~/stores/theme";
const themeStore = useThemeStore();

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
  background-color: f1f5f9;
  height: 100vh;
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
  z-index: -2;
  overflow: hidden;
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

.main-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
