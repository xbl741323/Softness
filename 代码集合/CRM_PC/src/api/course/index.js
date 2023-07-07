import request from 'axios'
export function courseOrder(obj){//课程订单管理列表数据
  return request({
    url: '/wttalk/courseOrder/pageCourseOrder',
    method: 'post',
    data: obj
  })
}
export function courseOrderDetail(id,source){//课程订单管理详情数据
  if (source) {
    return request({
      url: '/wttalk/courseOrder/my/'+id,
      method: 'get'
    })
  }else{
    return request({
      url: '/wttalk/courseOrder/'+id,
      method: 'get'
    })
  }
}

export function courseOrderStatus(){//课程订单状态
  return request({
    url: '/wttalk/courseOrder/statisticsByStatus',
    method: 'get'
  })
}

export function courseUnpaid(accountId){//课程订单状态
  return request({
    url: '/wttalk/courseOrder/statisticsByStatus/'+accountId,
    method: 'get'
  })
}

// 获取员工信息
export function getEmpInfo(userId) {
  return request({
    url: '/wtcrm/user/getInfoByNumber/' + userId,
    method: 'get'
  })
}

// 获取课程专业分类
export function getCategory() {
  return request({
    url: '/wtprod/category/list',
    method: 'get'
  })
}

// 课程订单数据导出
export function dataExport(obj){
  return request({
    url: '/wttalk/courseOrder/exportExcel',
    method: 'post',
    data: obj,
    responseType: 'blob'
  })
}

// 课程订单数据导出进度条
export function dataExportProgress(){
  return request({
    url: '/wttalk/courseOrder/exportExcelProgress',
    method: 'get',
  })
}