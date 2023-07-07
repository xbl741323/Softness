import axios from "axios";
import * as envCofig from "../envConfig"
import Storage from '../../utils/common/storage'

// 获取登录状态
const getToken = async (config) => {
  try {
    const value = await Storage.getItem('token')
    if (value != null) {
      config.headers.Authorization = value
      console.log(config, '请求头')
      return config
    } else {
      config.headers.Authorization = ''
      console.log(config, '请求头')
      return config
    }
  } catch (e) {
    // error reading value
  }
}

const service = axios.create({
  baseURL: envCofig.SERVER_URL, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout 5s
  headers: {
    "cache-control": "no-cache",
  }
});
// 请求拦截器
service.interceptors.request.use(config => {
  // do something before request is sent
  return getToken(config);
}, error => {
  // do something with request error
  return Promise.reject(error);
});

// 响应拦截器
service.interceptors.response.use(response => {
  // do something before response
  const res = response.data
  console.log(response, '返回头')
  return res
}, error => {
  // for debugreturn Promise.reject(error);
  console.log('err' + error);
  alert(error)
})

export default service;