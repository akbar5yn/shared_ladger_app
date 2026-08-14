import type { TBankNotificationPayload } from '~/types/INotification';
import { apiFetch } from './http'
import type { IConfirmTransaction, IConfirmTransactionResponse, IDataAccountResponse, IDataTransactionResponse, IDeletePendingResponse, IIngestTransactionResponse, IMonthlyAdvisorResponse, IMonthlySummaryResponse } from '~/types/ITransaction'
export function transactionService() {
  return {
    ingest(payload: TBankNotificationPayload): Promise<IIngestTransactionResponse> {
      return apiFetch('/transactions/ingest', {
        method: 'POST',
        body: payload,
      })
    },

    getAccount(): Promise<IDataAccountResponse> {
      return apiFetch('/accounts', {
        method: 'GET',
      })
    },

    getPending(accountId: string): Promise<IDataTransactionResponse> {
      return apiFetch('/transactions/pending', {
        method: 'GET',
        headers: {
          'x-account-id': accountId,
        },
      })
    },

    getHistory() {
      return apiFetch('/transactions/confirmed')
    },

    confirm(data: IConfirmTransaction, accountId: string): Promise<IConfirmTransactionResponse> {
      const { category, type } = data
      return apiFetch(`/transactions/${data.id}/confirm`, {
        method: 'PATCH',
        body: { category, type },
        headers: {
          'x-account-id': accountId,
        }
      })
    },

    getMonthlySummary(accountId: string, month?: number): Promise<IMonthlySummaryResponse> {
      const query = month ? `?month=${month}` : ''
      return apiFetch(`/transactions/summary/monthly/${query}`, {
        method: 'GET',
        headers: {
          'x-account-id': accountId,
        },
      })
    },

    getMonthlyAdvisor(accountId: string, month?: number): Promise<IMonthlyAdvisorResponse> {
      const query = month ? `?month=${month}` : ''
      return apiFetch(`/transactions/advisor/monthly/${query}`, {
        headers: {
          'x-account-id': accountId,
        },
      })
    },

    deletePendingTransaction(accountId: string, transactionId: string): Promise<IDeletePendingResponse> {
      return apiFetch(`/transactions/${transactionId}`, {
        method: 'DELETE',
        headers: {
          'x-account-id': accountId,
        },
      })
    }
  }
}
