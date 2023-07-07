// 排查完成
import request from 'axios'
//任务状态数量
export function taskStatusStatistical(obj, apiInfo) {
  if (obj.listType == 'personal') {
    return request({
      url: '/wtorder/tmMyOrderTask/statisticsMyTaskNum',
      method: 'post',
      data: obj
    })
  } else {
    return request({
      url: '/wtorder' + apiInfo.statisticsApi,
      method: 'post',
      data: obj,
    });
  }
}

export function commitToFinish(obj) {
  return request({
    url: '/wtcrm/order/task/processCommitToFinish',
    method: 'post',
    data: obj
  });
}

export function batchcommitToFinish(obj) {
  return request({
    url: '/wtcrm/order/task/processCommitToFinishOne',
    method: 'post',
    data: obj
  });
}

// 任务页面
export function getTaskList(obj, apiInfo) {
  if (obj.listType == 'personal') {
    return request({
      url: '/wtorder/tmMyOrderTask/pageMyTmOrderTask',
      method: 'post',
      data: obj
    });
  } else {
    return request({
      url: '/wtorder' + apiInfo.pageApi,
      method: 'post',
      data: obj
    });
  }
}

// 任务详情-头部信息
export function getTaskDetail(id, source, apiInfo) {
  return request({
    url: source == 'personal' ? '/wtorder/tmMyOrderTask/headerInfoOfMy?id=' + id : '/wtorder' + apiInfo.detailHeaderInfoApi + '?id=' + id,
    method: 'get',
  })
}

//修改主表任务
export function editTaskList(obj, source, apiInfo) {
  return request({
    url: source == 'personal' ? '/wtorder/tmMyOrderTask/editDeliveryOfMy' : '/wtorder' + apiInfo.editDeliveryApi,
    method: 'put',
    data: obj
  })
}

export function updateTask(obj) {
  return request({
    url: '/wtcrm/order/task',
    method: 'put',
    data: obj
  })
}
// 分配工程师
export function updateEngineerName(obj, source, apiInfo) {
  return request({
    url: source == 'personal' ? '/wtorder/tmMyOrderTask/allocateEngineerOfMy' : '/wtorder' + apiInfo.allocateEngineerApi,
    method: 'put',
    data: obj
  })
}

export function commitProcess(obj, url) { //提交进度
  return request({
    url: url,
    method: 'post',
    data: obj
  })
}

export function getProgressList(taskId, listType, apiInfo) { //获取任务进度时间线数据
  let url = '';
  if (listType == 'personal') {
    url = '/ttMyTaskProcess/getProgressByIdOfMy?id=' + taskId
  } else {
    url = apiInfo.taskProcessApi + '?id=' + taskId
  }
  return request({
    url: '/wtorder' + url,
    method: 'get',
  })
}
//客户跟进 0-添加 1-编辑
export function taskCustomerFollow(obj, type, listType, apiInfo) {
  let url = '';
  if (listType == 'personal') {
    url = type == 0 ? `/wtorder/tmMyTaskFollow/saveTaskFollowOfMy` : `/wtorder/tmMyTaskFollow/My`
  } else {
    url = type == 0 ? '/wtorder' + apiInfo.saveTaskFollowApi : '/wtorder' + apiInfo.editTaskFollowApi
  }
  return request({
    url: `${url}`,
    method: type == 0 ? 'post' : 'put',
    data: obj
  })
}
export function followCustomer(obj, type) { //客户跟进 type-1跟进（保存客户跟进） 0编辑
  if (type == 0) {
    return request({
      url: '/wtorder/tmTaskFollow/saveTaskFollow',
      method: 'post',
      data: obj
    })
  } else {
    return request({
      url: '/admin/opLog/page',
      method: 'post',
      data: obj
    })
  }
}

// 客户跟进记录
export function taskEditRecords(obj, listType, apiInfo) {
  var url = '';
  if (listType == 'personal') {
    url = '/tmMyTaskFollow/listByOrderTaskIdOfMy'
  } else {
    url = apiInfo.recordApi
  }
  return request({
    url: '/wtorder' + url,
    method: 'post',
    data: obj
  })
}

