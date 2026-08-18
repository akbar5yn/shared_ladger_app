import { io, type Socket } from 'socket.io-client'
import { useAuthStore } from '~/stores/auth'
import { useBankStore } from '~/stores/banks'
import { useTransactionStore } from '~/stores/useTransactionStore'
import { useSummary } from '~/composables/useSummary'
import { useBankObserver } from '~/composables/useBankObserver'
import { getSocketHost } from '~/composables/useApiBase'
import { appLog } from '~/utils/debug'
import { useApiLogger } from '~/composables/useApiLogger'
import type { IDataTransaction } from '~/types/ITransaction'

// Composable realtime: connect ke backend Socket.IO Gateway.
// Backend emit event ke room `user:{id}` (bukan per-akun) supaya semua device
// login ke satu user dapat update. Event yang didengarkan:
//   - ledger:updated  -> saldo akun berubah (setelah confirm) -> patch store
//   - ledger:pending  -> ada transaksi pending baru -> patch store
// Chat (fase 2) akan pakai event/room terpisah, belum ditangani di sini.

// Shared ref yang di-set History page agar socket bisa trigger re-fetch
// history saat ada update realtime pada akun aktif. Dipanggil dari setup
// (composable), jadi useState harus di dalam fungsi — bukan level modul.
export const useHistoryReloader = () =>
    useState<(() => Promise<void>) | null>('history_reloader', () => null)

export const useSocket = () => {
    // useState harus dipanggil di dalam composable (context setup), bukan di
    // level modul — kalau tidak Nuxt error "composable called outside...".
    const socketState = useState<{ socket: Socket | null }>(
        'realtime_socket',
        () => ({ socket: null }),
    )

    const authStore = useAuthStore()
    const bankStore = useBankStore()
    const transactionStore = useTransactionStore()
    const { getSummary, getAdvisor } = useSummary()
    const { getAccount } = useBankObserver()

    const connect = () => {
        if (import.meta.server) return
        if (!authStore.isLoggedIn || !authStore.token) return
        if (socketState.value.socket) return // sudah connect

        const token = authStore.token
        const host = getSocketHost()
        const logger = useApiLogger()
        appLog(`[SOCKET] connecting -> ${host}`)
        logger.push({ method: 'WS', url: 'connect', baseURL: host, ok: true, durationMs: 0, requestBody: { userId: authStore.user?.id } })

        const socket: Socket = io(host, {
            auth: { token },
            transports: ['websocket', 'polling'],
            autoConnect: true,
        })

        socket.on('connect', () => {
            socket.emit('join', { userId: authStore.user?.id })
            appLog(`[SOCKET] CONNECTED (id=${socket.id})`)
            logger.push({ method: 'WS', url: 'connect:ok', baseURL: host, ok: true, durationMs: 0, response: { socketId: socket.id } })
        })

        socket.io.on('reconnect_attempt', (n) => {
            appLog(`[SOCKET] reconnect attempt #${n}`)
        })

        socket.on('disconnect', (reason) => {
            appLog(`[SOCKET] disconnected (${reason})`)
            logger.push({ method: 'WS', url: 'disconnect', baseURL: host, ok: false, durationMs: 0, error: reason })
        })

        socket.on('connect_error', (err) => {
            appLog(`[SOCKET] connect_error: ${err.message}`)
            logger.push({ method: 'WS', url: 'connect:error', baseURL: host, ok: false, durationMs: 0, error: err.message })
        })

        // Saldo akun berubah (setelah confirm). Kalau akun aktif cocok,
        // langsung patch balance + refetch summary/advisor.
        socket.on('ledger:updated', async (payload: { accountId: string; balance: number }) => {
            if (!payload?.accountId) return
            appLog(`[SOCKET] ledger:updated account=${payload.accountId}`)
            await getAccount()
            const activeId = bankStore.activeAccountId
            if (activeId !== payload.accountId) return

            const active = bankStore.currentAccount
            if (active) {
                await transactionStore.setActualBalance(active.balance)
            }
            transactionStore.setSummaryLoading(true)
            try {
                await getSummary(activeId)
                await getAdvisor(activeId)
            } finally {
                transactionStore.setSummaryLoading(false)
            }
        })

        // Ada transaksi pending baru untuk akun ini. Tambahkan ke store
        // (FE akan tampilkan di drawer pending) kalau akun aktif cocok.
        socket.on('ledger:pending', (payload: { accountId: string; transaction: IDataTransaction }) => {
            if (!payload?.accountId) return
            appLog(`[SOCKET] ledger:pending account=${payload.accountId}`)
            const activeId = bankStore.activeAccountId
            if (activeId !== payload.accountId) return
            if (payload.transaction) {
                transactionStore.addPending(payload.transaction)
            }
        })

        socketState.value.socket = socket
    }

    const disconnect = () => {
        if (import.meta.server) return
        socketState.value.socket?.disconnect()
        socketState.value.socket = null
    }

    return {
        connect,
        disconnect,
    }
}
