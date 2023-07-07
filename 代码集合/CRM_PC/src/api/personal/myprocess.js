import request from "@/router/axios";

// 获取合同审批列表
export function getContractList(obj, source) {
  if (source == "mine") {
    console.log("personal");
    return request({
      url: "/wtess/paperContractAudit/pagePaperContractAuditOfMy",
      method: "post",
      data: obj
    });
  } else {
    console.log("list");
    return request({
      url: "/wtess/paperContractAudit/pagePaperContractAudit",
      method: "post",
      data: obj
    });
  }
}

// // 获取合同审批列表
// export function EditChangePrice(obj, source) {
//   if (source == "mine") {
//     console.log("personal");
//     return request({
//       url: "/wtess/paperContractAudit/pagePaperContractAuditOfMy",
//       method: "post",
//       data: obj
//     });
//   } else {
//     console.log("list");
//     return request({
//       url: "/wtess/paperContractAudit/pagePaperContractAudit",
//       method: "post",
//       data: obj
//     });
//   }
// }

// 获取合同流程状态
export function getContractStatus(source) {
  if (source == "mine") {
    console.log("personal");
    return request({
      url: "/wtess/paperContractAudit/getPagerAuditProcessOfMy",
      method: "post"
    });
  } else {
    console.log("list");
    return request({
      url: "/wtess/paperContractAudit/getPagerAuditProcess",
      method: "post"
    });
  }
}

//列表
export function getpersonalList(param) {
  return request({
    url: "/wtcrm/personal/task/page",
    method: "get",
    params: param
  });
}

//我的流程其他状态列表
export function getOtherStateList(param) {
  return request({
    url: "/wtcrm/personal/task/statistical",
    method: "get",
    params: param
  });
}
//流程状态列表
export function getStateList(param) {
  return request({
    // url: '/wtcrm/personal/task/statistical',
    url: "/wtorder/refund/countStateOfMy",
    method: "get",
    params: param
  });
}

//流程名称列表
export function getStateNameList(param) {
  return request({
    url: "/wtcrm/constantcatagory/list",
    method: "get",
    params: param
  });
}
//流程对公转账统计数字
export function payOfflineStatistics() {
  return request({
    url: "/wtcrm/rebuild/task/payOfflineStatistics",
    method: "get"
  });
}
// 我的对公转账统计数字
export function myPayOfflineStatistics() {
  return request({
    url: "/wtcrm/rebuild/task/myPayOfflineStatistics",
    method: "get"
  });
}

export function pageMyOrderTask(obj) {
  return request({
    url: "/wtcrm/rebuild/task/pageMyOrderTaskInfo",///rebuild/task/pageMyOrderTask
    method: "post",
    data: obj
  });
}
// 流程管理改价列表
export function getChangeList(obj, source) {
  return request({
    url: "/wtorder/tmChangePriceAudit/pageTmChangePriceAuditVo",
    method: "post",
    data: obj
  });
}
// 我的流程改价列表
export function getChangeMyList(obj, source) {
  return request({
    url: "/wtorder/tmChangePriceAudit/pageMyTmChangePriceAuditVo",
    method: "post",
    data: obj
  });
}
// 获取我的流程改价状态
export function getByMyStatus() {
  return request({
    url: "/wtorder/tmChangePriceAudit/statisticsMyByStatus",
    method: "get"
  });
}
// 获取流程管理改价状态
export function getByStatus() {
  return request({
    url: "/wtorder/tmChangePriceAudit/statisticsByStatus",
    method: "get"
  });
}

// 改价审批列表
export function getchangePriceDetail(param, type) {
  if (type) {
    return request({
      url: `/wtorder/tmChangePriceAudit/myChangePriceDetail/${param}`,
      method: "get"
    });
  } else {
    return request({
      url: `/wtorder/tmChangePriceAudit/changePriceDetail/${param}`,
      method: "get"
    });
  }
}
// 我的流程审批功能
export function auditPaperContract(data, source) {
  if (source) {
    return request({
      url: "/wtorder/tmChangePriceAudit/auditMyChangePrice",
      method: "post",
      data: data
    });
  } else {
    return request({
      url: "/wtorder/tmChangePriceAudit/auditChangePrice",
      method: "post",
      data: data
    });
  }
}
