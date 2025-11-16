<template>
  <div class="container relative">
    <div class="flex flex-col w-full px-5 pt-8 pb-5">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.container {
  background-image: url("/icons/background.png");
  position: absolute;
  top: 0;
  left: 0;
  background-size: cover;
  height: 100%;
  width: 100%;
}
</style>
