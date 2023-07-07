import {
  request
} from "../common/request.js"

module.exports = {
  //获取对公转账审批列表
  pageMyOrderTaskInfo: (data) => {
    return request('post', '/wtcrm/rebuild/task/pageMyOrderTaskInfo', data)
  },
  //流程对公转账审批详情
  getDetailByTaskId: (data) => {
    return request('get', `/wtcrm/getDetailByTaskIdofMy/${data}`)
  },
  //对公转账审批操作记录
  getAuditLogList: (data) => {
    return request('post', '/admin/auditLog/list', data)
  },

  //流程对公转账发送验证码
  getTransferCode: (data) => {
    return request('get', '/wtcrm/transfer/sendCode', data)
  },

  //流程对公转账审核不通过
  postTransferFail: (data) => {
    return request('post', '/wtcrm/transfer/auditOfflineFailure', data)
  },
  //流程对公转账审核通过
  auditOfflineSuccess: (data) => {
    return request('post', '/wtcrm/transfer/auditOfflineSuccess', data)
  },
  //流程对公转账选择回款下拉
  constantcatagory: () => {
    return request('get', '/wtcrm/constantcatagory/list?no=hkqx')
  },

  /* 我的流程-合同审核 */
  contractAuditListOfMy: (data) => {
    return request('post', '/wtess/paperContractAudit/pagePaperContractAuditOfMy', data)
  },


  /* 我的流程-合同审核详情 */
  getContractDetail: (data) => {
    return request('get', '/wtess/paperContractAudit/getPaperContractAuditOfMy', data)
  },

  /* 我的流程-合同审核操作 */
  auditPaperContract: (data) => {
    return request('post', '/wtess/paperContractAudit/auditPaperContractAuditOfMy', data)
  },

  /* 我的流程-合同审核操作记录 */
  auditLog: (data) => {
    return request('post', '/admin/auditLog/list', data)
  },


  /* 我的流程-审核通过 */
  auditPaperContract: (data) => {
    return request('post', '/wtess/paperContractAudit/auditPaperContractAudit', data)
  },
  /*改价审批-获取列表*/
  getChangeMyList: (data) => {
    return request('post', '/wtorder/tmChangePriceAudit/pageMyTmChangePriceAuditVo', data)
  },
  /*改价审批-详情*/
  getchangePriceDetail: (param) => {
    return request('get', `/wtorder/tmChangePriceAudit/myChangePriceDetail/${param}`)
  },
  /*改价审批-审批通过*/
  auditChangeContract: (data) => {
    return request('post', '/wtorder/tmChangePriceAudit/auditMyChangePrice', data)
  },

  // 获取初级认证/授权审批 列表
  getContractList: (data) => {
    return request('POST', '/wtcrm/tmClueCompanyAuthRecord/pageMyTmClueCompanyAuthRecordVo', data)
  },
  // 根据信用代码获取认证信息
  getByOrganization: (obj, type) => {
    if (type == 1) {
      return request('GET', "/wtuims/tmuser/getAuthCompanyUserVo", obj)
    } else {
      return request('GET', "/wtuims/tmuser/getAuthCompanyUserVoByOrganization", obj)
    }
  },
  // 通过id查询
  getClueCompId: (id) => {
    return request('GET', '/wtcrm/tmClueCompanyAuthRecord/getTmClueCompanyAuthRecordVoById/' + id)
  },
  //  处理认证流程 	类型1：认证；2：授权
  auditPaperContractAuditOfMy: (data, type) => {
    if (type == 1) {
      return request('POST', '/wtcrm/tmClueCompanyAuthRecord/handleMyCertified', data)
    } else {
      return request('POST', '/wtcrm/tmClueCompanyAuthRecord/handleMyAuthorized', data)
    }
  },
  // 获取任务审核类标
  getTaskOpenList: (data) => {
    return request('post', '/wtorder/tmTaskOpen/pageMyTaskOpen', data)
  },
  //  审批详情接口
  getTaskOpenInfo: (params) => {
    return request('get', '/wtorder/tmTaskOpen/tmTaskOpenInfoMy/' + params)
  },
  // 开启任务审批接口
  changeTaskOpenCheck: (data) => {
    return request('post', '/wtorder/tmTaskOpen/tmTaskOpenCheckMy', data)
  }
}