<template>
  <div>
    <div class="icon-wrapper">
      <ClientOnly>
        <!-- <Lottie width="100%" class="absolute left-0 top-0 z-50" name="online_investment" /> -->
        <NuxtImg src="/icons/ic_auth.svg" class="savings" alt="savings" />
      </ClientOnly>
    </div>
    <div class="flex flex-col gap-4">
      <LoginForm
v-model:email="userLogin.email" v-model:password="userLogin.password" :is-loading="isLoading"
        @submit="submitLogin" />
    </div>
    <ToastModal />
  </div>
</template>

<script setup lang="ts">
import LoginForm from "~/components/auth/LoginForm.vue";
import ToastModal from "~/components/ui/modals/ToastModal.vue";

definePageMeta({
  middleware: ["guest"],
  layout: "auth",
});

const { handleUserLogin, isLoading } = useAuth();

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
