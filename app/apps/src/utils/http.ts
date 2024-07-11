import { CustomRequestOptions } from '@/interceptors/request'
import { getIsTabbar } from '../utils/index'

interface ReloadToken {
  accessToken: string
  refreshToken: string
}

export const http = <T>(options: CustomRequestOptions) => {
  // 1. 返回 Promise 对象
  // console.log(import.meta.env,'emv');

  return new Promise<IResData<T>>((resolve, reject) => {
    uni.request({
      header: {
        platform: import.meta.env.VITE_APP_PLATFORM,
        authorization: 'Bear ' + uni.getStorageSync('token') || '',
      },
      ...options,
      sslVerify: false,
      dataType: 'json',
      // #ifndef MP-WEIXIN
      responseType: 'json',
      // #endif
      // 响应成功
      async success(result) {
        let res: IResData<T> = result.data as IResData<T>

        // 状态码 2xx，参考 axios 的设计
        if (res.code >= 200 && res.code < 300) {
          // 2.1 提取核心数据 res.data
          resolve(res as IResData<T>)
        } else if (res.code === 401) {
          const reloadMsg = await reloadToken()
          if (!reloadMsg) {
            const isTabbar = getIsTabbar()
            if (!isTabbar) {
              uni.navigateTo({ url: '/pages/user/login' })
            }
            reject(res)

            return
          }

          //重新请求
          http<T>(options).then(resolve).catch(reject)

          // 401错误  -> 清理用户信息，跳转到登录页
          // userStore.clearUserInfo()
          // uni.navigateTo({ url: '/pages/user/login' })
        } else if (res.code === 402) {
          reject(res)
        } else {
          // 其他错误 -> 根据后端错误信息轻提示
          !options.hideErrorToast &&
            uni.showToast({
              icon: 'none',
              title: res.message || '请求错误',
            })

          reject(res)
        }
      },
      // 响应失败
      fail(err) {
        console.log(err, 'err')

        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}

async function reloadToken() {
  const refreshToken = uni.getStorageSync('refreshToken') || ''
  if (!refreshToken) return false
  const res = await http.post<ReloadToken>('/user/refreshToken', { refreshToken })
  if (res.code == 200) {
    uni.setStorageSync('token', res.data.accessToken)
    uni.setStorageSync('refreshToken', res.data.refreshToken)

    return true
  }
}

/**
 * GET 请求
 * @param url 后台地址
 * @param query 请求query参数
 * @returns
 */
export const httpGet = <T>(url: string, query?: Record<string, any>) => {
  return http<T>({
    url,
    query,
    method: 'GET',
  })
}

/**
 * POST 请求
 * @param url 后台地址
 * @param data 请求body参数
 * @param query 请求query参数，post请求也支持query，很多微信接口都需要
 * @returns
 */
export const httpPost = <T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
) => {
  return http<T>({
    url,
    query,
    data,
    method: 'POST',
  })
}

http.get = httpGet
http.post = httpPost
