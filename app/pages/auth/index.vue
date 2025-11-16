<template>
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
</template>

<script setup lang="ts">
import AuthFlipContainer from "~/components/auth/AuthFlipContainer.vue";
import LoginForm from "~/components/auth/LoginForm.vue";
import RegisterForm from "~/components/auth/RegisterForm.vue";

definePageMeta({
  middleware: ["guest"],
  layout: "auth",
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
