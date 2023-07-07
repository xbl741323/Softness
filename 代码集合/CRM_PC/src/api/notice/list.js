import request from '@/router/axios'
export function noticeList(query) {
  return request({
    url: '/wtcrm/announcement/getList',
    method: 'post',
    data: query
  })
}
export function delNotice(number) {
  return request({
    url: '/wtcrm/announcement/delete/'+number,
    method: 'delete',
  })
}

export function batchDel(query) {
  return request({
    url: '/wtcrm/announcement/batchDel',
    method: 'delete',
    data: query
  })
}

export function dropBelong(type) {
  return request({
    url: '/wtcrm/dropdown/'+type,
    method: 'get',
  })
}