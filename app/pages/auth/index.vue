<template>
  <AuthFlipContainer :is-login="isLogin">
    <template #login>
      <LoginForm
        v-model:email="userLogin.email"
        v-model:password="userLogin.password"
        :is-loading="isLoading"
        @submit="submitLogin"
        @toggle-mode="isLogin = false"
      />
    </template>

    <template #register>
      <RegisterForm
        v-model:name="userRegister.name"
        v-model:email="userRegister.email"
        v-model:password="userRegister.password"
        v-model:confirm-password="userRegister.confirmPassword"
        :is-loading="isLoading"
        @toggle-mode="isLogin = true"
      />
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

const userLogin = ref({
  email: "",
  password: "",
});

const userRegister = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const submitLogin = () => {
  handleLogin({
    email: userLogin.value.email,
    password: userLogin.value.password,
  });
};
</script>
