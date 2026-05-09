// interface/IUser.ts
export interface IUser {
  name: string
  email: string
}

export interface ILoginResponse {
  token: string
  user: IUser
}

export type TLoginSuccess = {
  data: ILoginResponse
  success: true
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
