// 排查完成
import request from "axios";
import { filterPort , filterJk,titleCase }  from "../../util/filtration_permission";
export function getOrder(obj) {
  //订单管理列表数据
  return request({
    url: "/wtcrm/wtorder/page",
    method: "get",
    params: obj
  });
}

export function getPersonalOrder(obj) {
  //我的订单列表数据
  return request({
    url: "/wtcrm/personal/wtorder/page",
    method: "get",
    params: obj
  });
}

export function getStatistical(obj) {
  //订单管理数据统计
  return request({
    url: "/wtcrm/wtorder/statistical",
    method: "post",
    data: obj
  });
}

export function getPersonalStatistical(obj) {
  //我的订单数据统计
  return request({
    url: "/wtcrm/personal/wtorder/statistical",
    method: "post",
    data: obj
  });
}

export function getDetail(obj) {
  //订单管理详情
  return request({
    url: "/wtcrm/wtorder/" + obj.id,
    method: "get"
  });
}

export function getPersonalDetail(obj) {
  //我的订单详情
  return request({
    url: "/wtcrm/personal/wtorder/" + obj.id,
    method: "get"
  });
}

export function updateNoteById(obj) {
  //订单编辑备注
  return request({
    // url: "/wtcrm/wtorder/updateNoteById",
    url: "/wtorder/tmOrder/updateRemark",
    method: "post",
    data: obj
  });
}

export function updateStatusById(obj, Url) {
  //修改订单状态
  return request({
    url: Url,
    method: "post",
    data: obj
  });
}

export function orderOperate(obj) {
  //订单操作记录
  return request({
    url: "/wtcrm/wtorder/getOrderOperate",
    method: "GET",
    params: obj
  });
}

export function checkRefundReceive() {
  return request({
    url: "/wtcrm/refund/checkReceive",
    method: "get"
  });
}

//  线上订单详情
export function getOnlineDetail(obj,srt,bool) {
  if (bool) {
    return request({
      url: "/wtorder/tmOrder/" + obj.orderId + "?sensitiveFlag=" + obj.pwd,
      method: "GET"
    });

  }else{
    return request({
      url: filterPort(2,srt,"/wtorder/tmOrder/" + obj.orderId + "?sensitiveFlag=" + obj.pwd,16),
      method: "GET"
    });
  }
}

// 地址
export function getAreaList() {
  return request({
    url: "/wtcrm/area/tree",
    method: "get"
  });
}

export function editAddress(obj) {
  //修改收件地址
  return request({
    url: "/wtcrm/personal/wtorder/updateReceiveAddress",
    method: "post",
    data: obj
  });
}

// 获取改价信息
export function getChangePriceList(obj, source) {
  // if (source == 'personal') {
  return request({
    // url: '/wtcrm/personal/wtorder/getPayMessageList/' + obj.id,
    url: "/wtorder/tmOrder/changePrice/" + obj.id,
    method: "get"
  });
  // } else {
  //   return request({
  //     url: '/wtcrm/wtorder/getPayMessageList/' + obj.id,
  //     method: 'get'
  //   })
  // }
}

//预览下载合同
export function downloadLog(id) {
  return request({
    url: "/wtorder/refund/downLoadContractLog?orderId=" + id,
    method: "get"
  });
}

//订单信息中获取退款记录
export function getRefundRecord(id) {
  return request({
    url: "/wtorder/refund/getRefundRecord?refundId=" + id,
    method: "get"
  });
}

export function getPayRecords(id) {
  //获取已支付状态付款记录
  return request({
    url: "/wtorder/receive/getPayMessage?id=" + id,
    method: "get"
  });
}

export function getTrTaskOrderByTaskNo({ tradeNo }) {
  //获取对公转帐凭证
  return request({
    url: "/wtcrm/rebuild/getTrTaskOrderByTaskNo/" + tradeNo,
    method: "get"
  });
}

export function createOrder(obj) {
  //发起订单
  return request({
    url: "/wtorder/tmOrder/createOrder",
    method: "post",
    data: obj
  });
}

export function updateOrder(obj) {
  //修改草稿、未生效订单
  return request({
    url: "/wtorder/tmOrder/updateOrder",
    method: "post",
    data: obj
  });
}

// 草稿订单->生成产品订单
export function validDraftOrder(obj,pathType) {
  if (pathType) {
    return request({
      url: "/wtorder/tmOrder/dsx/validMyDraftOrder",
      method: "post",
      data: obj
    });
  }else{
    return request({
      url: "/wtorder/tmOrder/dsx/validDraftOrder",
      method: "post",
      data: obj
    });
  }
}

export function getInitOrder(obj) {
  //待生效订单
  // return request({
  //   url: "/wtorder/tmOrder/pageMyIneffectiveOrder",
  //   method: "post",
  //   data: obj
  // });
  return request({
    url: "/wtorder/tmOrder/dsx/pageMyIneffectiveOrder",
    method: "post",
    data: obj
  });
}

