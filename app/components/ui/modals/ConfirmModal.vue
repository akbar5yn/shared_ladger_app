<template>
    <BaseModal v-model="ui.isConfirmModalOpen" :is-dark="ui.isDark">
        <div class="flex flex-col items-center text-center p-8">

            <div
class="mb-5 flex h-16 w-16 items-center justify-center rounded-full transition-colors"
                :class="config.variant === 'danger' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'">
                <UIcon :name="config.icon" class="text-3xl" />
            </div>

            <h3 class="mb-2 text-xl font-bold">{{ config.title }}</h3>
            <p class="mb-8 text-sm opacity-70 leading-relaxed">
                {{ config.description }}
            </p>

            <div class="flex w-full flex-col gap-3">
                <button
class="w-full rounded-2xl py-3 font-bold text-black border-black border transition-all active:scale-95 shadow-lg"
                    :class="config.variant === 'danger'
                        ? 'bg-rose-500 text-white border-rose-600 shadow-rose-500/20'
                        : 'bg-amber-500 text-black border-amber-600 shadow-amber-500/30'"
                    @click="handleAction">
                    {{ config.confirmText }}
                </button>

                <button
class="w-full rounded-2xl py-3 font-semibold transition-all active:scale-95 opacity-60"
                    @click="ui.isConfirmModalOpen = false">
                    {{ config.cancelText }}
                </button>
            </div>
        </div>
    </BaseModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useUIStore } from "~/stores/ui";
import BaseModal from "./BaseModal.vue";

const ui = useUIStore();

const config = computed(() => ui.confirmModalConfig);

const handleAction = () => {
    if (config.value.onConfirm) {
        config.value.onConfirm();
    }
    ui.isConfirmModalOpen = false;
};
</script>