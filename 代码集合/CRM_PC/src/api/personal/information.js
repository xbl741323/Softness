import request from '@/router/axios'
//政策汇编列表
export function policyList(query) {
    return request({
        url: '/wtcrm/personal/information/getList',
        method: 'post',
        data: query
    })
}
export function batchTransfer(query) {
    return request({
        url: '/wtcrm/personal/information/batchTransfer',
        method: 'put',
        data: query
    })
}
export function batchCopy(query) {
    return request({
        url: '/wtcrm/personal/information/batchCopy',
        method: 'put',
        data: query
    })
}
export function recordList(query) {
    return request({
        url: '/wtcrm/personal/information/record',
        method: 'post',
        data: query
    })
}

export function delNotice(number) {
    return request({
        url: '/wtcrm/personal/information/delete/' + number,
        method: 'delete',
    })
}

export function batchShowStatus(query) {
    return request({
        url: '/wtcrm/personal/information/batchShowStatus',
        method: 'put',
        data: query
    })
}

export function batchDelete(query) {
    return request({
        url: '/wtcrm/personal/information/batchDelete',
        method: 'delete',
        data: query
    })
}

export function listChangeStatus(param) {
    return request({
        url: '/wtcrm/personal/information/changeShowStatus',
        method: 'put',
        data: param
    })
}

export function getrapidChange(number) {
    return request({
        url: '/wtcrm/personal/information/rapidChange?number=' + number,
        method: 'get',
    })
}

//新建和编辑
export function saveDraft(param, config) {
    let configObj = {
        url: '/wtcrm/personal/information/saveDraft',
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
        url: '/wtcrm/personal/information/add',
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
        url: '/wtcrm/personal/information/edit',
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
        url: '/wtcrm/personal/information/getDetail/' + number,
        method: 'get',
    })
}

export function deleteNotice(number) {
    return request({
        url: '/wtcrm/personal/information/delete/' + number,
        method: 'delete',
    })
}

export function rechecking(para) {
    return request({
        url: '/wtcrm/personal/information',
        method: 'post',
        data: para
    })
}

//个人中心
//新的添加政策接口
export function addPolicy(params) {
    return request({
        url: '/wtcrm/personal/information/add',
        method: 'post',
        data: params
    })
}

//新的获取政策列表接口
export function getPolicyList(params) {
    return request({
        url: '/wtcrm/personal/information/getList',
        method: 'post',
        data: params
    })
}

//新的获取我的发布政策列表接口
export function getMyPolicyList(params) {
    return request({
        url: '/wtcrm/personal/information/getMyList',
        method: 'post',
        data: params
    })
}

//新的我的发布政策保存草稿接口
// export function saveDraft(params) {
//     return request({
//         url: '/wtcrm/personal/policy/saveDraft',
//         method: 'post',
//         data: params
//     })
// }

//新的我的发布政策保获取详情接口
export function nuticeDetail(number) {
    return request({
        url: '/wtcrm/personal/information/getDetail/' + number,
        method: 'get'
    })
}

//新的我的发布删除政策详情接口
export function deleteNutice(number) {
    return request({
        url: '/wtcrm/personal/information/delete/' + number,
        method: 'delete'
    })
}

//新的我的发布修改政策接口
export function editNutice(params) {
    return request({
        url: '/wtcrm/personal/information/edit',
        method: 'put',
        data: params
    })
}

export function editIndusNotice(param, config) {
    let configObj = {
        url: '/wtcrm/personal/motion/editSave',
        method: 'put',
        data: param
    };
    if (config && config.headers) {
        configObj.headers = config.headers;
    }
    return request(configObj);
}
