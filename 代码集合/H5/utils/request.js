import axios from "axios";// 创建一个axios实例
import { MessageBox, Message } from 'element-ui'
import {toWx} from '@/utils/toWx'

const service = axios.create({
  baseURL: process.env.baseUrl, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000, // request timeout 5s
});

// 请求拦截器
service.interceptors.request.use(config => {
  let token = localStorage.getItem("token");
  if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers['Authorization'] = token;
  }

  if (config.data && config.data.header) {
    let headerObj = config.data.header;
    for (var key in headerObj) {
      config.headers[key] = headerObj[key];
    }
  }
  return config
}, error => {
  // do something with request error
  console.log(error) // for debug
  return Promise.reject(error);
});

// 响应拦截器
service.interceptors.response.use(response => {
  let that = this;
  const res = response.data
  // if the custom code is not 20000, it is judged as an error.
  if (res.code == 1001) {
    return Promise.reject(new Error(res.message || 'Error'))
  } else if (res.code === 10002 && (res.data == '/file/download' 
  || res.data == '/collection/add' 
  || res.data == '/collectionAchievement/addAchievementCollect'
  || res.data == '/collectionRequirement/addRequirementCollect'
  || res.data == '/collectionProperty/addPropertyCollect'
  )) {
    if(response.data.data){
      sessionStorage.setItem('extra_data',res.data);
    }else{
      sessionStorage.setItem('extra_data',false);
    }
    localStorage.removeItem('userInfo');
    // location.href= '/login'
    toWx()
  } else {
    return res
  }
},
  error => {
    console.log('err' + error) // for debug
    // Message({
      // message: error.message,
      // message: '网络错误，请稍后重试或联系工作人员',
    //   type: 'error',
    //   duration: 3 * 1000,
    //   offset: 300
    // })
    return Promise.reject(error)
  })
export default service;


