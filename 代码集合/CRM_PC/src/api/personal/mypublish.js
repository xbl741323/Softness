import request from '@/router/axios'

export function getMyNuticeList(params) {
    return request({
        url: '/wtcrm/announcement/getMyList',
        method: 'post',
        data: params
    })
}

export function addNutice(params) {
    return request({
        url: '/wtcrm/announcement/add',
        method: 'post',
        data: params
    })
}

export function getBelongList() {
    return request({
        url: '/wtcrm/dropdown/0',
        method: 'get'
    })
}

//新的添加政策接口
export function addPolicy(params) {
    return request({
        url: '/wtcrm/policy/add',
        method: 'post',
        data: params
    })
}

//新的获取政策列表接口
export function getPolicyList(params) {
    return request({
        url: '/wtcrm/policy/getList',
        method: 'post',
        data: params
    })
}

//新的获取我的发布政策列表接口
export function getMyPolicyList(params) {
    return request({
        url: '/wtcrm/policy/getMyList',
        method: 'post',
        data: params
    })
}

//新的我的发布政策保存草稿接口
export function saveDraft(params) {
    return request({
        url: '/wtcrm/policy/saveDraft',
        method: 'post',
        data: params
    })
}

//新的我的发布政策保获取详情接口
export function nuticeDetail(number) {
    return request({
        url: '/wtcrm/policy/getDetail/' + number,
        method: 'get'
    })
}

//新的我的发布删除政策详情接口
export function deleteNutice(number) {
    return request({
        url: '/wtcrm/policy/delete/' + number,
        method: 'delete'
    })
}

//新的我的发布修改政策接口
export function editNutice(params) {
    return request({
        url: '/wtcrm/policy/edit',
        method: 'put',
        data: params
    })
}


//新的分类
export function getNewClass(type) {
    return request({
        url: '/wtcrm/classSet/drop/'+type,
        method: 'get'
    })
}
