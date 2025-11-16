<template>
  <main class="content-wrapper flex flex-col">
    <div class="wrapper-header">
      <ClientOnly>
        <Lottie
          width="50%"
          height="100%"
          class="relative"
          name="online_investment"
        />
        <template #fallback>
          <div class="flex justify-center items-center h-full p-5">
            <USkeleton
              class="w-1/2 h-full py-10 rounded-lg bg-gray-300 custom-shimmer"
              :ui="{ rounded: 'rounded-full' }"
            />
          </div>
        </template>
      </ClientOnly>
    </div>
    <div class="auth-content">
      <slot />
    </div>
  </main>
</template>

<style scoped>
.custom-shimmer {
  background: linear-gradient(to right, #e0e0e0 0%, #f5f5f5 50%, #e0e0e0 100%);
  background-size: 200% 200%;
  animation: shimmer 1.5s infinite linear;
}
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
