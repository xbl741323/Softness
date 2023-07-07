import request from '@/router/axios'

export function pageMyClueInfo(params) {
    return request({
    url: '/wtcrm/clue/pageMyClueInfo',
    method: 'post',
    data: params
    })
}
//个人中心-部门排行榜-回款金额
export function topTenReceiveStatistic(params) {
    return request({
        url: '/wtorder/receive/topTenReceiveStatistics',
        method: 'post',
        data: params
    })
}

//个人中心-部门排行榜-新增合同
export function topTenContractStatistics(params) {
    return request({
        url: '/wtess/contract/topTenContractStatistics',
        method: 'post',
        data: params
    })
}

//个人中心-部门排行榜-创建线索
export function topTenClueStatistics(params) {
    return request({
        url: '/wtcrm/clue/topTenClueStatistics',
        method: 'post',
        data: params
    })
}

//个人中心-部门排行榜-客户跟进
export function topTenClueFollowStatistics(params) {
    return request({
        url: '/wtcrm/clueFollow/topTenClueFollowStatistics',
        method: 'post',
        data: params
    })
}

//个人中心-业绩数据
export function performanceStatistics(params) {
    return request({
        url: '/wtcrm/personal/workbench/performanceStatistics',
        method: 'post',
        data: params
    })
}

export function getMyOrder() {
    return request({
    url: '/wtcrm/personal/workbench/order',
    method: 'get'
    })
}

// 获取邀请码信息
export function getWxYaoCode() {
    return request({
    url: '/admin/user/getInviteCode',
    method: 'get'
    })
}

