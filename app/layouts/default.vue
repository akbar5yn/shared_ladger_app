<template>
  <div class="container-bg">
    <div class="layer light-layer" :class="{ 'hidden-layer': themeStore.isDark }"></div>

    <div class="layer dark-layer" :class="{ 'active-layer': themeStore.isDark }"></div>

    <div class="glass-layer" :style="{ paddingTop: 'env(safe-area-inset-top, 0px)' }">
      <div class="main-slot flex flex-col w-full">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from "~/stores/ui";
const themeStore = useUIStore();

onMounted(() => themeStore.initTheme());
</script>

<style lang="scss" scoped>
.container-bg {
  position: fixed;
  inset: 0;
  z-index: -2;

  .layer {
    position: absolute;
    inset: 0;
    transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* --- LIGHT MODE SETUP --- */
  .light-layer {
    background-color: #fafafa;
    opacity: 1;
    z-index: -2;
    overflow: hidden;
  }

  /* --- DARK MODE SETUP --- */
  .dark-layer {
    background: #0f172a;
    opacity: 0;
    z-index: -1;
  }

  /* Efek Vignette di sekeliling layar */
  .dark-layer::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      rgba(15, 23, 42, 0) 0%,
      rgba(2, 6, 23, 0.7) 100%
    );
  }

  .dark-layer.active-layer {
    opacity: 1;
  }

  .glass-layer {
    width: 100%;
    min-height: 100dvh;
    transition: all 0.8s ease;

    .main-slot {
      height: 100vh;
      max-height: 100dvh;
    }
  }
}

/* --- TRANSITION LOGIC --- */
.hidden-layer {
  opacity: 0;
}

/* Glass effect saat Dark Mode */
.active-layer ~ .glass-layer {
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
}
</style>
