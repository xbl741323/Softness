import request from '@/router/axios'
//提醒类别：
export function getWxType(param) {
    return request({
    url: '/wtcrm/drop/getByType',
    method: 'get',
    params: param
    })
}
// 微信模板ID
export function getWxID() {
    return request({
    url: '/wtcrm/wxtemplate/list',
    method: 'get',
    })
}
// 对象类型下拉框
export function getChildren(param) {
    return request({
    url: '/wtcrm/drop/getByParentNo',
    method: 'get',
    params: param
    })
}
//添加提醒方案
export function addWxObject(params) {
    return request({
        url: '/wtcrm/wxplan',
        method: 'post',
        data: params
    })
}//添加提醒方案
export function editWxObject(params) {
    return request({
        url: '/wtcrm/wxplan',
        method: 'put',
        data: params
    })
}
//新增接收对象
export function addWxRece(params) {
    return request({
        url: '/wtcrm/wxrece',
        method: 'post',
        data: params
    })
}
//微信模板ID校验
export function wxIDcheck(params) {
    return request({
        url: '/wtcrm/wxplan/addValidate',
        method: 'post',
        params: params
    })
}
//修改接收对象
export function editWxRece(params) {
    return request({
        url: '/wtcrm/wxrece',
        method: 'put',
        data: params
    })
}
// 微信列表
export function getWxList(param) {
    return request({
    url: '/wtcrm/wxplan/page',
    method: 'get',
    params: param
    })
}
// 微信提醒详情
export function getWxDetail(id) {
    return request({
    url: '/wtcrm/wxplan/'+id,
    method: 'get',
    })
}
//微信提醒状态启用
export function onwxStatus(params) {
    return request({
        url: '/wtcrm/wxplan/switchOn',
        method: 'post',
        params: params
    })
}

//微信提醒状态停用
export function offwxStatus(params) {
    return request({
        url: '/wtcrm/wxplan/switchOff',
        method: 'post',
        params: params
    })
}
//删除
export function delWxDetail(id) {
    return request({
    url: '/wtcrm/wxrece/'+id,
    method: 'delete',
    })
}

//微信提醒开关-关
export function switchOff(params) {
    return request({
        url: '/wtcrm/wxrece/switchOff',
        method: 'post',
        params: params
    })
}

//微信提醒开关-开
export function switchOn(params) {
    return request({
        url: '/wtcrm/wxrece/switchOn',
        method: 'post',
        params: params
    })
}