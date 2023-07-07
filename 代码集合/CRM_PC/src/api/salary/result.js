import request from 'axios'

//结果值分页列表
export function result(params) {
  return request({
    url:'/admin/tmResultName/pageList',
    method: 'get',
    params: params
  })
}

//删除结果值
export function del(params) {
  return request({
    url:'/admin/tmResultName/deleteById',
    method: 'delete',
    params: params
  })
}

//新增-编辑结果值
export function addOrEditResult(params, operate) {
  return request({
    url: operate ? '/admin/tmResultName/add' : '/admin/tmResultName/edit',
    method: operate ? 'post' : 'put',
    data: params
  })
}

