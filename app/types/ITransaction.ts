export interface ITransactionCategoryOption {
  label: string
  value: string
  icon: string
  color: string
}

export type TCategory =
  | 'food'
  | 'shopping'
  | 'snack'
  | 'bill'
  | 'transfer'
  | 'investment'
  | 'salary'
  | 'grocery'
  | 'transport'
  | 'cafe'
  | 'other'

//SECTION - interface untuk transaksi

export interface IDynamicOption {
  label: string
  value: TCategory
  icon: string
  color: string
  type: 'income' | 'expense'
}

export interface IDataTransaction {
  id: string
  accountId: string
  title: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: TCategory | null
  status: 'pending' | 'confirmed'
  transactionDate: Date
  createdAt: Date
  updatedAt: Date
  dynamicOptions?: IDynamicOption[]
}



export interface IConfirmTransaction {
  id: string | undefined
  category: TCategory
  type: 'income' | 'expense'
}

export interface IMonthlySummaryData {
  month: number
  year: number
  totalExpenses: number
  totalIncome: number
  net: number
}

export interface IMonthlyAdvisorData {
  income: number
  expenses: number

  breakdown: {
    needs: number
    wants: number
    savings: number
  }

  limit: {
    needs: number
    wants: number
    savings: number
  }

  ratio: {
    needs: number
    wants: number
    savings: number
  }

  forecast?: {
    dailyBurnRate: number
    projectedMonthlyExpense: number
    projectedBalance: number
    burnRatio: number
  }

  prediction: string

  flags: string[]
}

export interface IDataAccount {
  id: string,
  userId: number,
  name: string,
  balance: number,
  createdAt: Date
}

export interface IDeletePendingData {
  message: string
  id: string
  status: string
  amount: number
  type: string
}

//SECTION - response dari backend

export interface IDataTransactionResponse {
  success: boolean
  data: {
    account: {
      id: string,
      name: string,
    }
    transactions: IDataTransaction[]
    allCategoryOptions: IDynamicOption[]
  }
}

export interface IIngestTransactionResponse {
  success: boolean
  data: {
    transactions: IDataTransaction
  }
}

export interface IConfirmTransactionResponse {
  success: boolean
  data: IDataTransaction
}


export interface IMonthlySummaryResponse {
  success: boolean
  data: IMonthlySummaryData
}

export interface IMonthlyAdvisorResponse {
  success: boolean
  data: IMonthlyAdvisorData
}


export interface IDataAccountResponse {
  success: boolean
  data: IDataAccount[]
}

export interface IDeletePendingResponse {
  success: boolean
  data: IDeletePendingData
}