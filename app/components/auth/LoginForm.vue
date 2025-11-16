<template>
  <WrapperContainer>
    <div class="h-full flex flex-col gap-5 text-base">
      <section>
        <h1 class="text-xl text-center font-bold">Shared Ledger</h1>
        <p class="text-center text-[12px] mt-2">
          Welcome. This is our private space for financial clarity and
          communication. Sign in to manage our shared economy and maintain
          seamless family connection.
        </p>
      </section>
      <section class="h-fit flex flex-col gap-4 rounded-3xl">
        <form @submit.prevent="emit('submit')" class="flex flex-col gap-2">
          <label for="email" class="text-[13px] font-medium px-[5px]"
            >E-mail</label
          >
          <div class="border-animasi-wrapper w-full">
            <div class="flex items-center gap-1 field-container">
              <UIcon
                name="i-heroicons-envelope"
                class="h-5 w-5 text-gray-500 shrink-0"
              />
              <input
                id="email"
                type="text"
                v-model="formEmail"
                class="w-full text-sm"
                autocomplete="off"
                placeholder="Masukan alamat email anda"
              />
            </div>
          </div>
          <label for="password" class="text-[13px] font-medium px-[5px]"
            >Password</label
          >
          <div class="border-animasi-wrapper w-full">
            <div class="flex items-center gap-1 field-container">
              <UIcon
                name="i-heroicons-lock-closed"
                class="h-5 w-5 text-gray-500 shrink-0"
              />
              <input
                type="password"
                v-model="formPassword"
                id="password"
                class="w-full text-sm"
                autocomplete="off"
                placeholder="Masukan kata sandi anda"
              />
            </div>
          </div>
          <button
            :disabled="isLoading"
            type="submit"
            class="bg-[#17afb0] py-2 mt-4 text-white rounded-[10px] font-bold login-btn"
            :class="{ 'bg-[#067c7c] text-gray-500': isLoading }"
          >
            <span v-if="isLoading" class="loading">Loading</span>
            <span v-else>Sign in</span>
          </button>
        </form>
      </section>
      <div class="flex items-center gap-2 justify-center text-gray-600">
        <div class="h-[0.1px] w-[20%] bg-gray-500"></div>
        <p>Or Log in with</p>
        <div class="h-[0.1px] w-[20%] bg-gray-500"></div>
      </div>
      <div class="flex gap-2 w-full justify-center">
        <div class="google-button-wrapper w-[50%]">
          <button class="google-button-inner w-full py-2">
            <span class="flex items-center justify-center gap-2">
              <span name="i-simple-icons-google" class="google-icon-gradient"
                >G</span
              >
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
      <p class="text-center">
        Don't have an account ?
        <button
          @click.prevent="$emit('toggleMode')"
          class="font-bold text-[#17afb0] cursor-pointer"
        >
          Create an account
        </button>
      </p>

      <p v-if="isVisible">{{ message }}</p>
    </div>
  </WrapperContainer>
</template>

<script setup lang="ts">
import WrapperContainer from "./WrapperContainer.vue";

const { isVisible, message } = useNotifier();

const props = defineProps<{
  email: string;
  password: string;
  isLoading: boolean;
}>();

const emit = defineEmits([
  "update:email",
  "update:password",
  "submit",
  "toggleMode",
]);

const formEmail = computed({
  get: () => props.email,
  set: (value) => emit("update:email", value),
});

const formPassword = computed({
  get: () => props.password,
  set: (value) => emit("update:password", value),
});
</script>
