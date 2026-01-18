<template>
  <div class="flex flex-col gap-10 text-base mt-10">
    <section class="text-black">
      <h1 class="text-[30px] text-center font-bold">Shared Ledger</h1>
      <p class="text-center text-[13px] mt-2 text-gray-500">
        Welcome. This is our private space for financial clarity and communication. Sign
        in to manage our shared economy and maintain seamless family connection.
      </p>
    </section>
    <section class="h-fit flex flex-col">
      <form @submit.prevent="emit('submit')" class="flex flex-col gap-2 text-black">
        <label for="email" class="text-[13px] font-medium px-[5px]">E-mail</label>
        <div class="border-animasi-wrapper w-full">
          <div class="flex items-center gap-1 field-container">
            <UIcon name="i-heroicons-envelope" class="h-5 w-5 text-gray-500 shrink-0" />
            <input id="email" type="text" v-model="formEmail" class="w-full text-sm" autocomplete="off"
              placeholder="Masukan alamat email anda" />
          </div>
        </div>
        <label for="password" class="text-[13px] font-medium px-[5px] mt-2">Password</label>
        <div class="border-animasi-wrapper w-full">
          <div class="flex items-center gap-1 field-container">
            <UIcon name="i-heroicons-lock-closed" class="h-5 w-5 text-gray-500 shrink-0" />
            <input type="password" v-model="formPassword" id="password" class="w-full text-sm" autocomplete="off"
              placeholder="Masukan kata sandi anda" />
          </div>
        </div>
        <button :disabled="isLoading" type="submit"
          class="bg-[#f9ab26] py-2 mt-4 text-black rounded-[10px] font-bold login-btn border border-black transition-all duration-300"
          :class="{ 'bg-[#f9ac267a] text-gray-500': isLoading }">
          <span v-if="isLoading" class="loading">Loading</span>
          <span v-else>Sign in</span>
        </button>
      </form>
    </section>
    <div class="flex items-center gap-2 justify-center text-gray-600">
      <div class="h-[0.1px] w-[20%] bg-gray-600"></div>
      <p class="text-gray-400">Or Log in with</p>
      <div class="h-[0.1px] w-[20%] bg-gray-600"></div>
    </div>
    <div class="flex gap-2 w-full justify-center">
      <div class="google-button-wrapper w-[50%]">
        <button class="google-button-inner w-full py-2">
          <span class="flex items-center justify-center gap-2">
            <span name="i-simple-icons-google" class="google-icon-gradient">G</span>
            <span class="font-medium text-gray-700">Sign in Google</span>
          </span>
        </button>
      </div>
      <div class="google-button-wrapper w-[50%]">
        <button class="google-button-inner w-full py-2 gap-1">
          <UIcon name="i-simple-icons-apple" class="h-4 w-4 mb-1" />
          <span> Sign in Apple </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  email: string;
  password: string;
  isLoading: boolean;
}>();

const emit = defineEmits(["update:email", "update:password", "submit", "toggleMode"]);

const formEmail = computed({
  get: () => props.email,
  set: (value) => emit("update:email", value),
});

const formPassword = computed({
  get: () => props.password,
  set: (value) => emit("update:password", value),
});
</script>
