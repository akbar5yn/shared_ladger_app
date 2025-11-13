<template>
  <div class="flip-container">
    <div class="flipper" :class="{ flipped: !isLogin }">
      <div class="card front flex justify-center items-center">
        <slot name="login"></slot>
      </div>

      <div class="card back">
        <slot name="register"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isLogin: boolean;
}>();
</script>

<style scoped>
.flip-container {
  perspective: 1000px;
  width: 400px;
  height: 100%;
  position: relative;
  z-index: 50;
}

.flipper {
  transition: transform 0.8s ease-in-out;
  transform-style: preserve-3d;
  position: relative;
  width: 100%;
  height: 100%;
}

.flipper.flipped {
  transform: rotateY(180deg);
}

.card {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.front {
  transform: rotateY(0deg);
  z-index: 2;
}

.back {
  transform: rotateY(180deg);
  z-index: 1;
}
</style>
