import axios from 'axios';

let baseUrl = 'http://192.168.1.84:8080'

// 登录请求方法
const loginreq = (method, url, params) => {
    return axios({
        method: method,
        url: baseUrl+url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: params,
        traditional: true,
        transformRequest: [
            function(data) {
                let ret = ''
                for (let it in data) {
                    ret +=
                        encodeURIComponent(it) +
                        '=' +
                        encodeURIComponent(data[it]) +
                        '&'
                }
                return ret
            }
        ]
    }).then(res => res.data);
};
// 通用公用方法
const req = (method, url, params) => {
    return axios({
        method: method,
        url: baseUrl+url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            token: localStorage.getItem('logintoken')
        },
        data: params,
        traditional: true,
        transformRequest: [
            function(data) {
                let ret = ''
                for (let it in data) {
                    ret +=
                        encodeURIComponent(it) +
                        '=' +
                        encodeURIComponent(data[it]) +
                        '&'
                }
                return ret
            }
        ]
    }).then(res => res.data);
};

export {
    loginreq,
    req
}