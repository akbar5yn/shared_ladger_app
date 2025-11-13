import { useRuntimeConfig, navigateTo } from '#app';
import { $fetch, type FetchOptions as OFetchOptions } from 'ofetch';
import { useAuth } from '~/composables/useAuth';
import { computed } from 'vue';

type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface FetchOptions {
    params?: Record<string, any>
    body?: Record<string, any>
    headers?: HeadersInit
}


export const useFetcher = () => {

    const call = async <T = any>(
        url: string,
        method: FetchMethod,
        options: FetchOptions = {},
    ): Promise<{ data: T | null, error: string | null }> => {
        const { token, logout } = useAuth();
        const config = useRuntimeConfig();

        const authHeaders = computed(() => {
            const headers: HeadersInit = {};
            if (token.value) {
                headers['Authorization'] = `Bearer ${token.value}`;
            }
            headers['Content-Type'] = 'application/json';
            return headers;
        });
        try {
            const baseURL = config.public.apiBase as string | undefined;
            const fetchOptions: OFetchOptions<"json"> = {
                baseURL: baseURL,
                method: method,
                params: options.params,
                body: options.body,

                headers: {
                    ...options.headers,
                    ...authHeaders.value,
                },

                credentials: 'include',
            };

            const response = await $fetch<T>(url, fetchOptions);

            return { data: response, error: null }

        } catch (error: any) {
            const errorResponse = error.response?._data;
            let msg = 'Terjadi kesalahan tidak dikenal atau masalah jaringan.';

            if (error.statusCode === 401) {
                logout()
                await navigateTo('/login')
                msg = 'Sesi Anda berakhir. Silakan login kembali.'
            } else if (errorResponse && errorResponse.errors) {
                // Error Validasi Laravel (422)
                msg = Object.values(errorResponse.errors).flat().join(' | ');
            } else if (error.message) {
                msg = error.message;
            } else if (typeof errorResponse === 'string') {
                msg = errorResponse;
            }

            return { data: null, error: msg }
        }
    }

    return {
        // Fungsi yang diekspos menggunakan huruf kapital (metode HTTP standar)
        get: <T>(url: string, options?: FetchOptions) => call<T>(url, 'GET', options),
        post: <T>(url: string, options?: FetchOptions) => call<T>(url, 'POST', options),
        put: <T>(url: string, options?: FetchOptions) => call<T>(url, 'PUT', options),
        del: <T>(url: string, options?: FetchOptions) => call<T>(url, 'DELETE', options),
        patch: <T>(url: string, options?: FetchOptions) => call<T>(url, 'PATCH', options),
    }
}