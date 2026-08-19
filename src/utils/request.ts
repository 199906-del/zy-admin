import axios from 'axios'
// 类型导入必须用 import type
// AxiosInstance：声明 axios 实例的类型，AxiosRequestConfig：声明请求配置的类型，AxiosResponse：声明响应对象的类型，InternalAxiosRequestConfig：声明拦截器里的 config 类型
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { message } from 'ant-design-vue'

// 响应数据结构
export interface ApiResponse<T = any> {
  code: number,
  msg: string,
  data: T,
  success: boolean
}

// 请求配置
interface RequestConfig extends AxiosRequestConfig {
  showLoading?: boolean,
  showError?: boolean
}

class Request {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || './api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 从 localStorage 获取 token
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const { data } = response
        const url = response.config.url || ''
        console.log("response",data)
        // 判断业务状态码
        if (data.code === 0 || data.code === 200) {
          return data.data // 直接返回data
        } else {
          if (url.includes('/auth/login') && data.code === 401) {
            return Promise.reject(Object.assign(new Error(data.msg), { msg: data.msg, code: data.code }))
          }
          // 业务错误
          this.handleError(data.code, data.msg)
          return Promise.reject(new Error(data.msg) || '请求失败')
        }
      },
      (error: AxiosError) => {
        // http 错误处理
        this.handleHttpError(error)
        return Promise.reject(error)
      }
    )
  }

  /**
   * 处理业务错误
   */
  private handleError(code: number, msg: string) {
    switch (code) {
      case 401:
        // token 过期，跳转登录
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
        break;
      case 403:
        message.error('没有权限访问');
        break;
      default:
        message.error(msg || '请求失败');
    }
  }

  /**
   * 处理http错误
   */
  private handleHttpError(error: AxiosError) {
    const { response } = error
    if (!response) {
      message.error('网络异常，请检查网络连接')
      return
    }

    const status = response.status
    switch (status) {
      case 400:
        message.error('请求参数错误')
        break
      case 401:
        message.error('登录已过期，请重新登录')
        localStorage.removeItem('token')
        window.location.href = '/login'
        break;
      case 403:
        message.error('没有权限访问')
        break;
      case 404:
        message.error('请求的资源不存在')
        break;
      case 500:
        message.error('服务器内部错误')
        break;
      default:
        message.error(`请求失败: ${status}`)
    }
  }

  /**
   * 通用请求方法
   */
  public request<T = any>(config: RequestConfig): Promise<T> {
    return this.instance.request<T>(config) as unknown as Promise<T>
  }

  /**
   * GET请求
   */
  public get<T = any>(url: string, params?: any, config?: RequestConfig): Promise<T> {
    return this.instance.get<T>(url, { params, ...config }) as unknown as Promise<T>
  }

  /**
   * POST请求
   */
  public post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.post<T>(url, data, config) as unknown as Promise<T>
  }

  /**
   * PUT请求
   */
  public put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.put<T>(url, data, config) as unknown as Promise<T>
  }
  /**
   * DELETE请求
   */
  public delete<T = any>(url: string, params?: any, config?: RequestConfig): Promise<T> {
    return this.instance.delete<T>(url, { params, ...config }) as unknown as Promise<T>
  }
  /**
   * 文件上传
   */
  public upload<T = any>(url: string, file: File, config?: RequestConfig): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    return this.instance.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    }) as unknown as Promise<T>
  }
  /**
   * GET请求
   */
}

// 导出单例

export default new Request()

// 也可以导出实例方法
export const { get, post, put, delete: del, upload, request } = new Request();
