import request from '@/router/axios'
//指定权限列表
export function getList(obj) {
    return request({
    url: '/wtcrm/permission/list',
    method: 'post',
    data:obj
 })
}

//指定权限编辑
export function editAppoint(obj) {
    return request({
    url: '/wtcrm/permission/edit',
    method: 'post',
    data:obj
  })
}

