// api/auth.ts
import request from "@/utils/request";

// 登录请求参数
export interface LoginParams {
  username: string,
  password: string
}

// 登陆响应数据
export interface LoginResult {
  token: string,
  userId: string,
  username: string,
  nickname: string,
  avatar?: string,
  roles: string[]
}

// 用户信息 
export interface UserInfo {
  id: string,
  username: string,
  nickname: string,
  avatar: string,
  email: string,
  phone: string,
  roles: string[],
  permissions: string[]
}

// 登录
export const login = ( data: LoginParams ) => {
  return request.post<LoginResult>('/auth/login', data)
}

// 获取用户信息
export const getUserInfo = () => {
  return request.get<UserInfo>('/auth/userInfo')
}

// 退出登录
export const logout = () => {
  return request.post('/auth/logout')
}

// 刷新token
export const refreshToken = () => {
  return request.post<{ token: string }>('/auth/refresh')
}