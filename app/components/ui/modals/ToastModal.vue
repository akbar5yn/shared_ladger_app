<template>
    <div
        class="fixed top-0 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[500px] z-50 pointer-events-none fixed-safe-top">

        <transition enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="-translate-x-10 opacity-0" enter-to-class="translate-x-0 opacity-100"
            leave-active-class="transition-all duration-300 ease-in" leave-from-class="translate-x-0 opacity-100"
            leave-to-class="-translate-x-10 opacity-0">

            <div v-if="isVisible" class="px-4 py-3 rounded-lg shadow-lg text-white font-medium pointer-events-auto"
                :class="[{
                    'bg-error': type === 'error',
                    'bg-success': type === 'success',
                    'bg-sky-500': type === 'info'
                }]">
                {{ message }}
            </div>
        </transition>

    </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '~/stores/notification'
import { computed } from 'vue'

const store = useNotificationStore()

const isVisible = computed(() => store.isVisible)
const message = computed(() => store.message)
const type = computed(() => store.type)
</script>


<style scoped>
.bg-error {
    background-color: red;
}

.bg-success {
    background-color: #17AFB0;
}
</style>