export function getInitOrderStatistics(obj) {
  //待生效统计数据
  return request({
    url: "/wtorder/tmOrder/statisticsMyIneffectiveOrderNum",
    method: "post",
    data: obj
  });
}

export function operateOrder({ orderId }, operate ,pathType ) {
    //待生效订单删除/关闭操作
  if (pathType) {
    return request({
      url:
        operate == "del"
          ? "/wtorder/tmOrder/dsx/removeMyOrder/" + orderId
          : "/wtorder/tmOrder/dsx/updateMyOrder/" + orderId,
      method: operate == "del" ? "delete" : "put"
    });
  }else{
    return request({
      url:
        operate == "del"
          ? "/wtorder//tmOrder/dsx/removeOrder/" + orderId
          : "/wtorder/tmOrder/dsx/updateOrder/" + orderId,
      method: operate == "del" ? "delete" : "put"
    });
  }
}
export function getInitOrderListStatistics(obj,source) {
    return request({
      url: "/wtorder/tmOrder/statisticsOrderNum",
      method: "post",
      data: obj
    });
  // }
}

export function getInitOrderList(obj,str,pathBool) {
  //订单管理-待生效订单
  if (pathBool) {
    return request({
      url:"/wtorder/tmOrder/pageIneffectiveOrder",
      method: "post",
      data: obj
    });
  }else{
    return request({
      url: filterPort(1,str,'/wtorder/tmOrder/pageIneffectiveOrder',-20),
      method: "post",
      data: obj
    });
  }
}

export function getIneffectiveById(obj,routerType) {
    //待生效订单详情
  if (routerType) {
    return request({
      url: "/wtorder/tmOrder/dsx/getMyIneffectiveById/" +
        obj.orderId +
        "?sensitiveFlag=" +
        obj.sensitiveFlag,
      method: "get"
    });
  }else{
    return request({
      url:
        "/wtorder/tmOrder/dsx/getIneffectiveById/" +
        obj.orderId +
        "?sensitiveFlag=" +
        obj.sensitiveFlag,
      method: "get"
    });
  }
}

export function updateRemark(obj) {
  //修改待生效订单备注
  return request({
    url: "/wtorder/tmOrder/updateRemark",
    method: "post",
    data: obj
  });
}
export function saveChangePrice(obj,str,source) {
  //订单改价
  if (source=='personal') {
    return request({
      url: "/wtorder/tmOrder/saveChangePrice",
      method: "post",
      data: obj 
     });
  }else{
    return request({
      url:  filterPort(1,str,'/wtorder/tmOrder/saveChangePrice',-15),
      method: "post",
      data: obj 
     });
  }
}

export function getPersonalCourse(obj) {
  //我的课程订单
  return request({
    url: "/wttalk/courseOrder/pageMyCourseOrder",
    method: "post",
    data: obj
  });
}

export function getPersonalStatistics(obj) {
  //我的课程订单数据统计
  return request({
    url: "/wttalk/courseOrder/statisticsByCondition",
    method: "post",
    data: obj
  });
}

export function getPersoanlOrder(obj) {
  //我的会员订单
  return request({
    url: "/wttalk/vipOrder/pageMyVipOrder",
    method: "post",
    data: obj
  });
}

export function getPersonalVipStatistics(obj) {
  //我的会员订单数据统计
  return request({
    url: "/wttalk/vipOrder/statisticsByCondition",
    method: "post",
    data: obj
  });
}

export function getInitCode(obj) {
  //获取订单归属
  return request({
    url: "/admin/user/getInviteCodeByUserId",
    method: "get",
    params: obj
  });
}

export function needAudit(obj) { //发起订单判断是否需要审核
  return request({
    url: '/wtorder/tmOrder/needAudit',
    method: 'post',
    data: obj
  })
}

export function getAuditor() { //获取发起订单审核人
  return request({
    url: '/wtcrm/permission/listChangePriceAudit',
    method: 'get'
  })
}

export function auditOrder(orderId) { //草稿订单详情检查是否需要审核
  return request({
    url: '/wtorder/tmOrder/createUrl/'+orderId,
    method: 'get'
  })
}

export function getRefundRequest(paymentId) { //获取退款请求
  return request({
    url: '/wtorder/tmRefundRequest/getTmRefundRequestByPaymentId/'+paymentId,
    method: 'get'
  })
}

export function getPersonalCourseGlobal(obj) {//工作台订单查询-课程订单
  return request({
    url: "/wttalk/courseOrder/pageCourseOrderGlobal",
    method: "post",
    data: obj
  });
}

export function getPersoanlOrderGlobal(obj) {//工作台订单查询-会员订单
  return request({
    url: "/wttalk/vipOrder/pageVipOrderGlobal",
    method: "post",
    data: obj
  });
}

// 后台发起对公转账审核 
export function launchTransferAudit(params,str) {
   if (str) {
    return request({
      url: filterPort(3,titleCase(str),'/wtcrm/rebuild/task/payOffline',-0),
      method: "post",
      data: params
    });
  }else{
    return request({
      url: '/wtcrm/rebuild/task/payOfflineInfo',
      method: "post",
      data: params
    });
  }
}