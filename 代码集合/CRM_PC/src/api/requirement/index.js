import request from '@/router/axios'
import qs from 'qs'
//需求名称查重
export function checkRequirementName(data){
  return request({
    url: '/wtcrm/yg-requirement/checkRequirementName?name='+data,
    method: 'get'
  })
}
//编辑时需求名称查重
export function checkRequirementNameEdit(data,id){
  return request({
    url: '/wtcrm/yg-requirement/checkRequirementNameEdit?name='+data+'&id='+id,
    method: 'get'
  })
}
//新增
export function addRequirement(code){
  return request({
    url: '/wtcrm/yg-requirement/addRequirement',
    method: 'post',
    data:code
  })
}
//编辑
export function editRequirement(code){
  return request({
    url: '/wtcrm/yg-requirement/editRequirement',
    method: 'post',
    data:code
  })
}
//列表
export function getRequirementList(obj){
  return request({
    url:'/wtcrm/yg-requirement/getRequirementPage',
    method:'post',
    data: qs.stringify(obj)
  })
}
//获取状态数据
export function getTotalStatistic(){
  return request({
    url:'/wtcrm/yg-requirement/getTotalStatistic',
    method:'get',
  })
}
//上架
export function onSaleRequirement(obj){//上架成果
  return request({
    url:'/wtcrm/yg-requirement/onSaleRequirementStatus',
    method:'post',
    data: obj
  })
}
//下架
export function offSaleRequirement(obj){//下架成果
  return request({
    url:'/wtcrm/yg-requirement/offSaleRequirementStatus',
    method:'post',
    data: qs.stringify(obj)
  })
}
//删除成果
export function delRequirement(obj){
  return request({
    url:'/wtcrm/yg-requirement/deleteRequirementBatch',
    method:'post',
    data: qs.stringify(obj)
  })
}

//删除成果
export function onlydelRequirement(obj){
    return request({
      url:'/wtcrm/yg-requirement/deleteRequirement',
      method:'post',
      data: qs.stringify(obj)
    })
  }
//详情
export function getDetails(obj){
  return request({
    url:'/wtcrm/yg-requirement/getRequirementtDetail',
    method:'post',
    data:obj
  })
}
//操作记录
export function getRequirementRecords(obj){
  return request({
    url:'/wtcrm/yg-requirement-log/getRequirementLogPage',
    method:'post',
    data: qs.stringify(obj)
  })
}