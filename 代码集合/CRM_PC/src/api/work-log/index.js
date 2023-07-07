import request from 'axios'

//获取日志导出记录
export function getLogNumber(params) {
  return request({
    url: '/wtcrm/journal/exportJournalDataStatistics',
    method: "post",
    data: params
  })
}
//获取日志导出url
export function exportLog(params) {
  return request({
    url: '/wtcrm/journal/getResult',
    method: "get",
    params: params
  })
}


export function addLog(params) {
  return request({
    url: 'wtcrm/journal/add',
    method: "post",
    data: params
  })
}

export function editLog(params) {
  return request({
    url: 'wtcrm/journal/edit',
    method: "put",
    data: params
  })
}

export function delLog(number) {
  return request({
    url: 'wtcrm/journal/delete/' + number,
    method: "delete"
  })
}

export function getMyLogList(params) {
  return request({
    url: ' wtcrm/journal/pageList',
    method: "get",
    params: params
  })
}

export function getStateList(params) {
  return request({
    url: 'wtcrm/journal/listState',
    method: "get",
    params: params
  })
}

// 编辑过期时间
export function editJournalTime(params) {
  return request({
    url: 'wtcrm/journal/editDayFit',
    method: "put",
    data: params
  })
}
// 过期天数设置
export function editDayFitTime(params) {
  return request({
    url: '  wtcrm/journal/overDayFit',
    method: "put",
    data: params
  })
}

// 获取设置时间
export function getDataSet() {
  return request({
    url: 'wtcrm/journal/fitDetail',
    method: "get"
  })
}

export function getCountList(params) {
  return request({
    url: 'wtcrm/journal/pageDataStatistics',
    method: "GET",
    params: params
  })
}

export function getDetailList(params) {
  return request({
    url: 'wtcrm/journal/detail',
    method: "get",
    params: params
  })
}


// 获取我的日志统计
export function getLogCount(params) {
  return request({
    url: 'wtcrm/journal/completeCount',
    method: "get",
    params:params.yearMonth
  })
}





