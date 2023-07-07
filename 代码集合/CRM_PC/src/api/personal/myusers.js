import request from '@/router/axios'
//文件上传
export function upLoadFollowFile(params) {
    return request({
        url: '/wtuims/tmuserfollow/upLoadUserFollowFile',
        method: 'post',
        data: params
    })
}
//用户转移
export function transferUsers(params) {
    return request({
        url: '/wtcrm/personal/account/batchAllot',
        method: 'post',
        data: params
    })
}
//跟进方式下拉框
export function getFollowup(number) {
    return request({
        url: '/wtcrm/drop/' + number,
        method: 'get'
    })
}
//确定用户跟进
export function comFollowup(params) {
    return request({
        url: '/wtcrm/wtclueaccountacitvity',
        method: 'post',
        data: params
    })
}

//用户跟进
export function confirmFollowup(params) {
    return request({
        url: '/wtuims/tmuserfollow/add',
        method: 'post',
        data: params
    })
}
export function getMyUserList(params) {
    return request({
        url: 'wtcrm/personal/account/pageList',
        method: 'get',
        params: params
    })
}
export function getMyAccountDetail(data) {
    return request({
        url: '/wtcrm/personal/account/detailB/' + data,
        method: 'get'
    })
}

export function getMyTransDetail(data) {
    return request({
        url: '/wtcrm/personal/account/detail/noPwd/' + data,
        method: 'get'
    })
}
//确定新增跟进
export function comNewFollowup(params) {
    return request({
        url: '/wtcrm/wtclueaccountacitvity',
        method: 'put',
        data: params
    })
}
//修改用户详情备注
export function editUserRemark(params) {
    return request({
        url: '/wtcrm/personal/account/detail/updateAccountRemark',
        method: 'post',
        data: params
    })
}
