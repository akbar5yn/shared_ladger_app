<template>
  <div class="card-wrapper">
    <div
      class="card-container relative w-full rounded-3xl bg-white p-6 pt-10 shadow-sm border border-gray-100"
    >
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black w-12 h-12 rounded-full flex items-center justify-center border-4 border-[#F2F2F2]"
      >
        <UIcon name="i-heroicons-banknotes" class="text-white text-xl" />
      </div>

      <div class="flex justify-between items-center divide-x divide-gray-200">
        <div class="flex-1 text-center">
          <p class="text-xs text-gray-500 mb-1">Current Balance</p>
          <p class="text-xl font-bold text-slate-900">Rp 500.000</p>
        </div>
        <div class="flex-1 text-center">
          <p class="text-xs text-gray-500 mb-1">Total Expenses</p>
          <p class="text-xl font-bold text-slate-900">Rp 50.00</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>

<script lang="scss" scoped></script>

<style lang="scss" scoped>
.card-wrapper {
  padding: 15px;
}
</style>
