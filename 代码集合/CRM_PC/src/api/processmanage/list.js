import request from '@/router/axios'
//流程合同列表
export function getList(param) {
    return request({
    url: '/wtcrm/task/contract/page',
    method: 'get',
    params: param
    })
}
//流程文章列表
export function getartList(param) {
    return request({
    url: '/wtcrm/task/info/page',
    method: 'get',
    params: param
    })
}

//流程状态列表
export function getStateList(param) {
    return request({
    url: '/wtcrm/task/statistical',
    method: 'get',
    params:param
    })
}

//流程名称列表
export function getStateNameList(param) {
    return request({
    url: '/wtcrm/constantcatagory/list',
    method: 'get',
    params: param
    })
}

//流程对公转账审批列表
export function pageOrderTask(param) {
    return request({
        url: '/wtcrm/rebuild/task/pageOrderTask',
        method: 'post',
        data: param
    })
}

//流程对公转账审批详情
export function getTransferDetail(taskId) {
    return request({
        url: '/wtcrm/getDetailByTaskId/'+ taskId,
        method: 'get',
    })
}

//我的流程对公转账审批详情
export function getDetailByTaskIdofMy(taskId) {
    return request({
        url: '/wtcrm/getDetailByTaskIdofMy/'+ taskId,
        method: 'get',
    })
}

//流程管理对公转账详情审核记录
export function transferAuditLog(param) {
    return request({
        url: '/admin/auditLog/list',
        method: 'post',
        data: param
    })
}

//流程对公转账状态
export function getTransferStatus() {
    return request({
        url: '/wtcrm/transfer/status',
        method: 'post',
    })
}

//流程对公转账权限
export function Ispermission() {
    return request({
        url: '/wtcrm/transfer/ispermission',
        method: 'get',
    })
}

//流程对公转账选择回款下拉
export function constantcatagory() {
    return request({
        url: '/wtcrm/constantcatagory/list?no=hkqx',
        method: 'get',
    })
}


//流程对公转账发送验证码
export function getTransferCode(param) {
    return request({
        url: '/wtcrm/transfer/sendCode',
        method: 'get',
        params: param
    })
}

//流程对公转账审核通过
export function auditOfflineSuccess(param) {
    return request({
        url: '/wtcrm/transfer/auditOfflineSuccess',
        method: 'post',
        data: param
    })
}

//流程对公转账审核不通过
export function postTransferFail(param) {
    return request({
        url: '/wtcrm/transfer/auditOfflineFailure',
        method: 'post',
        data: param
    })
}

//流程对公转账统计数字
export function payOfflineStatistics() {
    return request({
        url: '/wtcrm/rebuild/task/payOfflineStatistics',
        method: 'get',
    })
}
