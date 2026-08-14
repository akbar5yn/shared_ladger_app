<template>
    <div
class="fixed top-0 left-0 w-full z-[999] pointer-events-none"
        :style="{ paddingTop: 'env(safe-area-inset-top, 0px)' }">
        <transition
enter-active-class="transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
            enter-from-class="-translate-y-full opacity-0" enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition-all duration-300 ease-in" leave-from-class="translate-y-0 opacity-100"
            leave-to-class="-translate-y-full opacity-0">
            <div
v-if="isVisible"
                class="w-full px-6 py-7 font-bold pointer-events-auto flex items-center justify-center gap-3 shadow-[0_12px_40px_rgba(0,0,0,0.25)] border-b backdrop-blur-2xl transition-all duration-500 text-center"
                :class="[
                    ui.isDark
                        ? {
                            'bg-rose-950/90 border-rose-500/20 text-rose-300': type === 'error',
                            'bg-emerald-950/90 border-emerald-500/20 text-emerald-300': type === 'success',
                            'bg-slate-900/30 border-slate-700/40 text-slate-200': type === 'info'
                        }
                        : {
                            'bg-rose-50/40 border-rose-200/50 text-rose-800': type === 'error',
                            'bg-emerald-50/40 border-emerald-200/50 text-emerald-800': type === 'success',
                            'bg-white/40 border-slate-200/60 text-slate-800': type === 'info'
                        }
                ]">

                <UIcon :name="iconName" class="text-xl shrink-0" />

                <span class="text-sm tracking-wide">{{ message }}</span>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '~/stores/notification'
import { computed } from 'vue'
import { useUIStore } from '~/stores/ui'

const ui = useUIStore()
const store = useNotificationStore()
const isVisible = computed(() => store.isVisible)
const message = computed(() => store.message)
const type = computed(() => store.type)

const iconName = computed(() => {

    const currentType = String(store.type).toLowerCase().trim()

    if (currentType === 'success') {
        return 'i-heroicons-check-circle'
    }
    if (currentType === 'error' || currentType === 'danger' || currentType === 'failed') {
        return 'i-heroicons-x-circle'
    }

    return 'i-heroicons-information-circle'
})
</script>


<style scoped>
.bg-error {
    background-color: red;
}

.bg-success {
    background-color: #17AFB0;
}
</style>