import { http } from '@/utils/http'

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  name?: string
  password: string
}

export interface GetUserDto {
  userId: number
}

export const login = (data: LoginDto) => {
  return http.post('/user/login', data)
}

export const register = (data: RegisterDto) => {
  return http.post('/user/register', data)
}

export const getUser = (data: GetUserDto) => {
  return http.get('/user/getUser', data)
}
