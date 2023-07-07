import request from '@/router/axios'
//我的纸质合同列表
export function getMyPaperContracts(param) {
    return request({
    url: '/wtess/paperContract/pagePaperContractOfMy',
    method: 'post',
    data: param
    })
}
// 我的电子合同列表
export function getMyEleContracts(param) {
    return request({
    url: '/wtess/contract/pageContractOfMy',
    method: 'post',
    data: param
    })
}
// 获取我的纸质合同状态
export function getMyContractsStatus() {
    return request({
        url: '/wtess/paperContract/getPagerContractProcessOfMy',
        method: 'post',   
    })
}
// export function getStatus() {
//     return request({
//     url: '/wtcrm/personal/wtcontract/statistical',
//     method: 'get',    
//     })
// }

//ddjdjd详情
export function getMyContractsDetail(data) {
    return request({
    url: '/wtcrm/personal/wtcontract/'+data,
    method: 'get',
    })
}
//详情
export function tractsDetail(data) {
    return request({
    url: '/wtcrm/personal/wtcontract/'+data,
    method: 'get',
    })
}
//合同下载
export function contractsDown(param) {
    return request({
    url: '/wtcrm/file/downloadContract',
    method: 'get',
    responseType:'blob',
    params: param
    })
}
//删除合同
export function contractsDelete(data) {
    return request({
    url: '/wtcrm/personal/wtcontract/del',
    method: 'delete',
    params:data
    })
}

//预览添加操作记录
export function downloadLog(id) {
    return request({
    url: '/wtcrm/wtcontract/downLoadContractLog?contractId='+id,
    method: 'get',
    })
}

//合同详情操作记录
export function operateRecords(obj) {
    return request({
    url: '/wtcrm/personal/wtcontract/getContractLogById',
    method: 'get',
    params: obj
    })
}

export function updateNote(obj) {//编辑合同备注
    return request({
        url: '/wtcrm/wtcontract/editContractNote',
        method: 'put',
        data: obj
    })
}
export function getUUID() {
    return request({
        url: '/wtcrm/wtcontract/personal/getUUID',
        method: 'get',
    })
}

export function getOnLionContract(obj) {
    return request({
        url: '/wtcrm/wtcontract/personal/getOnLionContract',
        method: 'get',
        params: obj
    })
}