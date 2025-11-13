<template>
  <h1>Dashboard</h1>
  <p v-if="isVisible">{{ message }}</p>
  <p>{{ userInfo?.name }}</p>
</template>

<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });
const { userInfo } = useAuthStore();
const { message, isVisible } = useNotifier();
</script>
