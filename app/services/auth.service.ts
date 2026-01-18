import { apiFetch } from './http'

export type TCredentials = {
    email: string
    password: string
}

export function loginService(credentials: TCredentials) {
    return apiFetch<any>('/login', {
        method: 'POST',
        body: credentials
    })
}
