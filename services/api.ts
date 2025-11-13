// File: shared-ledger-app/services/api.ts

import { ENDPOINT } from '~/constant/api.constant';
import { useFetcher } from './fetcher';

type IAuthLoginResponse = any;
type IAuthLogoutResponse = { message: string };


const fetcher = useFetcher();
export const apiService = {
    auth: {
        login: (body: { email: string, password: string }) => {
            const laravelBody = {
                email: body.email,
                password: body.password,
            };

            // Note: Fetcher kita default JSON, jadi kita perlu override header
            return fetcher.post<IAuthLoginResponse>(ENDPOINT.AUTH.LOGIN, {
                body: laravelBody,

                /* JIKA Anda MEMAKSA FORM-DATA, gunakan ini:
                body: toFormBody(laravelBody),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                */
            });
        },

        logout: () =>
            fetcher.post<IAuthLogoutResponse>(ENDPOINT.AUTH.LOGOUT),
    }
};