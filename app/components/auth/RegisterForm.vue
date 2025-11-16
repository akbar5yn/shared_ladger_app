<template>
  <WrapperContainer>
    <div class="h-full flex flex-col gap-5 text-base">
      <section>
        <h1 class="text-xl text-center font-bold">Shared Ledger</h1>
        <p class="text-center text-[12px] mt-2">
          Join us! Create your account to begin managing shared finances and
          foster financial clarity within the family.
        </p>
      </section>

      <section class="h-full flex flex-col gap-4 rounded-3xl">
        <form @submit.prevent="emit('submit')" class="flex flex-col gap-2">
          <label for="name" class="text-[13px] font-medium px-[5px]"
            >Full Name</label
          >
          <div class="border-animasi-wrapper w-full">
            <div class="flex items-center gap-1 field-container">
              <UIcon
                name="i-heroicons-user"
                class="h-5 w-5 text-gray-500 shrink-0"
              />
              <input
                id="name"
                type="text"
                v-model="formName"
                class="w-full text-sm"
                autocomplete="name"
                placeholder="Masukkan nama lengkap anda"
              />
            </div>
          </div>

          <label for="email-reg" class="text-[13px] font-medium px-[5px]"
            >E-mail</label
          >
          <div class="border-animasi-wrapper w-full">
            <div class="flex items-center gap-1 field-container">
              <UIcon
                name="i-heroicons-envelope"
                class="h-5 w-5 text-gray-500 shrink-0"
              />
              <input
                id="email-reg"
                type="email"
                v-model="formEmail"
                class="w-full text-sm"
                autocomplete="email"
                placeholder="Masukan alamat email anda"
              />
            </div>
          </div>

          <label for="password-reg" class="text-[13px] font-medium px-[5px]"
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
                id="password-reg"
                class="w-full text-sm"
                autocomplete="new-password"
                placeholder="Buat kata sandi"
              />
            </div>
          </div>

          <label
            for="confirm-password-reg"
            class="text-[13px] font-medium px-[5px]"
            >Confirm Password</label
          >
          <div class="border-animasi-wrapper w-full">
            <div class="flex items-center gap-1 field-container">
              <UIcon
                name="i-heroicons-shield-check"
                class="h-5 w-5 text-gray-500 shrink-0"
              />
              <input
                type="password"
                v-model="formConfirmPassword"
                id="confirm-password-reg"
                class="w-full text-sm"
                autocomplete="new-password"
                placeholder="Konfirmasi kata sandi"
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
            <span v-else>Register Account</span>
          </button>
        </form>
      </section>

      <div class="flex items-center gap-2 justify-center text-gray-600">
        <div class="h-[0.1px] w-[20%] bg-gray-500"></div>
        <p>Or Sign up with</p>
        <div class="h-[0.1px] w-[20%] bg-gray-500"></div>
      </div>

      <div class="flex gap-2 w-full justify-center">
        <div class="google-button-wrapper w-[50%]">
          <button class="google-button-inner w-full py-2">
            <span class="flex items-center justify-center gap-2">
              <span name="i-simple-icons-google" class="google-icon-gradient"
                >G</span
              >
              <span class="font-medium text-gray-700">Sign up Google</span>
            </span>
          </button>
        </div>
        <div class="google-button-wrapper w-[50%]">
          <button class="google-button-inner w-full py-2 gap-1">
            <UIcon name="i-simple-icons-apple" class="h-4 w-4 mb-1" />
            <span> Sign up Apple </span>
          </button>
        </div>
      </div>

      <p class="text-center pb-10">
        Already have an account?
        <button
          @click.prevent="emit('toggleMode')"
          class="font-bold text-[#17afb0] cursor-pointer"
        >
          Sign in here
        </button>
      </p>

      <p v-if="isVisible">{{ message }}</p>
    </div>
  </WrapperContainer>
</template>

<script setup lang="ts">
import WrapperContainer from "./WrapperContainer.vue";

const { isVisible, message } = useNotifier();

// --- PROPS FOR REGISTRATION ---
const props = defineProps<{
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
}>();

// --- EMITS ---
const emit = defineEmits([
  "update:name",
  "update:email",
  "update:password",
  "update:confirmPassword",
  "submit",
  "toggleMode", // To switch back to Login mode
]);

// --- COMPUTED PROPERTIES FOR v-model BINDING ---
// Catatan: Gunakan formName, formEmail, dll. untuk binding ke template
const formName = computed({
  get: () => props.name,
  set: (value) => emit("update:name", value),
});

const formEmail = computed({
  get: () => props.email,
  set: (value) => emit("update:email", value),
});

const formPassword = computed({
  get: () => props.password,
  set: (value) => emit("update:password", value),
});

const formConfirmPassword = computed({
  get: () => props.confirmPassword,
  set: (value) => emit("update:confirmPassword", value),
});
</script>
