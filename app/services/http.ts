import { ofetch, type FetchOptions } from 'ofetch'

export const apiFetch = <T>(
  url: string,
  options: FetchOptions<'json'> = {},
) => {
  return ofetch<T>(url, {
    baseURL: useRuntimeConfig().public.apiBase,
    ...options,
  })
}
