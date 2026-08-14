import { Preferences } from '@capacitor/preferences';
import { ofetch, type FetchOptions } from 'ofetch'


type ApiOptions = FetchOptions<'json'>

export const apiFetch = async <T>(url: string, options: ApiOptions = {}) => {

  const { value } = await Preferences.get({ key: 'auth_token' })

  console.log('TOKEN:', value)
  const token = value
  console.log('token:', value)
  return ofetch<T>(url, {
    baseURL: useRuntimeConfig().public.apiBase,
    ...options,
    headers: {
      ...(options.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },

  })
}
