import axios from "axios";// 创建一个axios实例
import {codeTxt} from "@/components/codeTxt";
const service = axios.create({
    baseURL:process.env.baseUrl, // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000, // request timeout 5s
    headers:{
        "cache-control":"no-cache"
    }
});
// 请求拦截器
service.interceptors.request.use(config => {
    // do something before request is sent
    return config;
},error => {
    // do something with request error
    return Promise.reject(error);
});

// 响应拦截器
service.interceptors.response.use(response => {
    //do something before response
    if (response.status >= 200 && response.status <= 210) {
        if(response.data.code == codeTxt.CODE_UNLOGIN && (response.data.data == '/file/download' || response.data.data == '/collection/add')){ // && (response.data.data == '/file/download' || response.data.data == '/collection/add')
            if(response.data.data){
                sessionStorage.setItem('extra_data',response.data.data);
            }else{
                sessionStorage.setItem('extra_data',false);
            }
            localStorage.removeItem('userInfo');
            location.href= '/login'
        }
        return response;
    } else if(response.status == 404){
        console.error(response.data.errmsg);
    }else if(response.status == 509){
        let html = error.response.data;
        let verifyWindow = window.open("","_blank","height=400,width=560");
        verifyWindow.document.write(html);
        verifyWindow.document.getElementById("baseUrl").value = baseUrl;
    }else{
        //不走
    };
},
error => {
    console.log('err' + error); // for debugreturn Promise.reject(error);
})

export default service;