export function taskRecords(obj) {
  return request({
    url: '/admin/opLog/page',
    method: 'post',
    data: obj
  })
}
//分配和编辑数量统计
export function recordCount(obj) {
  return request({
    url: '/admin/opLog/count',
    method: 'post',
    data: obj
  })
}
//客户跟进数量统计
export function followCount(obj, listType, apiInfo) {
  let url = '';
  if (listType == 'personal') {
    url = '/tmMyTaskFollow/count'
  } else {
    url = apiInfo.followApi
  }
  return request({
    url: '/wtorder' + url,
    method: 'post',
    data: obj
  })
}

// 文件库列表页
export function getLibrary(obj) {
  return request({
    url: '/wtcrm/order/task/getFileCabinetPage',
    method: 'post',
    data: obj
  })
}

// 任务文件柜列表
export function getTaskLibrary(obj) {
  return request({
    url: '/wtcrm/order/task/getTaskFileCabinetPage',
    method: 'post',
    data: obj
  })
}

// 任务文件柜其他文件列表
export function getOtherLibrary(obj) {
  return request({
    url: '/wtcrm/order/task/getOtherFileCabinetPage',
    method: 'post',
    data: obj
  })
}

// 删除文件库
export function deleteLibrary(obj) {
  return request({
    url: '/wtcrm/order/task/deleteFileCabinet',
    method: 'post',
    data: obj
  })
}

// 移除文件
export function removeLibrary(obj) {
  return request({
    url: '/wtcrm/order/task/removeFileCabinet',
    method: 'post',
    data: obj
  })
}

// 新增本地文件至文件库
export function localAdd(obj) {
  return request({
    url: '/wtcrm/order/task/addFileCabinet',
    method: 'post',
    data: obj
  })
}

// 新增文件库
export function kuAdd(obj) {
  return request({
    url: '/wtcrm/order/task/addFileCabinetSelf',
    method: 'post',
    data: obj
  })
}


// 下载
export function singleDown(obj) {
  return request({
    url: '/wtcrm/order/task/downloadSingle',
    method: 'post',
    data: obj,
    responseType: "blob"
  })
}

// 批量下载
export function piliangDown(obj) {
  return request({
    url: '/wtcrm/order/task/downloadBatch',
    method: 'post',
    data: obj,
    responseType: "blob"
  })
}

