<template>
  <div class="card-wrapper" @touchstart="onTouchStart" @touchend="onTouchEnd">

    <Transition :name="transitionName" mode="out-in">
      <!-- ADD ACCOUNT CARD (slide terakhir setelah swipe ke kiri) -->
      <div
v-if="bankStore.atAddCard" :key="'add-account-card'"
        class="relative w-full rounded-3xl p-6 border border-dashed overflow-hidden flex flex-col items-center justify-center gap-3 text-center cursor-pointer active:scale-[0.98] transition-all duration-500"
        :class="ui.isDark
          ? 'bg-slate-900 border-slate-700'
          : 'bg-white border-gray-200'" @click="accountManager.open()">

        <UIcon name="i-heroicons-plus-circle" class="text-4xl text-amber-500" />
        <p class="font-bold" :class="ui.isDark ? 'text-white' : 'text-slate-900'">Tambah Akun Dompet</p>
        <p class="text-[11px] text-slate-400">Tap untuk buat akun bank / dompet lainnya</p>
        <span class="text-[10px] text-slate-400 mt-1">Geser ke kanan untuk kembali</span>
      </div>

      <!-- ACCOUNT CARD -->
      <div
v-else-if="bankStore.accounts.length > 0" :key="bankStore.currentAccount?.id"
        class="relative w-full rounded-3xl p-6 border overflow-hidden transition-all duration-500" :class="ui.isDark
          ? 'bg-slate-900 border-slate-800'
          : 'bg-white border-gray-100'">

        <div
class="absolute -top-16 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
          :style="{ background: bankStore.currentBankTheme.glowColor }" />

        <div class="flex justify-between items-start">
          <div>
            <p
class="text-sm mb-1 transition-colors duration-700"
              :class="ui.isDark ? 'text-slate-400' : 'text-gray-500'">
              Current Balance ({{ bankStore.currentAccount?.name }})
            </p>

            <h1 class="text-2xl font-bold tracking-tight" :class="ui.isDark ? 'text-white' : 'text-slate-900'">
              {{ transactionStore.formatIDR(bankStore.currentAccount?.balance) }}
            </h1>

            <p class="tracking-[0.25em] text-[11px] mt-2 text-slate-400">
              •••• •••• 2201
            </p>
          </div>

          <div class="flex flex-col items-end">
            <p class="text-sm text-gray-400">Bank Account</p>

            <img
v-if="bankStore.currentBankTheme.isImage" :src="bankStore.currentBankTheme.logo"
              class="object-contain mt-1" :class="bankStore.currentBankTheme.imSize">
            <UIcon
v-else :name="bankStore.currentBankTheme.logo" class="text-3xl mt-1"
              :class="ui.isDark ? 'text-slate-300' : 'text-slate-500'" />

            <span class="text-[10px] text-gray-400 mt-2">
              Swipe ← →
            </span>
          </div>
        </div>

        <div
class="mt-5 rounded-2xl p-3 flex items-center justify-between transition-all duration-700" :class="ui.isDark
          ? 'bg-slate-800/70'
          : 'bg-slate-50'
          ">
          <div>
            <p class="text-[10px] uppercase tracking-wider text-slate-400">
              AI Finance Status
            </p>

            <p class="text-xs font-medium mt-1 leading-relaxed" :class="ui.isDark ? 'text-white' : 'text-slate-800'">
              {{ transactionStore.advisorData?.prediction ?? 'Belum ada analisis untuk dompet ini.' }}
            </p>
          </div>

          <UIcon name="i-heroicons-sparkles" class="text-2xl text-amber-400" />
        </div>
      </div>

      <!-- EMPTY STATE (belum ada akun sama sekali) -->
      <div
v-else :key="'empty-state'"
        class="w-full rounded-3xl p-8 border border-dashed border-slate-300 dark:border-slate-700 text-center flex flex-col items-center gap-3">
        <UIcon name="i-heroicons-credit-card" class="text-4xl text-slate-400 dark:text-slate-500" />
        <p class="text-sm text-slate-500 dark:text-slate-400">Kamu belum mengonfigurasi dompet digital atau akun bank.
        </p>
        <button
class="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs active:scale-95 transition"
          @click="accountManager.open()">
          + Buat Akun Dompet
        </button>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUIStore } from '~/stores/ui'
import { useTransactionStore } from '~/stores/useTransactionStore'
import { useBankStore } from '~/stores/banks' // 👈 Import bank store pilihanmu
import { useAccountManager } from '~/composables/useAccountManager'

const ui = useUIStore()
const transactionStore = useTransactionStore()
const bankStore = useBankStore() // 👈 Inisialisasi store
const accountManager = useAccountManager()

const transitionName = ref('bank-swipe-right')

/* SWIPE LOGIC USING PINIA ACTIONS */
let startX: number = 0

function onTouchStart(e: TouchEvent) {
  startX = e.touches?.[0]?.clientX ?? 0
}

function onTouchEnd(e: TouchEvent) {
  const endX = e.changedTouches[0]?.clientX ?? 0
  const diff = endX - startX

  if (Math.abs(diff) < 40) return

  if (bankStore.atAddCard) {
    // Sudah di slide "Tambah Akun": geser kanan kembali ke akun terakhir.
    if (diff > 0) {
      bankStore.setAddCard(false)
      transitionName.value = 'bank-swipe-left'
    }
    return
  }

  if (bankStore.accounts.length === 0) return

  if (diff < 0) {
    // Geser ke kiri → nextBank sekarang bound di ujung kanan (tidak wrap).
    const direct = bankStore.nextBank()
    if (direct === 'none') {
      // sudah di akun terakhir → buka slide "Tambah Akun"
      bankStore.setAddCard(true)
      transitionName.value = 'bank-swipe-right'
    } else {
      transitionName.value = 'bank-swipe-right'
    }
  } else {
    // Geser ke kanan → prevBank bound di index 0 (tidak wrap).
    const direct = bankStore.prevBank()
    if (direct !== 'none') transitionName.value = 'bank-swipe-left'
  }
}
</script>

<style scoped lang="scss">
.card-wrapper {
  padding: 0 15px;
}

/* Animasi Perpindahan Kartu Swipe */
.bank-swipe-right-enter-active,
.bank-swipe-right-leave-active,
.bank-swipe-left-enter-active,
.bank-swipe-left-leave-active {
  transition: all 0.3s ease-out;
}

.bank-swipe-right-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.bank-swipe-right-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

.bank-swipe-left-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}

.bank-swipe-left-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>