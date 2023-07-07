import {
  request
} from "../common/request.js"

module.exports = {
  updateLicense: (data)=>{
    return request('post', '/wtcrm/tmCustomerResource/saveMyLicense', data)
  },

  getTaskList: () => {
    return request('get', '/wtcrm/ttFlowStep/listAllMiddleStepName')
  },
  taskStatusStatistical: (data) => {
    return request('post', '/wtorder/tmMyOrderTask/statisticsMyTaskNum', data)
  },
  getTaskListData: (data) => {
    return request('post', '/wtorder/tmMyOrderTask/pageMyTmOrderTask', data)
  },
  // 获取员工下拉选框
  getEmpOption: (data) => {
    return request('post', `/admin/user/getEmpByNameWithLock`, data)
  },
  // 获取合作机构员工
  getPartnerDeptOption: () => {
    return request('get', '/admin/user/allByDeptAndPartnerDept')
  },
  // 任务详情
  getTaskDetail(id) {
    return request('get', `/wtorder/tmMyOrderTask/headerInfoOfMy?id=${id}`)
  },
  // 更改优先级
  editTaskList: (obj) => {
    return request('put', '/wtorder/tmMyOrderTask/editDeliveryOfMy', obj)
  },
  // 任务批量分配
  batchAllot: (obj) => {
    return request('put', '/wtorder/tmMyOrderTask/batchAllocateEngineerOfMy', obj)
  },
  // 交付信息
  editTaskData: (obj) => {
    return request('put', '/wtorder/tmMyOrderTask/editDeliveryOfMy', obj)

  },
  // 任务订单信息
  getSignInfo: (obj) => {
    return request('get', '/wtorder/tmProjectTask/orderInfoSensitive', obj)
  },

  // 获取用户编辑列表
  getUserEdit: (obj) => {
    return request('POST', '/wtorder/tmMyTaskFollow/listByOrderTaskIdOfMy', obj)
  },
  //分配和编辑记录
  taskEditRecords: (obj) => {
    return request('post', '/admin/opLog/page', obj)
  },
  // 获取任务进度
  getProgressList: (taskId) => {
    return request('get', '/wtorder/ttMyTaskProcess/getProgressByIdOfMy?id=' + taskId)
  },
  submitProgress: (obj, type) => {
    let url = type == 0 ? 'commitProgressOfMy' : 'batchCommitProgressOfMy'
    return request('post', '/wtorder/tmMyOrderTask/' + url, obj)
  },
  // 创建/编辑线索-
  modClueCompanyOfMy: (obj) => {
    return request('post', '/wtcrm/clueCompany/modClueCompanyOfMy', obj)
  },

  // 单位任务客户信息
  getCustomerInfo: (obj, num) => {
    if (num == 2) {
      return request('get', '/wtcrm/transactionCompany/getClueCompanyByTransactionClueIdOfMy', obj)
    } else {
      return request('get', '/wtcrm/transactionPerson/getCluePersonByTransactionClueIdOfMy', obj)
    }

  },
  followCustomer: (obj, type) => {
    let url = type == 0 ? `/wtorder/tmMyTaskFollow/saveTaskFollowOfMy` : `/wtorder/tmTaskFollow`
    let typeList = type == 0 ? 'post' : 'put'
    return request(typeList, url, obj)
  },
  // 获取任务进度
  getTaskFlow: (obj) => {
    return request('get', `/wtcrm/ttFlowStep/getByFlowIdAndVersion/${obj.flowId}/${obj.version}`)
  },
  // 工程师
  updateEngineerName: (obj) => {
    return request('put', '/wtorder/tmProjectTask/allocateEngineer', obj)
  },
  // 获取合作机构人员
  getDataRole: (params) => {
    return request('get', '/admin/tmPartnerUser/getEmpByNameWithLock', params)
  },
  // 获取线索归属
  getuser: (id) => {
    return request('get', '/wtcrm/user/' + id)
  },
  getTmPartnerOption: () => {
    return request('get', '/admin/tmPartner/option')
  }
}