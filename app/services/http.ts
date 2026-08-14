import { Preferences } from '@capacitor/preferences';
import { ofetch, type FetchOptions } from 'ofetch'


type ApiOptions = FetchOptions<'json'>

export const apiFetch = async <T>(url: string, options: ApiOptions = {}) => {

  const { value } = await Preferences.get({ key: 'auth_token' })
  const token = value

  let apiBase = useRuntimeConfig().public.apiBase
  if (apiBase && !/^https?:\/\//.test(apiBase)) {
    apiBase = `https://${apiBase}`
  }

  return ofetch<T>(url, {
    baseURL: apiBase,
    ...options,
    headers: {
      ...(options.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },

  })
}
