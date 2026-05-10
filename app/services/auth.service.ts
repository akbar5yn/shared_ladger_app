import type { TLoginSuccess } from '~/types/IUser'
import { apiFetch } from './http'

export type TCredentials = {
  email: string
  password: string
}

export function loginService(credentials: TCredentials) {
  return apiFetch<TLoginSuccess>('/auth/login', {
    method: 'POST',
    body: credentials,
  })
}
