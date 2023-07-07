import {
  request
} from "../common/request.js"

module.exports = {
  // 创建/编辑线索-重构 status：1-编辑 0-创建 clueType：1-个人线索 2-单位线索 
  operateClue(params, status, clueType) {
    let unitUrl = status == 0 ? 'addClueCompanyOfMy' : 'modClueCompanyOfMy'
    let soloUrl = status == 0 ? 'addCluePersonOfMy' : 'modCluePersonOfMy'
    let url = clueType == 2 ? `/wtcrm/clueCompany/${unitUrl}` : `/wtcrm/cluePerson/${soloUrl}`
    return request('post', `${url}`, params)
  },
  // 获取我的线索列表
  getMyClueList: (data, clueType) => {
    let url = clueType == 2 ? 'clueCompany/pageClueCompanyOfMy' : 'cluePerson/pageCluePersonOfMy'
    return request('post', `/wtcrm/${url}`, data)
  },
  // 获取线索详情 clueType：2-单位（线索/客户） 1-个人（线索/客户)
  getClueDetail: (data, clueType, isPerson) => {
    if (isPerson) {
      let url = clueType == 2 ? 'clueCompany/getClueCompanyOfMy' : 'cluePerson/getCluePersonOfMy'
      return request('get', `/wtcrm/${url}`, data)
    } else {
      let url = clueType == 2 ? 'clueCompany/getClueCompany' : 'cluePerson/getCluePerson'
      return request('get', `/wtcrm/${url}`, data)
    }
  },
  // 获取线索列表 clueType：2-单位列表 1-个人列表
  getClueList(data, clueType) {
    let url = clueType == 2 ? 'clueCompany/pageClueCompanyGlobal' : 'cluePerson/pageCluePersonGlobal'
    return request('post', `/wtcrm/${url}`, data)
  },
  // 根据信用代码查询单位账户信息
  getByOrganizationForOrder: (data) => {
    return request('get', '/wtuims/tmuser/getByOrganization', data)
  },
  // 根据手机号码查询个人账户信息
  getByMobile: (data) => {
    return request('get', '/wtuims/tmuser/getByMobile', data)
  },
  // 删除失效线索
  delClue(params, clueType) {
    let url = clueType == 2 ? `clueCompany/removeClueCompany?clueCompanyId=${params.id}` : `cluePerson/removeCluePerson?cluePersonId=${params.id}`
    return request('post', `/wtcrm/${url}`, params)
  },
  // 领取公海客户 highSeasType：2-集团公海 1-部门公海
  receive(params, clueType, highSeasType) {
    if (highSeasType == 2) {
      let url = clueType == 2 ? 'seasCompany/receiveGroupClueCompanyBatch' : 'seasPerson/receiveGroupCluePersonBatch'
      return request('put', `/wtcrm/${url}`, params)
    } else {
      let url = clueType == 2 ? 'seasCompany/receiveSectorClueCompanyBatch' : 'seasPerson/receiveSectorCluePersonBatch'
      return request('put', `/wtcrm/${url}`, params)
    }
  },

  // 领取公海客户 highSeasType：2-集团公海 1-部门公海
  receiveForMy(params, clueType) {
    let url = clueType == 2 ? 'seasCompany/receiveClueCompanyBatchOfMy' : 'seasPerson/receiveCluePersonBatchOfMy'
    return request('put', `/wtcrm/${url}`, params)
  },
  // 分配归属 type：0-分配线索归属 1-分配业务员 clueType：2-单位（线索/客户） 1-个人（线索/客户) 
  allotBelong(params, type, clueType) {
    let pUrl = clueType == 2 ? 'clueCompany' : 'cluePerson'
    let url = type == 0 ? 'allocClueAttributionEmpBatchOfMy' : 'allocClueSalesmanEmpBatchOfMy'
    return request('post', `/wtcrm/${pUrl}/${url}`, params)
  },
  // 跟进操作 0-添加 1-编辑
  followOperate(params, type) {
    let url = type == 0 ? `addClueFollowOfMy` : `modClueFollow`
    return request('post', `/wtcrm/clueFollow/${url}`, params)
  },
  // 获取跟进记录列表
  getFollowList(params) {
    return request('post', `/wtcrm/clueFollow/listClueFollowByClueId`, params)
  },
  // 获取地区列表
  getArea() {
    return request('get', `/wtcrm/area/treeAndAll`)
  },
  // 发起订单判断 clueType：2-单位（线索/客户） 1-个人（线索/客户）
  validateCreateOrder(params, clueType) {
    let url = clueType == 2 ? 'createOrderCheckForCompany' : 'createOrderCheckForPerson'
    return request('get', `/wtuims/${url}`, params)
  },
  // 个人中心-获取发起认证信息
  getMyCreateCompanyAuthVo(data, clueType) {
    return request('get', `/wtcrm/tmClueCompanyAuthRecord/getMyCreateCompanyAuthVo?clueId=${data}&clueType=${clueType}`)
  },
  // 发起认证审核人下拉数据
  listCertifiedAuthorized() {
    return request('get', `/wtcrm/permission/listCertifiedAuthorized`)
  },
  // 发起认证选择用户
  listAuthCompanyUserVoByMobile(data) {
    return request('get', `/wtuims/tmuser/listAuthCompanyUserVoByMobile?mobile=${data}`)
  },
  //我的线索发起认证
  saveCertified(params) {
    return request('post', `/wtcrm/tmClueCompanyAuthRecord/saveCertified`, params)
  },
  //我的线索详情发起授权
  saveAuthorized(params) {
    return request('post', `/wtcrm/tmClueCompanyAuthRecord/saveAuthorized`, params)
  },
  getByOrganization(data) {
    return request('get', `/wtuims/tmuser/getAuthCompanyUserVoByOrganization?organization=${data}`)
  },

  //新建线索-合作商查看对接人    
  getConnectEmp: (data) => {
    return request('get', '/admin/tmPartner/getConnectEmpByPartnerId', data)
  },

  //获取线索提供方列表   
  getPartnerList: () => {
    return request('get', '/admin/tmPartner/option')
  },

  //根据线索id和年份查询财务信息   
  getFinanceInfo: (data) => {
    return request('get', '/wtcrm/transactionCompany/getMyTtClueCompanyUnit', data)
  },
}