import request from '@/router/axios'

// 获取见面拜访管理列表-统计数据
export function getStatisticList(params) {
  return request({
    url: '/wtcrm/tmClueMeetVisit/pageStatisticalData',
    method: 'post',
    data: params
  })
}

// 获取见面拜访管理列表-统计数据-导出记录
export function exportClueMeetVisit(params) {
  return request({
    url: '/wtcrm/tmClueMeetVisit/exportClueMeetVisit',
    method: 'post',
    data: params
  })
}

// 获取见面拜访管理列表-统计数据-导出表
export function getExportResult(params) {
  return request({
    url: '/wtcrm/tmClueMeetVisit/getResult',
    method: 'get',
    params: params
  })
}



// 获取见面拜访管理列表
export function getMeetVisitList(params) {
  return request({
    url: '/wtcrm/tmClueMeetVisit/page',
    method: 'post',
    data: params
  })
}

// 获取陌拜关联列表
export function getStrangeVisitList(params) {
  return request({
    url: '/wtcrm/tmClueMeetVisit/pageMy',
    method: 'post',
    data: params
  })
}

// 批量陌拜关联操作
export function batchVisitConnection(params) {
  return request({
    url: '/wtcrm/tmClueMeetVisit/batchConnection',
    method: 'post',
    data: params
  })
}

// 获取陌拜关联关联线索
export function getVisitConnectClue(params, type) {
  let url = type == 2 ? 'clueCompany/pageClueCompanyOfClueVisit' : 'cluePerson/pageCluePersonOfClueVisit'
  return request({
    url: `/wtcrm/${url}`,
    method: 'post',
    data: params
  })
}


