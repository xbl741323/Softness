import request from '@/router/axios'
//政策汇编列表
export function policyList(query) {
    return request({
        url: '/wtcrm/policy/getList',
        method: 'post',
        data: query
    })
}
export function batchTransfer(query) {
    return request({
        url: '/wtcrm/policy/batchTransfer',
        method: 'put',
        data: query
    })
}
export function batchCopy(query) {
    return request({
        url: '/wtcrm/policy/batchCopy',
        method: 'put',
        data: query
    })
}

export function recordList(query) {
    return request({
        url: '/wtcrm/policy/record',
        method: 'post',
        data: query
    })
}
//获取行业资讯操作记录
export function industryRecordList(query) {
    return request({
        url: '/wtcrm/industry/record',
        method: 'post',
        data: query
    })
}

export function delNotice(number) {
    return request({
        url: '/wtcrm/policy/delete/' + number,
        method: 'delete',
    })
}

export function batchShowStatus(query) {
    return request({
        url: '/wtcrm/policy/batchShowStatus',
        method: 'put',
        data: query
    })
}

export function batchDelete(query) {
    return request({
        url: '/wtcrm/policy/batchDelete',
        method: 'delete',
        data: query
    })
}

export function listChangeStatus(param) {
    return request({
        url: '/wtcrm/policy/changeShowStatus',
        method: 'put',
        data: param
    })
}

export function getrapidChange(number) {
    return request({
        url: '/wtcrm/policy/rapidChange?number=' + number,
        method: 'get',
    })
}

//新建和编辑
export function saveDraft(param, config) {
    let configObj = {
        url: '/wtcrm/policy/saveDraft',
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
        url: '/wtcrm/policy/add',
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
        url: '/wtcrm/policy/edit',
        method: 'put',
        data: param
    };
    if (config && config.headers) {
        configObj.headers = config.headers;
    }
    return request(configObj);
}

export function getDetail(number) {
    return request({
        url: '/wtcrm/policy/getDetail/' + number,
        method: 'get',
    })
}

export function deleteNotice(number) {
    return request({
        url: '/wtcrm/policy/delete/' + number,
        method: 'delete',
    })
}

export function rechecking(para) {
    return request({
        url: '/wtcrm/policy',
        method: 'post',
        data: para
    })
}

