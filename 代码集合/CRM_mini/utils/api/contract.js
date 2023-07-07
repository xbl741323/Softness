import {
  request
} from '../common/request'

module.exports = {
  pagePaperContractOfMy(param, contractType) {
    if (contractType == 1) { // 电子
      return request('post', '/wtess/contract/pageContractOfMy', param)
    } else { // 纸质
      return request('post', '/wtess/paperContract/pagePaperContractOfMy', param)
    }
  },
  getDetail(param, contractType) {
    if (contractType == 2) { // 纸质
      return request('get', '/wtess/paperContract/getPaperContract', param)
    } else { // 电子
      return request('post', '/wtess/contract/getContract?contractId=' + param.contractId)
    }
  },

  getOrderInfo(orderList) { // 订单信息
    return request('post', '/wtorder/tmOrder/getOrderInfoByIds', orderList)
  },

  getLogInfo(param) { // 操作记录
    return request('post', '/admin/opLog/page', param)
  },

  delContract(param) { // 删除合同
    return request('post', '/wtess/paperContract/removePaperContract?contractId=' + param.contractId)
  },
  // 录入合同选择订单
  getSelectOrder: (data) => {
    return request('post', `/wtorder/tmOrder/pageContractOrder`, data)
  },
  // 录入合同选择线索
  getSelectClue: (data) => {
    return request('post', `/wtorder/tmOrder/pageContractOrder`, data)
  },
  // 获取合同抬头列表
  getContractHeadNo: () => {
    return request('get', `/wtcrm/drop/getByType?type=4`)
  },
  // 获取合同审批人
  getContractApprover: () => {
    return request('get', `/wtcrm/permission/getexamine`)
  },
  // 录入合同（提交审核/保存草稿）
  enterContract: (data) => {
    return request('post', `/wtess/paperContract/savePaperContract`, data)
  },
  // 纸质合同草稿录入回显
  getContractDetail: (data) => {
    return request('get', `/wtess/paperContract/getPaperContract?contractId=${data.id}`)
  },
  // 草稿合同编辑获取订单列表
  getContractOrder: (data) => {
    return request('post', `/wtorder/tmOrder/getOrderInfoByIds`, data)
  }
}