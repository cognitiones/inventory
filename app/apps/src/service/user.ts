import { http } from '@/utils/http'

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  name?: string
  password: string
  app_clientId?: string[]
}

export interface GetUserDto {
  userId: number
}

export interface UpdateUserDto {
  id: number

  name?: string

  email?: string

  password?: string

  headPic?: string

  app?: {
    clientId: string
  }
}

class appDto {
  id?: number
  clientid?: string
}

interface UserLogin {
  accessToken: string
  refreshToken: string
  userInfo: {
    id: number
  }
  name: string
  email: string
}

export interface User {
  name: string
  email: string
  headPic: string
}

export const login = (data: LoginDto) => {
  return http.post<UserLogin>('/user/login', data)
}

export const register = (data: RegisterDto) => {
  return http.post('/user/register', data)
}

export const getUser = (data: GetUserDto) => {
  return http.get<User>('/user/getUser', data)
}

export const updateUser = (data: UpdateUserDto) => {
  return http.post('/user/updateUser', data)
}
