import request from '@/router/axios'
import { resolve } from 'tinymce'

export function changeRecCount(params) {
    return request({
        url: '/wtcrm/recommendSet/changeRecCount',
        method: 'put',
        data: params
    })
}

export function getRecList() {
    return request({
        url: '/wtcrm/recommendSet/weightList',
        method: 'get'
    })
}

export function getAll() {
    return request({
        url: '/wtcrm/recommendSet/all',
        method: 'get'
    })
}

export function changeWeight(params) {
    return request({
        url: '/wtcrm/changeWeight',
        method: 'put',
        data: params
    })
}

export function batchSort(params) {
    return request({
        url: '/wtcrm/project/changeSortValue',
        method: 'put',
        data: params
    })
}

export function reSetWeight(params) {
    return request({
        url: '/wtcrm/recommendSet/reset',
        method: 'PUT',
        data:params
    })
}

export function editWeight(params) {
    return request({
        url: '/wtcrm/recommendSet/changeWeight',
        method: 'PUT',
        data:params
    })
}

//政策汇编列表
export function policyList(query) {
    return request({
        url: '/wtcrm/project/getList',
        method: 'post',
        data: query
    })
}

export function productList(obj) {
    return request({
        url: '/wtprod/spu/pageInfo',
        method: 'post',
        data: obj
    })
}

export function batchTransfer(query) {
    return request({
        url: '/wtcrm/project/batchTransfer',
        method: 'put',
        data: query
    })
}
export function batchCopy(query) {
    return request({
        url: '/wtcrm/project/batchCopy',
        method: 'put',
        data: query
    })
}
export function recordList(query) {
    return request({
        url: '/wtcrm/project/record',
        method: 'post',
        data: query
    })
}

export function delNotice(number) {
    return request({
        url: '/wtcrm/project/delete/' + number,
        method: 'delete',
    })
}

export function delProject(id,number) {
    return request({
        url: '/wtcrm/project/delete/' + id+'/'+number,
        method: 'delete',
    })
}

export function batchShowStatus(query) {
    return request({
        url: '/wtprod/spu/modStatusBatch',
        method: 'put',
        data: query
    })
}

export function batchDelete(query) {
    return request({
        url: '/wtprod/spu/delInfoBatch',
        method: 'delete',
        data: query
    })
}

export function listChangeStatus(param) {
    return request({
        url: '/wtprod/spu/modStatusBatch',
        method: 'put',
        data: param
    })
}

export function getrapidChange(number) {
    return request({
        url: '/wtcrm/project/rapidChange?number=' + number,
        method: 'get',
    })
}

//新建和编辑
export function saveDraft(param, config) {
    let configObj = {
        url: '/wtcrm/project/saveDraft',
        method: 'post',
        data: param
    };
    if (config && config.headers) {
        configObj.headers = config.headers;
    }
    return request(configObj);
}

export function addNotice(param, config) {
    let configObj = {
        url: '/wtcrm/project/add',
        method: 'post',
        data: param
    };
    if (config && config.headers) {
        configObj.headers = config.headers;
    }
    return request(configObj);
}

export function editNotice(param, config) {
    let configObj = {
        url: '/wtcrm/project/edit',
        method: 'put',
        data: param
    };
    if (config && config.headers) {
        configObj.headers = config.headers;
    }
    return request(configObj);
}

export function getDetail(obj) {
    return request({
        url: '/wtprod/spu/getBaseInfo',
        method: 'get',
        params: obj
    })
}

export function deleteNotice(number) {
    return request({
        url: '/wtcrm/project/delete/' + number,
        method: 'delete',
    })
}

export function rechecking(para) {
    return request({
        url: '/wtcrm/project',
        method: 'post',
        data: para
    })
}

export function uploadMedia(para) {
    return request({
        url: '/wtcrm/file/upload',
        method: 'post',
        data: para
    })
}

export function addByJson(params) {
    return request({
        url: 'wtprod/spu/addInfo',
        method: 'post',
        data: params
    })
}

export function editByJson(params) {
    return request({
        url: '/wtcrm/project/editByJson',
        method: 'put',
        data: params
    })
}

export function modBaseInfo(obj) {//产品基本信息修改
    return request({
        url: '/wtprod/spu/modBaseInfo',
        method: 'put',
        data: obj
    })
}

export function editContent(params) {
    return request({
        url: '/wtcrm/project/editContentByJson',
        method: 'put',
        data: params
    })
}

export function getTradeInfo(obj) {//产品交易信息查询
    return request({
        url: '/wtprod/spu/getTradeInfo',
        method: 'get',
        params: obj
    })
}

export function modTradeInfo(obj) {//修改产品交易信息
    return request({
        url: '/wtprod/spu/modTradeInfo',
        method: 'put',
        data: obj
    })
}

export function getDetailInfo(obj) {//产品详情信息查询
    return request({
        url: '/wtprod/spu/getDetailInfo',
        method: 'get',
        params: obj
    })
}

export function modDetailInfo(obj) {//产品详情信息修改
    return request({
        url: '/wtprod/spu/modDetailInfo',
        method: 'put',
        data: obj
    })
}




