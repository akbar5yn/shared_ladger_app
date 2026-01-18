<template>
  <div class="flex flex-col gap-8">
    <header class="dashboard-header">
      <div class="profile-wrapper flex items-center gap-5">
        <ClientOnly>
          <div class="img-wrapper relative w-14 h-14">
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
        <div class="flex flex-col gap-0 justify-center">
          <span class="day" :class="[{ 'light-mode-font': isDark }]">Good Morning,</span>
          <span class="username" :class="[{ 'light-mode-font': isDark }]">{{
            userInfo?.name
          }}</span>
        </div>
      </div>
      <div class="toggle-btn-wrapper">
        <button
          @click="toggleMode"
          :class="[{ 'is-dark': isDark, 'is-light': !isDark }]"
          class="relative w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-md border overflow-hidden transition-all duration-300 active:scale-90"
        >
          <transition name="sun-moon">
            <div v-if="isDark" key="moon" class="absolute">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-yellow-400"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            </div>
            <div v-else key="sun" class="absolute">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-orange-300"
              >
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
          </transition>
        </button>
      </div>
    </header>
    <main class="flex flex-col gap-10 mt-5">
      <section class="navigation"></section>
      <section class="card-section flex gap-4 h-[200px]">
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
                <span class="text-lg font-semibold block">{{ userInfo?.name }}</span>
              </div>
              <UIcon name="i-heroicons-mastercard" class="text-4xl opacity-70" />
            </div>
          </template>
        </UCard>
      </section>
    </main>
    <ToastModal />
  </div>
</template>

<script setup lang="ts">
import ToastModal from "~/components/ui/modals/ToastModal.vue";
import { useAuthStore } from "~/stores/auth";
import { useThemeStore } from "~/stores/theme";

definePageMeta({ middleware: ["auth"] });
const { userInfo } = useAuthStore();
const themeStore = useThemeStore();

const isDark = computed(() => themeStore.isDark);

const imgLoaded = ref(false);

function onImgLoad() {
  imgLoaded.value = true;
}

const toggleMode = () => {
  themeStore.toggleTheme();
};
</script>

<style scoped>
.glasses {
  background: linear-gradient(135deg, #cecece41 0%, #4c6e8679 100%);

  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid white;
  border-radius: 12px;
}

.img-wrapper {
  border-radius: 50%;
  background-color: transparent;
  overflow: hidden;
  border: white 2px solid;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.day {
  font-weight: 100;
  font-size: 13px;
}

.username {
  font-size: 20px;
}

.card-wrapper {
  border: 8px red solid;
  background: linear-gradient(to top, red 0%, red 10%, rgb(255, 81, 81) 100%);
  border-radius: 1.5rem;
  padding: 1.1rem;
  width: 100%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.sun-moon-enter-active,
.sun-moon-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.sun-moon-enter-from {
  transform: translateY(30px) rotate(90deg);
  opacity: 0;
}

.sun-moon-leave-to {
  transform: translateY(-30px) rotate(-90deg);
  opacity: 0;
}

.img-wrapper {
  filter: drop-shadow(0 0 8px rgba(216, 119, 8, 0.557));
}

.is-dark {
  background-color: rgba(232, 165, 8, 0.371);
  filter: drop-shadow(0 0 8px rgba(245, 154, 50, 0.978));
  border: 1px solid rgba(255, 255, 255, 0.483);
}

.is-light {
  background-color: rgba(0, 0, 0, 0.765);
  border: 1px solid rgba(245, 154, 50, 0.978);
}
</style>
