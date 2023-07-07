import axios from "axios";// 创建一个axios实例
const service = axios.create({
    baseURL: process.env.baseUrl, // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000, // request timeout 5s
});
// 请求拦截器
service.interceptors.request.use(config => {
    // do something before request is sent
    return config;
}, error => {
    // do something with request error
    return Promise.reject(error);
});

// 响应拦截器
service.interceptors.response.use(response => {
    //do something before response
    const res = response.data
    return res
},error => {
        console.log('err' + error); // for debugreturn Promise.reject(error);
    })

export default service;