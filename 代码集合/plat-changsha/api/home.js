import request from '@/plugins/request'

export function getBtnCode(phone,code) {
    return request({
        url: '/JsIndex/sms/'+phone+'/'+code,
        method: 'get',
    })
}

export function getConsult(params) {
    return request({
        url: '/JsIndex/consult',
        method: 'post',
        params:params
    })
}

export function getColumnList(params) {
    return request({
        url: '/hfxl/column/listColumn',
        method: 'get',
        params:params
    })
}

// 获取导航详情
export function getColumnDetail(id) {
    return request({
        url: '/hfxl/column/innerGetColumnById?id='+id,
        method: 'get'
    })
}
// 前台-获取友情链接列表
export function getListFriendLink(params) {
  return request({
    url: "/hfxl/tmFriendLink/listFriendLink",
    method: "get",
    params
  });
}
