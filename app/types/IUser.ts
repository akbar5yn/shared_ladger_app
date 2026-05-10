// interface/IUser.ts
export interface IUser {
  id: number
  email: string
  password: string
  name: string
  monthlyBudget: number
  actualBalance: number
  createdAt: Date
}

export type TLoginSuccess = {
  success: true
  data: {
    token: string
    user: IUser
  }
}

export type TLoginFailed = {
  success: false
  message: string
  errors: {
    Format: []
    Email: []
    Password: []
  }
}

export type TLoginResult = TLoginSuccess | TLoginFailed
