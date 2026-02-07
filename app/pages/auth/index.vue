<template>
  <div class="icon-wrapper">
    <ClientOnly>
      <!-- <Lottie width="100%" class="absolute left-0 top-0 z-50" name="online_investment" /> -->
      <NuxtImg src="/icons/ic_auth.svg" class="savings" alt="savings" />
    </ClientOnly>
  </div>
  <div class="flex flex-col gap-4">
    <LoginForm
      v-model:email="userLogin.email"
      v-model:password="userLogin.password"
      :is-loading="isLoading"
      @submit="submitLogin"
      @toggle-mode="isLogin = false"
    />
    <div class="flex items-center gap-2 justify-center text-gray-600">
      <div class="h-[0.1px] w-[20%] bg-gray-600"></div>
      <p class="text-gray-400">Atau</p>
      <div class="h-[0.1px] w-[20%] bg-gray-600"></div>
    </div>

    <div class="px-10">
      <UButton
        block
        label="Mulai Tanpa Login (Local Mode)"
        variant="outline"
        color="neutral"
        icon="i-heroicons-device-phone-mobile"
        class="py-3 rounded-xl font-bold"
        @click="startAsGuest"
      />
      <p class="text-[10px] text-center text-gray-400 mt-2 italic">
        *Data disimpan di HP, fitur Chat & Sync butuh login.
      </p>
    </div>
  </div>
  <ToastModal />
</template>

<script setup lang="ts">
import LoginForm from "~/components/auth/LoginForm.vue";
import ToastModal from "~/components/ui/modals/ToastModal.vue";
import { useAuthStore } from "~/stores/auth";

definePageMeta({
  middleware: ["guest"],
  layout: "auth",
});

const auth = useAuthStore();
const { handleUserLogin, isLoading } = useAuth();
const isLogin = ref(true);

const userLogin = ref({
  email: "",
  password: "",
});

const submitLogin = () => {
  handleUserLogin({
    email: userLogin.value.email,
    password: userLogin.value.password,
  });
};

const startAsGuest = async () => {
  await auth.setGuestMode(true);
  navigateTo("/dashboard");
};
</script>

<style scoped>
.icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.savings {
  width: 100%;
  height: 200px;
}
</style>
