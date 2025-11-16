<template>
  <div class="flex flex-col gap-8">
    <header class="dashboard-header glasses">
      <div class="flex flex-col">
        <span class="text-gray-600">Hi, {{ userInfo?.name }}</span>
        <span>{{ userInfo?.email }}</span>
      </div>
      <ClientOnly>
        <div class="relative w-12 h-12">
          <NuxtImg
            src="/icons/user.png"
            alt="user_avatar"
            width="50"
            height="50"
            :class="imgLoaded ? 'opacity-100' : 'opacity-0'"
            @load="onImgLoad"
          />
        </div>
      </ClientOnly>
    </header>
    <main class="flex flex-col">
      <section class="card-section flex gap-4 h-[200px]">
        <button class="add-card glasses h-full">
          <UIcon name="i-heroicons-plus" class="h-5 w-5"></UIcon>
        </button>
        <UCard class="card-wrapper glasses" :ui="{ root: 'overflow-hidden' }">
          <template #header>
            <div class="flex justify-between items-center text-white">
              <span class="text-sm">Balance</span>
              <UIcon name="i-heroicons-squares-2x2" class="text-4xl" />
            </div>
          </template>

          <div class="balance-amount text-white text-3xl font-bold mb-2">
            <span class="currency">Rp</span> 56.100
          </div>

          <div class="card-number text-white text-xl font-mono tracking-wider">
            <span>****</span> <span>****</span> <span>****</span>
            <span>2415</span>
          </div>

          <template #footer>
            <div class="flex justify-between items-center text-white">
              <div class="card-holder">
                <span class="text-sm block text-gray-100">Card Holder</span>
                <span class="text-lg font-semibold block">{{
                  userInfo?.name
                }}</span>
              </div>
              <UIcon
                name="i-heroicons-mastercard"
                class="text-4xl opacity-70"
              />
            </div>
          </template>
        </UCard>
      </section>
    </main>
    <p v-if="isVisible">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

definePageMeta({ middleware: ["auth"] });
const { userInfo } = useAuthStore();
const { message, isVisible } = useNotifier();

const imgLoaded = ref(false);

function onImgLoad() {
  imgLoaded.value = true;
}
</script>

<style scoped>
.glasses {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid white;
  border-radius: 12px;
}
.dashboard-header {
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-card {
  width: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-wrapper {
  background: linear-gradient(135deg, #746d6485 0%, #ee616141 100%);
  border-radius: 1.5rem;
  padding: 1.1rem;
  width: 100%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>
