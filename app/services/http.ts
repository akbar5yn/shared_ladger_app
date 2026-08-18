import { Preferences } from '@capacitor/preferences';
import { ofetch, type FetchOptions } from 'ofetch'
import { useApiLogger } from '~/composables/useApiLogger'
import { getApiBase } from '~/composables/useApiBase'


type ApiOptions = FetchOptions<'json'>

export const apiFetch = async <T>(url: string, options: ApiOptions = {}) => {

  const { value } = await Preferences.get({ key: 'auth_token' })
  const token = value

  // Ambil base URL dari cache (di-set saat boot) agar konsisten dengan socket.
  const apiBase = getApiBase()

  const logger = useApiLogger()
  const method = (options.method ?? 'GET').toUpperCase()
  const start = Date.now()

  logger.push({
    method,
    url,
    baseURL: apiBase,
    ok: true,
    durationMs: 0,
    requestBody: options.body,
  })

  try {
    const res = await ofetch<T>(url, {
      baseURL: apiBase,
      ...options,
      headers: {
        ...(options.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },

    })
    logger.push({
      method,
      url,
      baseURL: apiBase,
      ok: true,
      durationMs: Date.now() - start,
      requestBody: options.body,
      response: res,
    })
    return res
  } catch (err: unknown) {
    const e = err as { response?: { status?: number; _data?: unknown }; status?: number; message?: string }
    logger.push({
      method,
      url,
      baseURL: apiBase,
      ok: false,
      status: e?.response?.status ?? e?.status,
      durationMs: Date.now() - start,
      requestBody: options.body,
      response: e?.response?._data,
      error: e?.message ?? 'Unknown error',
    })
    throw err
  }
}
