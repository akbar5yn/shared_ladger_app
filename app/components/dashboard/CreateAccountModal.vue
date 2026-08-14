<template>
    <UModal
v-model:open="isOpen" :ui="{
        content: 'w-[92vw] sm:max-w-md mx-auto rounded-[28px] overflow-hidden',
    }">
        <template #content>
            <UCard
:ui="{
                root: `border-none shadow-2xl ${ui.isDark ? 'bg-slate-900' : 'bg-white'}`,
                header: `px-6 py-5 border-b ${ui.isDark
                    ? 'bg-slate-800/40 border-slate-800'
                    : 'bg-gray-50 border-gray-100'
                    }`,
                body: 'p-5',
                footer: `px-6 py-4 border-none ${ui.isDark ? 'bg-slate-800/40' : 'bg-gray-50'
                    }`,
            }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500/10 text-amber-500">
                                <UIcon name="i-heroicons-credit-card" class="text-xl" />
                            </div>
                            <div>
                                <h3 class="font-bold" :class="ui.isDark ? 'text-white' : 'text-slate-900'">
                                    Buat Akun Dompet
                                </h3>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                    Pilih bank / dompet digital
                                </p>
                            </div>
                        </div>
                        <UButton
color="neutral" variant="ghost" icon="i-heroicons-x-mark"
                            class="rounded-full bg-gray-200/50 dark:bg-slate-800" @click="accountManager.close()" />
                    </div>
                </template>

                <div class="flex flex-col gap-3">
                    <p class="text-xs text-gray-500 dark:text-slate-400">
                        Pilih dompet yang ingin kamu hubungkan. Akun yang sudah dibuat akan otomatis
                        menangkap notifikasi transaksi dari aplikasi terkait.
                    </p>

                    <button
v-for="bank in accountManager.SUPPORTED_BANKS" :key="bank.name" type="button"
                        class="w-full flex items-center justify-between gap-3 p-4 rounded-2xl border transition active:scale-[0.98]"
                        :class="[
                            accountManager.isCreated(bank.name)
                                ? (ui.isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-gray-200')
                                : 'border-amber-300 dark:border-amber-500/40 hover:border-amber-400 bg-amber-50/40 dark:bg-amber-500/5'
                        ]" :disabled="accountManager.isCreated(bank.name)"
                        @click="accountManager.createOne(bank.name)">
                        <span class="flex items-center gap-3">
                            <UIcon
:name="bank.icon" class="text-xl"
                                :class="ui.isDark ? 'text-white' : 'text-slate-800'" />
                            <span class="font-bold" :class="ui.isDark ? 'text-white' : 'text-slate-900'">{{ bank.label
                            }}</span>
                        </span>

                        <span
v-if="accountManager.isCreated(bank.name)"
                            class="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                            <UIcon name="i-heroicons-check-circle" class="text-base" /> Aktif
                        </span>
                        <UButton
v-else size="xs" color="warning" label="Buat" :loading="isCreating"
                            class="rounded-xl font-bold" @click.stop="accountManager.createOne(bank.name)" />
                    </button>

                    <div
                        class="mt-1 pt-3 border-t border-dashed border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Akun Lainnya (Dana, Gopay, dll)
                        </p>
                        <div class="flex items-center gap-2">
                            <UInput
v-model="customName" placeholder="Misal: Dana, Gopay, OVO"
                                icon="i-heroicons-pencil-square" :ui="{
                                    base: `h-10 rounded-xl text-md border border-gray-800 focus:border-gray-500 ring-0 focus:ring-0 transition-all focus-visible:ring-0 ${ui.isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
                                        }`,
                                }" class="flex-1" @keyup.enter="createCustom" />
                            <UButton
color="warning" label="Buat" :loading="isCreating" :disabled="!customName.trim()"
                                class="rounded-xl font-bold h-10 px-4" @click="createCustom" />
                        </div>
                        <p class="text-[10px] text-slate-400 leading-relaxed">
                            Catatan: akun ini bisa dibuat untuk tracking saldo manual. Auto-ingest notifikasi
                            hanya berjalan untuk Telegram, Aladin, BCA, dan BNI.
                        </p>
                    </div>
                </div>

                <template #footer>
                    <div class="flex items-center justify-between gap-3">
                        <p class="text-[10px] text-gray-400">
                            {{ bankStore.accounts.length }} akun aktif
                        </p>
                        <UButton
color="neutral" variant="ghost" label="Selesai"
                            :class="ui.isDark ? 'text-slate-300' : 'text-slate-600'" @click="accountManager.close()" />
                    </div>
                </template>
            </UCard>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUIStore } from '~/stores/ui'
import { useBankStore } from '~/stores/banks'
import { useAccountManager } from '~/composables/useAccountManager'

const ui = useUIStore()
const bankStore = useBankStore()
const accountManager = useAccountManager()
// Destructuring di top-level supaya ref (isOpen/isCreating) auto-unwrap di template
const { isOpen, isCreating } = accountManager

const customName = ref('')

const createCustom = async () => {
    const name = customName.value.trim()
    if (!name) return
    await accountManager.createOne(name)
    customName.value = ''
}
</script>
