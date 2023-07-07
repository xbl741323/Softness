import axios from 'axios'
// 创建axios实例
const request = axios.create({
  // baseURL: 'http://192.168.1.11:9999/',// 设置统一的请求地址前缀
  baseURL: import.meta.env.VITE_API_URL,// 设置统一的请求地址前缀
  timeout: 50000, // 设置超时时间（毫秒）
  withCredentials: true,// 异步请求携带cookie
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // do something before request is sent
    return config
  },
  (error) => {
    // do something with request error
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // do something before response
    return response.data
  },
  (error) => {
    // do something with response error
    return Promise.reject(error)
  }
)
export default request