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

  max-width: 600px; /* bisa disesuaikan */
  pointer-events: none; /* tidak ganggu klik */
  z-index: 0;
  opacity: 1;
  mix-blend-mode: lighten;
}

.bintang {
  position: absolute;
  top: -90px;
  left: 50%;
  transform: translateX(-50%) rotate(180deg);

  pointer-events: none; /* tidak ganggu klik */
  z-index: 0;
  opacity: 0.6;
  mix-blend-mode: lighten;
}

.container {
  padding: 20px 50px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: linear-gradient(
    to top,
    #212332 0%,
    /* paling gelap di atas */ #252525 50%,
    /* warna dasar */ #0d1724 100% /* makin terang di bawah */
  );

  height: 100dvh;
  width: 100%;
  z-index: 99;
  max-width: 100%;
}
</style>
