<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 p-4 text-xs">
    <div class="flex items-center justify-between mb-3 sticky top-0 bg-slate-900 py-2 z-10">
      <h1 class="font-bold text-sm">🔍 API Debug Log</h1>
      <div class="flex gap-2">
        <button class="px-3 py-1.5 rounded bg-slate-700 active:scale-95" @click="refresh">
          Refresh
        </button>
        <button class="px-3 py-1.5 rounded bg-amber-600 active:scale-95" @click="copyAll">
          Copy
        </button>
        <button class="px-3 py-1.5 rounded bg-rose-600 active:scale-95" @click="clear">
          Clear
        </button>
        <button class="px-3 py-1.5 rounded bg-slate-700 active:scale-95" @click="router.back()">
          ✕
        </button>
      </div>
    </div>

    <p class="text-slate-400 mb-3 break-all">
      baseURL: {{ apiBase }}
    </p>

    <div v-if="logs.length === 0" class="text-slate-500 text-center py-10">
      Belum ada request tercatat.
    </div>

    <div
v-for="log in logs" :key="log.id" class="mb-3 rounded-lg border p-3"
      :class="log.ok ? 'border-slate-700 bg-slate-800/50' : 'border-rose-500/50 bg-rose-950/30'">
      <div class="flex items-center justify-between mb-1">
        <span class="font-bold" :class="log.ok ? 'text-emerald-400' : 'text-rose-400'">
          {{ log.method }} {{ log.status ?? 'ERR' }}
        </span>
        <span class="text-slate-400">{{ log.timestamp }} · {{ log.durationMs }}ms</span>
      </div>
      <div class="text-sky-300 break-all mb-1">{{ log.baseURL }}{{ log.url }}</div>
      <div v-if="log.requestBody" class="mb-1">
        <span class="text-slate-500">REQ ▸</span>
        <pre class="whitespace-pre-wrap break-all text-slate-300">{{ pretty(log.requestBody) }}</pre>
      </div>
      <div v-if="log.response">
        <span class="text-slate-500">RES ◂</span>
        <pre class="whitespace-pre-wrap break-all text-slate-300">{{ pretty(log.response) }}</pre>
      </div>
      <div v-if="log.error" class="text-rose-300 break-all">⚠ {{ log.error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApiLogger } from '~/composables/useApiLogger'

definePageMeta({ layout: 'empty' })

const router = useRouter()
const logger = useApiLogger()
const logs = ref<ReturnType<typeof logger.getAll>>([])
const apiBase = useRuntimeConfig().public.apiBase

const pretty = (val: unknown) => {
  try {
    return JSON.stringify(val, null, 2)
  } catch {
    return String(val)
  }
}

const refresh = () => {
  logs.value = logger.getAll()
}

const clear = () => {
  logger.clear()
  logs.value = []
}

const copyAll = async () => {
  const text = logs.value
    .map((l) => `[${l.timestamp}] ${l.method} ${l.status ?? 'ERR'} (${l.durationMs}ms)\n${l.baseURL}${l.url}\nREQ: ${pretty(l.requestBody)}\nRES: ${pretty(l.response)}\n${l.error ? 'ERR: ' + l.error + '\n' : ''}`)
    .join('\n---\n')
  try {
    await navigator.clipboard.writeText(text)
    alert('Log tersalin ke clipboard')
  } catch {
    alert('Gagal copy')
  }
}

onMounted(refresh)
</script>
