import request from '@/plugins/request'
//二级工商页面
export function getIndustry() {
    return request({
        url: '/pagehome/list',
        method: 'post',
    })
}
//二级法律页面
export function getLegal() {
    return request({
        url: '/pagehome/flList',
        method: 'post',
    })
}
//二级融资页面
export function getFinancing() {
    return request({
        url: '/pagehome/rzList',
        method: 'post',
    })
}
//二级财税页面
export function getTax() {
    return request({
        url: '/pagehome/csList',
        method: 'post',
    })
}