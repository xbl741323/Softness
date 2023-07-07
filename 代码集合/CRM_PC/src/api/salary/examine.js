import request from 'axios'

export function addPlan(obj) {//新增考核方案
  return request({
    url: '/admin/plan/addPlan',
    method: 'post',
    data: obj
  })
}

export function getPlan(id) {//查询考核方案详情
  return request({
    url: '/admin/plan/getPlan/'+id,
    method: 'get',
  })
}

export function examinePlan(obj) {//考核方案分页列表
  return request({
    url: '/admin/plan/pagePlan',
    method: 'post',
    data: obj
  })
}

export function delPlan(id) {//删除考核方案
  return request({
    url: '/admin/plan/delPlan/'+id,
    method: 'delete',
  })
}

export function modPlan(obj) {//修改考核方案
  return request({
    url: '/admin/plan/modPlan',
    method: 'put',
    data: obj
  })
}

export function addJobTask(obj) {//新增薪酬任务
  return request({
    url: '/admin/job/addJob',
    method: 'post',
    data: obj
  })
}

export function planTask(obj) {//考核任务列表
  return request({
    url: '/admin/job/pageJob',
    method: 'post',
    data: obj
  })
}


export function delJob(id) {//删除考核任务
  return request({
    url: '/admin/job/delJob/'+id,
    method: 'delete',
  })
}


export function getTask(id) {//删除考核任务
  return request({
    url: '/admin/job/getJob/'+id,
    method: 'get',
  })
}

export function editJobTask(obj) {//编辑考核任务
  return request({
    url: '/admin/job/modJob',
    method: 'put',
    data: obj
  })
}

export function modJobStatus(obj) {//修改任务状态
  return request({
    url: '/admin/job/modJobStatus',
    method: 'put',
    params: obj
  })
}


export function detailHead({id},source) {//考核流程详情头部信息
  return request({
    url: source == 'list' ? '/admin/salaryFlow/detailHead/'+id : '/admin/salaryFlow/detailHeadOfMy/'+id,
    method: 'get',
  })
}

export function getPlanDetail(id) {//流程管理-详情-方案详情
  return request({
    url: '/admin/salaryFlow/detail/plan/?flowHandlerIds='+id,
    method: 'get',
  })
}

export function saveFlow(info, operateId, source) {//流程管理-详情-保存草稿/完成录入
  return request({
    url: operateId == 1 ? (source != 'list' ? '/admin/salaryFlow/saveDraftOfMy' : '/admin/salaryFlow/saveDraft' ): (source != 'list' ? '/admin/salaryFlow/saveOfMy' : '/admin/salaryFlow/save'),
    method: 'post',
    data: info
  })
}