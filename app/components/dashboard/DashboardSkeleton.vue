<template>
  <div class="flex flex-col gap-5 w-full pb-20">
    <div class="px-[15px] w-full mt-5">
      <div
        class="relative w-full rounded-3xl p-6 pt-10 border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
      >
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-[#fafafa] dark:border-slate-950 bg-slate-200 dark:bg-slate-800 animate-pulse"
        ></div>

        <div
          class="flex justify-between items-center divide-x divide-gray-200 dark:divide-slate-700"
        >
          <div class="flex-1 text-center space-y-2">
            <div
              class="h-3 w-20 bg-slate-100 dark:bg-slate-800 animate-pulse mx-auto rounded"
            ></div>
            <div
              class="h-6 w-28 bg-slate-200 dark:bg-slate-700 animate-pulse mx-auto rounded"
            ></div>
          </div>

          <div class="flex-1 text-center space-y-2">
            <div
              class="h-3 w-20 bg-slate-100 dark:bg-slate-800 animate-pulse mx-auto rounded"
            ></div>
            <div
              class="h-6 w-28 bg-slate-200 dark:bg-slate-700 animate-pulse mx-auto rounded"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="px-[15px] w-full">
      <div
        class="w-full rounded-3xl px-6 py-5 border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-5"
      >
        <div class="flex justify-between items-center">
          <div
            class="h-3 w-28 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"
          ></div>
          <div
            class="h-7 w-[115px] rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse"
          ></div>
        </div>

        <div class="space-y-2">
          <div
            class="h-8 w-48 bg-slate-200 dark:bg-slate-700 animate-pulse rounded-lg"
          ></div>
          <div
            class="h-3 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded"
          ></div>
        </div>

        <div
          class="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden"
        >
          <div class="h-full w-1/2 bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
        </div>

        <div class="space-y-4 pt-2">
          <div v-for="i in 3" :key="i" class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div
                class="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"
              ></div>
              <div
                class="h-3 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded"
              ></div>
            </div>
            <div
              class="h-3 w-20 bg-slate-200 dark:bg-slate-700 animate-pulse rounded"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="rounded-t-[40px] bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 flex flex-col min-h-[400px]"
    >
      <div class="pt-6 pb-3">
        <div
          class="w-16 h-1.5 bg-gray-200 dark:bg-slate-800 rounded-full mx-auto animate-pulse"
        ></div>
        <div class="px-10 pt-6">
          <div
            class="h-7 w-36 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg"
          ></div>
        </div>
      </div>

      <div class="px-6 space-y-6 mt-4">
        <div class="grid grid-cols-4 gap-4 mb-4">
          <div
            v-for="i in 4"
            :key="i"
            class="h-14 bg-slate-50 dark:bg-slate-800/50 rounded-2xl animate-pulse"
          ></div>
        </div>

        <div
          class="h-5 w-44 bg-slate-200 dark:bg-slate-800 animate-pulse rounded mb-4"
        ></div>

        <div
          v-for="i in 2"
          :key="i"
          class="p-4 rounded-3xl border border-gray-50 dark:border-slate-800 space-y-4"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3 flex-1">
              <div
                class="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse"
              ></div>
              <div class="flex-1 space-y-2">
                <div
                  class="h-4 w-40 bg-slate-200 dark:bg-slate-800 animate-pulse rounded"
                ></div>
                <div
                  class="h-2 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded"
                ></div>
              </div>
            </div>
            <div
              class="h-4 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded"
            ></div>
          </div>
          <div class="flex gap-2 pt-2 border-t border-gray-50 dark:border-slate-800">
            <div
              class="h-9 flex-1 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"
            ></div>
            <div
              class="h-9 flex-1 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"
            ></div>
            <div
              class="h-9 w-10 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
