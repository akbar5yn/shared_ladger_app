<template>
  <div class="flex flex-col gap-5 w-full pb-20">
    <!-- SKELETON BALANCE CARD (mirror layout BalanceCard.vue) -->
    <div class="px-[15px] w-full mt-5">
      <div
class="relative w-full rounded-3xl p-6 border overflow-hidden" :class="ui.isDark
          ? 'bg-slate-900 border-slate-800'
          : 'bg-white border-gray-100 shadow-sm'
        ">
        <div
          class="absolute -top-16 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20 animate-pulse pointer-events-none"
          :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-200'" />

        <div class="flex justify-between items-start">
          <div class="space-y-2">
            <div class="h-3 w-36 animate-pulse rounded" :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-100'" />
            <div class="h-7 w-40 animate-pulse rounded" :class="ui.isDark ? 'bg-slate-700' : 'bg-slate-200'" />
            <div
class="h-3 w-24 animate-pulse rounded tracking-[0.25em]"
              :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-100'" />
          </div>

          <div class="flex flex-col items-end gap-2">
            <div class="h-3 w-20 animate-pulse rounded" :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-100'" />
            <div class="h-10 w-14 rounded animate-pulse" :class="ui.isDark ? 'bg-slate-700' : 'bg-slate-200'" />
          </div>
        </div>

        <div
class="mt-5 rounded-2xl p-3 flex items-center justify-between"
          :class="ui.isDark ? 'bg-slate-800/70' : 'bg-slate-50'">
          <div class="space-y-2 w-full">
            <div class="h-2.5 w-24 animate-pulse rounded" :class="ui.isDark ? 'bg-slate-700' : 'bg-slate-200'" />
            <div class="h-3 w-3/4 animate-pulse rounded" :class="ui.isDark ? 'bg-slate-700' : 'bg-slate-200'" />
          </div>
          <div class="h-5 w-5 rounded animate-pulse shrink-0" :class="ui.isDark ? 'bg-slate-700' : 'bg-slate-200'" />
        </div>
      </div>
    </div>

    <div class="px-[15px] w-full">
      <div
class="w-full rounded-3xl px-6 py-5 border flex flex-col gap-5"
        :class="ui.isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'">
        <div class="flex justify-between items-center">
          <div class="h-3 w-28 animate-pulse rounded" :class="ui.isDark ? 'bg-slate-700' : 'bg-slate-200'"/>
          <div class="h-7 w-[115px] rounded-full animate-pulse" :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-100'"/>
        </div>

        <div class="space-y-2">
          <div class="h-8 w-48 animate-pulse rounded-lg" :class="ui.isDark ? 'bg-slate-700' : 'bg-slate-200'"/>
          <div class="h-3 w-24 animate-pulse rounded" :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-100'"/>
        </div>

        <div class="h-3 w-full rounded-full overflow-hidden" :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-100'">
          <div class="h-full w-1/2 animate-pulse" :class="ui.isDark ? 'bg-slate-700' : 'bg-slate-200'"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUIStore } from "~/stores/ui";

const ui = useUIStore();
</script>
