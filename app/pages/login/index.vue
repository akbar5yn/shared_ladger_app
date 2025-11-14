<template>
  <div class="container relative">
    <div class="ambient-background overflow-hidden">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
    <AuthFlipContainer :is-login="isLogin">
      <template #login>
        <LoginForm
          v-model:email="email"
          v-model:password="password"
          :is-loading="isLoading"
          @submit="submitLogin"
          @toggle-mode="isLogin = false"
        />
      </template>

      <template #register>
        <RegisterForm />
      </template>
    </AuthFlipContainer>
  </div>
</template>

<script setup lang="ts">
import AuthFlipContainer from "~/components/auth/AuthFlipContainer.vue";
import LoginForm from "~/components/auth/LoginForm.vue";
import RegisterForm from "~/components/auth/RegisterForm.vue";

definePageMeta({
  middleware: ["guest"], // Hanya bisa diakses oleh tamu
});

const { handleLogin, isLoading } = useAuth();

// State untuk mengontrol form mana yang aktif (default: Login)
const isLogin = ref(true);

const email = ref("");
const password = ref("");

const submitLogin = () => {
  handleLogin({
    email: email.value,
    password: password.value,
  });
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  height: 100dvh;
  width: 100%;
  z-index: 99;
  max-width: 100%;
}
</style>
