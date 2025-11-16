<template>
  <div class="container relative">
    <div class="ambient-background overflow-hidden">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  height: 100dvh;
  width: 100%;
  z-index: 99;
  max-width: 100%;
}
</style>
