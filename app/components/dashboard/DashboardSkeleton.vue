<template>
  <div class="flex flex-col gap-5 w-full pb-20">
    <div class="px-[15px] w-full mt-5">
      <div
        class="relative w-full rounded-3xl p-6 pt-10 border transition-colors duration-700"
        :class="
          ui.isDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-gray-100 shadow-sm'
        "
      >
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 animate-pulse"
          :class="
            ui.isDark ? 'bg-slate-800 border-slate-950' : 'bg-slate-200 border-[#fafafa]'
          "
        ></div>

        <div
          class="flex justify-between items-center divide-x"
          :class="ui.isDark ? 'divide-slate-700' : 'divide-gray-200'"
        >
          <div v-for="i in 2" :key="i" class="flex-1 text-center space-y-2">
            <div
              class="h-3 w-20 animate-pulse mx-auto rounded"
              :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-100'"
            ></div>
            <div
              class="h-6 w-28 animate-pulse mx-auto rounded"
              :class="ui.isDark ? 'bg-slate-700' : 'bg-slate-200'"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="px-[15px] w-full">
      <div
        class="w-full rounded-3xl px-6 py-5 border flex flex-col gap-5"
        :class="ui.isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'"
      >
        <div class="flex justify-between items-center">
          <div
            class="h-3 w-28 animate-pulse rounded"
            :class="ui.isDark ? 'bg-slate-700' : 'bg-slate-200'"
          ></div>
          <div
            class="h-7 w-[115px] rounded-full animate-pulse"
            :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-100'"
          ></div>
        </div>

        <div class="space-y-2">
          <div
            class="h-8 w-48 animate-pulse rounded-lg"
            :class="ui.isDark ? 'bg-slate-700' : 'bg-slate-200'"
          ></div>
          <div
            class="h-3 w-24 animate-pulse rounded"
            :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-100'"
          ></div>
        </div>

        <div
          class="h-3 w-full rounded-full overflow-hidden"
          :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-100'"
        >
          <div
            class="h-full w-1/2 animate-pulse"
            :class="ui.isDark ? 'bg-slate-700' : 'bg-slate-200'"
          ></div>
        </div>
      </div>
    </div>

    <div
      class="rounded-t-[40px] border-t flex flex-col min-h-[400px]"
      :class="ui.isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'"
    >
      <div class="pt-6 pb-3">
        <div
          class="w-16 h-1.5 rounded-full mx-auto animate-pulse"
          :class="ui.isDark ? 'bg-slate-800' : 'bg-gray-200'"
        ></div>
        <div class="px-10 pt-6">
          <div
            class="h-7 w-36 animate-pulse rounded-lg"
            :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-200'"
          ></div>
        </div>
      </div>

      <div class="px-6 space-y-6 mt-4">
        <div class="grid grid-cols-4 gap-4 mb-4">
          <div
            v-for="i in 4"
            :key="i"
            class="h-14 rounded-2xl animate-pulse"
            :class="ui.isDark ? 'bg-slate-800/50' : 'bg-slate-50'"
          ></div>
        </div>

        <div
          v-for="i in 2"
          :key="i"
          class="p-4 rounded-3xl border space-y-4"
          :class="ui.isDark ? 'border-slate-800' : 'border-gray-50'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1">
              <div
                class="w-10 h-10 rounded-xl animate-pulse"
                :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-200'"
              ></div>
              <div class="flex-1 space-y-2">
                <div
                  class="h-4 w-40 animate-pulse rounded"
                  :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-200'"
                ></div>
                <div
                  class="h-2 w-24 animate-pulse rounded"
                  :class="ui.isDark ? 'bg-slate-800' : 'bg-slate-100'"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUIStore } from "~/stores/ui";

const ui = useUIStore();
</script>
