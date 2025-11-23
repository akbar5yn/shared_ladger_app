<template>
  <div class="icon-wrapper">
    <ClientOnly>
      <Lottie
        width="100%"
        class="absolute left-0 top-0 z-50"
        name="online_investment"
      />
    </ClientOnly>
    <div class="shadow-icon"></div>
  </div>
  <div class="orb" />
  <LoginForm
    v-model:email="userLogin.email"
    v-model:password="userLogin.password"
    :is-loading="isLoading"
    @submit="submitLogin"
    @toggle-mode="isLogin = false"
  />
</template>

<script setup lang="ts">
import LoginForm from "~/components/auth/LoginForm.vue";

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

const submitLogin = () => {
  handleLogin({
    email: userLogin.value.email,
    password: userLogin.value.password,
  });
};
</script>

<style scoped>
.icon-wrapper {
  position: relative;
  height: 25%;
  width: 100%;
}

.shadow-icon {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
  width: 70%;
  height: 18px;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.808) 0%,
    rgba(255, 255, 255, 0.37) 40%,
    rgba(255, 255, 255, 0.13) 80%,
    rgba(255, 255, 255, 0.856) 100%
  );
  filter: blur(6px);
  border-radius: 50%;
  animation: dimLight 4.8s linear infinite;
}

@keyframes dimLight {
  0% {
    opacity: 0.5;
  }
  25% {
    opacity: 0.75;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 0.75;
  }
  100% {
    opacity: 0.5;
  }
}
</style>
