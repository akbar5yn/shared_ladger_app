// Global API logger untuk debugging (buka via 3x tap di title "Shared Ledger")
// Menyimpan log request/response ke localStorage agar bisa dilihat di halaman /debug-log

export interface ApiLogEntry {
    id: number
    timestamp: string
    method: string
    url: string
    baseURL?: string
    status?: number
    ok: boolean
    durationMs: number
    requestBody?: unknown
    response?: unknown
    error?: string
}

const STORAGE_KEY = 'debug_api_logs'
const MAX_ENTRIES = 200

let buffer: ApiLogEntry[] = []

function load(): ApiLogEntry[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as ApiLogEntry[]) : []
    } catch {
        return []
    }
}

function persist(entries: ApiLogEntry[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)))
    } catch {
        // ignore quota errors
    }
}

export const useApiLogger = () => {
    const push = (entry: Omit<ApiLogEntry, 'id' | 'timestamp'>) => {
        const entries = load()
        const full: ApiLogEntry = {
            ...entry,
            id: Date.now() + Math.floor(Math.random() * 1000),
            timestamp: new Date().toLocaleTimeString('id-ID', { hour12: false }),
        }
        entries.push(full)
        buffer = entries.slice(-MAX_ENTRIES)
        persist(buffer)
    }

    const getAll = (): ApiLogEntry[] => load().reverse()

    const clear = () => {
        buffer = []
        localStorage.removeItem(STORAGE_KEY)
    }

    return { push, getAll, clear }
}
