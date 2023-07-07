import request from '@/router/axios'
// 认证审批列表单位
export function getList(param) {
    return request({
    url: '/wtuims/authCrecord/list',
    method: 'get',
    params:param
    })
}
// 获取个人认证审批列表
export function getPersonList(param) {
    return request({
      url: '/wtuims/authPrecord/list',
      method: 'get',
      params:param
    })
}
// 单位数量
export function authCrecord() {
    return request({
    url: ' /wtuims/authCrecord/statisticsByStatus',
    method: 'get'
    })
}
// 个人数量
export function authPrecord() {
    return request({
    url: ' /wtuims/authPrecord/statisticsByStatus',
    method: 'get'
    })
}
// 统计数量
export function getApprovalCount() {
    return request({
    url: '/wtcrm/authentication/getOrgAuditWaitCount',
    method: 'get'
    })
}

// 待处理人数组
export function getPerson() {
    return request({
    url: '/wtcrm/authentication/getAuditors',
    method: 'get'
    })
}


// 认证审批详情
export function getApprovalDetail(param) {
    return request({
        url: '/wtcrm/authentication/getDetail',
        method: 'get',
        params:param
    })
}

// 获取第三方数据
export function getQichacha(param) {
    return request({
        url: '/wtcrm/qiChaChaAuthentication/getAuthInfo',
        method: 'get',
        params:param
    })
}

// 获取历史第三方数据
export function getHistoryQichacha(param) {
    return request({
        url: '/wtcrm/qiChaChaAuthentication/getOne',
        method: 'get',
        params:param
    })
}


// 认证审核
export function audit(obj) {
    return request({
      url: '/wtcrm/authenticationAuditRecord/audit',
      method: 'post',
      data: obj
    })
}

// 审核记录
export function getRecord(obj) {
    return request({
      url: '/wtcrm/authenticationAuditRecord/getAuditRecords',
      method: 'get',
      params: obj
    })
}

export function getListOfMy(obj) {//个人中心/我的流程/认证审批
    return request({
      url: '/wtuims/authentication/getListOfMy',
      method: 'post',
      data: obj
    })
}



