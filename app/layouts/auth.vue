<template>
  <div class="container relative">
    <NuxtImg src="icons/bulan.webp" class="bulan" />
    <NuxtImg src="icons/bintang.webp" class="bintang" />
    <slot />
  </div>
</template>

<style scoped>
.bulan {
  position: absolute;
  bottom: -25%;
  left: 50%;
  transform: translateX(-50%) rotate(270deg);

  max-width: 600px;
  pointer-events: none;
  z-index: 0;
  opacity: 1;
  mix-blend-mode: lighten;
}

.bintang {
  position: absolute;
  top: -90px;
  left: 50%;
  width: 100%;
  transform: translateX(-50%) rotate(180deg);

  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
  mix-blend-mode: lighten;
}

.container {
  padding: 20px 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: linear-gradient(
    to top,
    #212332 0%,
    #242736 25%,
    #202020 50%,
    #0d1724 100%
  );

  height: 100dvh;
  width: 100%;
  z-index: 99;
  max-width: 100%;
}
</style>