// 单位任务客户信息
export function getCustomerInfo(obj) {
  if (obj.listType == 'personal') {
    return request({
      url: '/wtcrm/transactionCompany/getClueCompanyByTransactionClueIdOfMy',
      method: 'get',
      params: obj
    })
  } else {
    return request({
      url: '/wtcrm/transactionCompany/getClueCompanyByTransactionClueId',
      method: 'get',
      params: obj
    })
  }
}
// 个人任务客户信息
export function getCustomerPersonInfo(obj) {
  if (obj.listType == 'personal') {
    return request({
      url: '/wtcrm/transactionPerson/getCluePersonByTransactionClueIdOfMy',
      method: 'get',
      params: obj
    })
  } else {
    return request({
      url: '/wtcrm/transactionPerson/getCluePersonByTransactionClueId',
      method: 'get',
      params: obj
    })
  }

}
// 更新营业执照
export function upDataSaveLicense(obj, Bool) {
  if (Bool) {
    return request({
      url: '/wtcrm/tmCustomerResource/saveMyLicense',
      method: 'post',
      data: obj
    })
  } else {
    return request({
      url: '/wtcrm/tmCustomerResource/saveLicense',
      method: 'post',
      data: obj
    })
  }
}
// 文件柜内容上传
export function upDataSaveFileRepository(obj, Bool, taskType) {
  if (Bool) {
    return request({
      url: '/wtcrm/tmCustomerResource/saveMyFileRepository',
      method: 'post',
      data: obj
    })
  } else {
    return request({
      url: taskType ? '/wtcrm/tmIntellectualTask/saveFileRepository' : "/wtcrm/tmProjectTask/saveFileRepository",
      method: 'post',
      data: obj
    })
  }
}
// 分页获取文件柜记录
export function getPageTmCustomerResource(obj) {
  return request({
    url: '/wtcrm/tmCustomerResource/pageTmCustomerResource',
    method: 'post',
    data: obj
  })

}
// 删除文件柜文件
export function deleteFileById(id, Bool, taskType) {
  if (Bool) {
    return request({
      url: `/wtcrm/tmCustomerResource/deleteMyFile/${id}`,
      method: 'DELETE',
    })
  } else {
    return request({
      url: taskType ? `/wtcrm/tmIntellectualTask/deleteFile/${id}` : `/wtcrm/tmProjectTask/deleteFile/${id}`,
      method: 'DELETE',
    })
  }

}
// 更新文件名称
export function updateFileName(obj, Bool, taskType) {
  if (Bool) {
    return request({
      url: '/wtcrm/tmCustomerResource/updateMyFileName',
      method: 'PUT',
      data: obj
    })
  } else {
    return request({
      url: taskType ? '/wtcrm//tmIntellectualTask/updateFileName' : "/wtcrm/tmProjectTask/updateFileName",
      method: 'PUT',
      data: obj
    })
  }
}
// 任务订单信息
export function getSignInfo(obj, apiInfo) {
  if (obj.listType == 'personal') {
    return request({
      url: '/wtorder/tmMyOrderTask/orderInfoOfMy',
      method: 'get',
      params: obj
    })
  } else {
    return request({
      url: '/wtorder/' + apiInfo.detailOrderInfoSensitive,
      method: 'get',
      params: obj
    })
  }
}

export function partnerList() { //获取合作机构筛选项(带卧涛)
  return request({
    url: '/admin/tmPartner/option',
    method: 'get',
  })
}

// 任务列表列显隐设置
export function updateCustomerSetting(data) {
  return request({
    url: '/admin/user/updateCustomerSetting',
    method: 'post',
    data: data,
  })
}

// 任务管理-文件库-客户文件列表
export function pageCustomer(obj) {
  return request({
    url: '/wtcrm/patentFile/pageCustomer',
    method: 'post',
    data: obj
  })
}

// 任务管理-文件库-客户的客户文件列表
export function pageCustomerFile(obj) {
  return request({
    url: '/wtcrm/patentFile/pageCustomerFile',
    method: 'post',
    data: obj
  })
}

// 分页查询-我的专利文件列表
export function paterntFileListMy(data) {
  return request({
    url: '/wtcrm/patentFile/pageMy',
    method: 'post',
    data: data,
  })
}
// 我的专利文件上传文件
export function importFile(data) {
  return request({
    url: '/wtcrm/patentFile/import',
    method: 'post',
    data: data,
  })
}


// 我的专利文件删除文件
export function deleteFileMy(data) {
  return request({
    url: '/wtcrm/patentFile/batchDeleteMy',
    method: 'delete',
    data: data,
  })
}

// 我的专利文件重命名文件
export function renameFileMy(data) {
  return request({
    url: '/wtcrm/patentFile/renameMy',
    method: 'put',
    data: data,
  })
}

// 分页查询-我的专利文件列表
export function paterntFileList(data, isManage) {
  return request({
    url: isManage ? '/wtcrm/patentFile/page' : '/wtcrm/patentFile/pageMy',
    method: 'post',
    data: data,
  })
}

// 我的专利文件删除文件
export function deleteFile(data, isManage) {
  return request({
    url: isManage ? '/wtcrm/patentFile/batchDelete' : '/wtcrm/patentFile/batchDeleteMy',
    method: 'delete',
    data: data,
  })
}

// 我的专利文件重命名文件
export function renameFile(data, isManage) {
  return request({
    url: isManage ? '/wtcrm/patentFile/rename' : '/wtcrm/patentFile/renameMy',
    method: 'put',
    data: data,
  })
}
