// mock/index.ts
import Mock from 'mockjs'

// 设置延迟
Mock.setup({
  timeout: '200-600'
})

// 登录接口
Mock.mock('/api/auth/login', 'post', (options: any) => {
  const body = JSON.parse(options.body)
  const { username, password } = body

  // 模拟验证逻辑
  if (username === 'admin' && password === 'admin') {
    return {
      code: 200,
      data: {
        // @guid 是 Mock.js 内置的占位符，用于生成一个 全局唯一标识符（GUID）。
        token: Mock.mock('@guid'),
        // @id 是 Mock.js 内置的占位符，用于生成一个随机且合法的身份证号码。
        userId: Mock.mock('@id'),
        username: 'admin',
        nickname: '超级管理员',
        // 使用 DiceBear Avatar API 生成一个随机头像 SVG 图片
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Mock.mock('@name')}`,
        roles: ['admin']
      },
      msg: '登陆成功',
      success: true
    }
  } else if (username === 'user' && password === 'user') {
    return {
      code: 200,
      data: {
        token: Mock.mock('@guid'),
         userId: Mock.mock('@id'),
         username: 'user',
         nickname: '普通用户',
         avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Mock.mock('@name')}`,
         roles: ['user']
      },
      msg: '登陆成功',
      success: true
    }
  } else {
    return {
      code: 401,
      data: null,
      msg: '用户名或密码错误',
      success: false
    }
  }
})

// 获取用户信息
Mock.mock('/api/auth/userInfo', 'get', () => {
  const token = localStorage.getItem('token')
  if (!token) {
    return {
      code: 401,
      data: null,
      message: '未登录',
      success: false
    }
  }

  // 模拟不同用户的权限
  const isAdmin = token.includes('admin') || Math.random() > 0.5
  return {
    code: 200,
    data: {
      id: Mock.mock('@id'),
      username: isAdmin ? 'admin' : 'user',
      nickname: isAdmin ? '管理员' : '普通用户',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Mock.mock('@name')}`,
      email: Mock.mock('@email'),
      phone: Mock.mock('@phone'),
      roles: isAdmin ? ['admin'] : ['user'],
      permissions: isAdmin ? ['*'] : ['read', 'write']
    },
    msg: '获取成功',
    success: true
  }
})

Mock.mock('/api/auth/logout', 'post', () => {
  return {
    code: 200,
    data: null,
    msg: '退出成功',
    success: true
  }
})

export default Mock
