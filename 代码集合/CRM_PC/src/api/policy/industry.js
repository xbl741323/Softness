import request from '@/router/axios'
//获取行业资讯列表
export function industryList(query,source) {
    return request({
        url: source=='list'?'/wtcrm/industry/getList':'/wtcrm/industry/getMyList',
        method: 'post',
        data: query
    })
}

//保存草稿
export function saveIndustryDraft(param,source) {
    let configObj = {
        url: source=='list'?'/wtcrm/industry/saveDraft':'/wtcrm/industry/mySaveDraft',
        method: 'post',
        data: param
    };
    return request(configObj);
}
// 添加
export function addIndustry(param,source) {
    let configObj = {
        url: source=='list'?'/wtcrm/industry/add':'/wtcrm/industry/myAdd',
        method: 'post',
        data: param
    };
    return request(configObj);
}
// 编辑
export function editIndustry(param,source) {
    let configObj = {
        url: source=='list'?'/wtcrm/industry/edit':'/wtcrm/industry/myEdit',
        method: 'put',
        data: param
    };
    return request(configObj);
}

export function editPolicyIndustry(param) {
    let configObj = {
        url: '/wtcrm/mation/editSave',
        method: 'put',
        data: param
    };
    return request(configObj);
}

// 获取行业资讯详情
export function getIndustryDetail(number,source) {
    return request({
        url: source=='list'?`/wtcrm/industry/getDetail/${number}`:`/wtcrm/industry/getMyDetail/${number}`,
        method: 'get',
    })
}
// 单个删除
export function deleteIndustry(number,source) {
    return request({
        url: source=='list'?`/wtcrm/industry/delete/${number}`:`/wtcrm/industry/myDelete/${number}`,
        method: 'delete',
    })
}

export function recheckIndustry(para) {
    return request({
        url: '/wtcrm/mation',
        method: 'post',
        data: para
    })
}

export function recheckIndustryTitle(para) {
    return request({
        url: '/wtcrm/industry/checkTitle',
        method: 'post',
        data: para
    })
}
// 批量显示状态
export function batchShowStatus(query,source) {
    return request({
        url: source=='list'?'/wtcrm/industry/batchState':'/wtcrm/industry/myBatchState',
        method: 'put',
        data: query
    })
}
// 批量删除
export function batchDelete(query,source) {
    return request({
        url: source=='list'?'/wtcrm/industry/batchDelete':'/wtcrm/industry/myBatchDelete',
        method: 'delete',
        data: query
    })
}
// 单个修改显示状态
export function listChangeStatus(param,source) {
    return request({
        url: source=='list'?'/wtcrm/industry/changeShowStatus':'/wtcrm/industry/myChangeShowStatus',
        method: 'put',
        data: param
    })
}

//获取统计数据
export function getIndustryCount(params) {
    return request({
        url: '/wtcrm/mation/statusNumber',
        method: 'get',
        params:params
    })
}

//获取(我的发布中的)统计数据
export function getsoloCount(params) {
    return request({
        url: '/wtcrm/personal/policy/statusNumber',
        method: 'get',
        params:params
    })
}

//新发布接口-行业资讯里
export function policyPushIndustry(param) {
    let configObj = {
        url: '/wtcrm/mation/put',
        method: 'post',
        data: param
    };
    return request(configObj);
}


//新发布接口-我的发布里-行业资讯
export function soloPushIndustry(params) {
    return request({
        url: '/wtcrm/personal/information/put',
        method: 'post',
        data: params
    })
}
