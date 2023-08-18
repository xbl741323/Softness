import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router';
import store from '../vuex/store';
// import store from '@/store'
// 创建axios实例
const request = axios.create({
  // baseURL: 'https://www.hnxmsq.cn/service',// 设置统一的请求地址前缀
  baseURL: 'http://119.45.131.191:8080',// 设置统一的请求地址前缀
  // baseURL: import.meta.env.VITE_API_URL,// 设置统一的请求地址前缀
  timeout: 50000, // 设置超时时间（毫秒）
  // withCredentials: true,// 异步请求携带cookie
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    if(sessionStorage.getItem('token')){
      config.headers['token'] = sessionStorage.getItem('token')
    }
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
    if(response.data.code == 401){
      Message({
        type:'warning',
        message:'登录状态已过期，请重新登录！'
      })
      sessionStorage.clear()
      setTimeout(() => {
        store.commit('logout', 'false')
        router.push({ path: '/login' })
      }, 1000)
    }
    // do something before response
    return response.data
  },
  (error) => {
    // do something with response error
    return Promise.reject(error)
  }
)
export default request