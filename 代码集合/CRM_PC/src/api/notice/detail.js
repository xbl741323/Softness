import request from '@/router/axios'

export function saveDraft(param, config) {
    let configObj = {
        url: '/wtcrm/announcement/saveDraft',
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
        url: '/wtcrm/announcement/add',
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
        url: '/wtcrm/announcement/edit',
        method: 'put',
        data: param
    };
    if (config && config.headers) {
        configObj.headers = config.headers;
    }
    return request(configObj);
}

export function getDraft() {
    return request({
        url: '/wtcrm/announcement/getDraft',
        method: 'get',
    })
}

export function editDraft(param, config) {
    let configObj = {
        url: '/wtcrm/announcement/edit',
        method: 'post',
        data: param
    };
    if (config && config.headers) {
        configObj.headers = config.headers;
    }
    return request(configObj);
}

export function getDetail(number) {
    return request({
        url: '/wtcrm/announcement/getDetail/' + number,
        method: 'get',
    })
}

export function deleteNotice(number) {
    return request({
        url: '/wtcrm/announcement/delete/' + number,
        method: 'delete',
    })
}



