import request from '@/router/axios'
export function getIndustryList(code){
  return request({
    url: '/wtcrm/drop/'+code,
    method: 'get'
  })
}
export function getType(code){
  return request({
    url: '/wtcrm/dictionary/getListByType',
    method: 'post',
    data:code
  })
}
export function addAchievement(code){
  return request({
    url: '/wtcrm/achievement/addAchievement',
    method: 'post',
    data:code
  })
}
//成果名称查重
export function checkAchievementName(data){
  return request({
    url: '/wtcrm/achievement/checkAchievementName?name='+data,
    method: 'get'
  })
}
//编辑时成果名称查重
export function checkAchievementNameEdit(data,id){
  return request({
    url: '/wtcrm/achievement/checkAchievementNameEdit?name='+data+'&id='+id,
    method: 'get'
  })
}
//编辑后保存
export function editAchievement(code){
  return request({
    url: '/wtcrm/achievement/editAchievement',
    method: 'post',
    data:code
  })
}