import request from '@/router/axios'
//通知公告列表
export function policyList(query) {
    return request({
        url: '/wtcrm/notice/getList',
        method: 'post',
        data: query
    })
}
export function batchTransfer(query) {
    return request({
        url: '/wtcrm/notice/batchTransfer',
        method: 'put',
        data: query
    })
}
export function batchCopy(query) {
    return request({
        url: '/wtcrm/notice/batchCopy',
        method: 'put',
        data: query
    })
}
export function recordList(query) {
    return request({
        url: '/wtcrm/notice/record',
        method: 'post',
        data: query
    })
}

export function delNotice(number) {
    return request({
        url: '/wtcrm/notice/delete/' + number,
        method: 'delete',
    })
}

export function batchShowStatus(query) {
    return request({
        url: '/wtcrm/notice/batchShowStatus',
        method: 'put',
        data: query
    })
}

export function batchDelete(query) {
    return request({
        url: '/wtcrm/notice/batchDelete',
        method: 'delete',
        data: query
    })
}

export function listChangeStatus(param) {
    return request({
        url: '/wtcrm/notice/changeShowStatus',
        method: 'put',
        data: param
    })
}

export function getrapidChange(number) {
    return request({
        url: '/wtcrm/notice/rapidChange?number=' + number,
        method: 'get',
    })
}

//新建和编辑
export function saveDraft(param, config) {
    let configObj = {
        url: '/wtcrm/notice/saveDraft',
        method: 'post',
        data: param
    };
    if (config && config.headers) {
        configObj.headers = config.headers;
    }
    return request(configObj);
}

export function saveProblemDraft(param, config) {
    let configObj = {
        url: '/wtcrm//problem//saveDraft',
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
        url: '/wtcrm/notice/add',
        method: 'post',
        data: param
    };
    if (config && config.headers) {
        configObj.headers = config.headers;
    }
    return request(configObj);
}

export function addProblem(param, config) {
    let configObj = {
        url: '/wtcrm/problem/add',
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
        url: '/wtcrm/notice/edit',
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
        url: '/wtcrm/notice/getDetail/' + number,
        method: 'get',
    })
}

export function deleteNotice(number) {
    return request({
        url: '/wtcrm/notice/delete/' + number,
        method: 'delete',
    })
}

export function rechecking(para) {
    return request({
        url: '/wtcrm/notice',
        method: 'post',
        data: para
    })
}