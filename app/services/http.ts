import { ofetch } from 'ofetch'

export type ApiResult<T> = {
    data: T | null
    error: any | null
}

export const apiFetch = async <T>(
    url: string,
    options: any = {}
): Promise<ApiResult<T>> => {
    try {
        const data = await ofetch<T>(url, {
            baseURL: useRuntimeConfig().public.apiBase,
            ...options,
        })
        return {
            data,
            error: null
        }
    } catch (error: any) {
        if (error.response?._data) {
            return {
                data: null,
                error: error.response._data
            }
        }
        return {
            data: null,
            error: {
                message: 'Network error',
                raw: error
            }
        }
    }
}
