// api/auth.ts
import request, { request as Request} from "@/utils/request";
import avatarURL from '@/assets/images/tuzi.jpg'
import { adminRouterLists, userRouterLists } from '../../mock/modules/resourceList'

// 路由接口定义
interface Route {
  id: number,
  name: string,
  route: string,
  icon?: string,
  resourceType: string,
  children?: Route[]
}

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
  roles: string[],
  email?: string,
  resourceType?: string,
  resourceList: Route[]
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

const isStaticMock = import.meta.env.PROD

const staticUsers: Record<string, LoginResult & { password: string }> = {
  admin: {
    password: 'admin',
    token: 'mock-token-admin',
    userId: '1',
    username: 'admin',
    nickname: '超级管理员',
    avatar: avatarURL,
    roles: ['admin'],
    email: '1176557536@qq.com',
    resourceList: adminRouterLists
  },
  user: {
    password: 'user',
    token: 'mock-token-user',
    userId: '2',
    username: 'user',
    nickname: '普通用户',
    avatar: avatarURL,
    roles: ['user'],
    email: '1176557536@qq.com',
    resourceList: userRouterLists
  }
}

const toUserInfo = (user: LoginResult): UserInfo => ({
  id: user.userId,
  username: user.username,
  nickname: user.nickname,
  avatar: user.avatar ?? '',
  email: user.email ?? '',
  phone: '',
  roles: user.roles,
  permissions: user.roles.includes('admin') ? ['*'] : ['read', 'write']
})

const rejectLogin = () => Promise.reject(Object.assign(new Error('账号或密码错误'), { code: 401, msg: '账号或密码错误' }))

// 登录（快捷写法，指定接口为post）
// export const login = ( data: LoginParams ) => {
//   return request.post<LoginResult>('/auth/login', data)
// }
// 通用写法，动态method
export const login = ( data: LoginParams ) => {
  if (isStaticMock) {
    const user = staticUsers[data.username]

    if (!user || user.password !== data.password) {
      return rejectLogin()
    }

    const { password: _password, ...loginResult } = user
    return Promise.resolve(loginResult)
  }

  return Request<LoginResult>({
    url: '/auth/login',
    method: 'POST',
    data
  })
}

// 获取用户信息
export const getUserInfo = () => {
  if (isStaticMock) {
    const token = localStorage.getItem('token')
    const user = Object.values(staticUsers).find((item) => item.token === token)

    if (!user) {
      return Promise.reject(Object.assign(new Error('未登录'), { code: 401, msg: '未登录' }))
    }

    return Promise.resolve(toUserInfo(user))
  }

  return request.get<UserInfo>('/auth/userInfo')
}

// 退出登录
export const logout = () => {
  if (isStaticMock) {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('resource')
    return Promise.resolve(null)
  }

  return request.post('/auth/logout')
}

// 刷新token
export const refreshToken = () => {
  return request.post<{ token: string }>('/auth/refresh')
}
