<template>
  <header class="dashboard-header">
    <div class="profile-wrapper flex items-center gap-5">
      <ClientOnly>
        <div class="img-wrapper relative w-14 h-14">
          <NuxtImg
src="/icons/user.png" alt="user_avatar" width="50" height="50"
            :class="imgLoaded ? 'opacity-100' : 'opacity-0'" @load="onImgLoad" />
        </div>
      </ClientOnly>
      <div class="flex flex-col gap-0 justify-center">
        <span class="day text-slate-900" :class="[{ 'font-light': isDark }]">{{ greeting }}</span>
        <span class="username text-slate-900" :class="[{ 'font-light': isDark }]" @click="onProfileTap">{{
          userInfo?.name ?? "Guest Mode"
          }}</span>
      </div>
    </div>
    <div class="toggle-btn-wrapper">
      <button
:class="[{ 'btn-is-dark': isDark, 'btn-is-light': !isDark }]"
        class="relative w-10 h-10 flex items-center justify-center rounded-xl backdrop-blur-md border overflow-hidden transition-all duration-300 active:scale-90"
        @click="toggleMode">
        <transition name="sun-moon">
          <div v-if="isDark" key="moon" class="absolute">
            <svg
xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="text-yellow-400">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          </div>
          <div v-else key="sun" class="absolute">
            <svg
xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="text-orange-300">
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
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import { useUIStore } from "~/stores/ui";

const { userInfo } = useAuthStore();
const themeStore = useUIStore();
const router = useRouter();
const imgLoaded = ref(false);

// SECTION Computed
const isDark = computed(() => themeStore.isDark);

function onImgLoad() {
  imgLoaded.value = true;
}

const toggleMode = () => {
  themeStore.toggleTheme();
};

// Debug: tap nama profile 3x untuk buka halaman API log
let profileTapCount = 0;
let profileTapTimer: ReturnType<typeof setTimeout> | null = null;
const onProfileTap = () => {
  profileTapCount++;
  if (profileTapTimer) clearTimeout(profileTapTimer);
  profileTapTimer = setTimeout(() => {
    profileTapCount = 0;
  }, 800);
  if (profileTapCount >= 3) {
    profileTapCount = 0;
    router.push("/debug-log");
  }
};

const greeting = computed(() => {
  const hour = new Date().getHours()

  if (hour >= 4 && hour < 11) {
    return 'Good Morning,'
  }

  if (hour >= 11 && hour < 15) {
    return 'Good Afternoon,'
  }

  if (hour >= 15 && hour < 18) {
    return 'Good Evening,'
  }

  return 'Good Night,'
})
</script>

<style scoped lang="scss">
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;

  .img-wrapper {
    border-radius: 50%;
    background-color: transparent;
    overflow: hidden;
    border: white 2px solid;
    filter: drop-shadow(0 0 8px rgba(216, 119, 8, 0.557));
  }

  .day {
    font-weight: 100;
    font-size: 13px;
  }

  .username {
    font-size: 20px;
  }
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
</style>
