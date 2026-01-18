<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-15"
      >
        <div
          class="absolute inset-0 bg-black/75 transition-opacity"
          @click="closeModal"
        ></div>

        <Transition name="pop" appear>
          <div
            v-if="modelValue"
            class="relative w-full max-w-sm overflow-hidden rounded-[28px] border shadow-2xl transition-all"
            :class="
              isDark
                ? 'bg-slate-900 border-slate-800 text-white'
                : 'bg-white border-gray-100 text-slate-900'
            "
          >
            <div class="relative z-10">
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const modelValue = defineModel<boolean>();
defineProps<{
  isDark: boolean;
}>();

const closeModal = () => {
  modelValue.value = false;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-leave-active {
  transition: all 0.2s ease-in;
}

.pop-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(30px);
}
.pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
