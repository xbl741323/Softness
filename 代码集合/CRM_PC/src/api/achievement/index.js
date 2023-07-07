import request from '@/router/axios'
import qs from 'qs'

export function getAchievementList(obj){
  return request({
    url:'/wtcrm/achievement/getAchievementPage',
    method:'post',
    data: qs.stringify(obj)
  })
}

export function getTotalStatistic(){
  return request({
    url:'/wtcrm/achievement/getTotalStatistic',
    method:'get',
  })
}

export function getDetails(obj){
  return request({
    url:'/wtcrm/achievement/getAchievementDetail',
    method:'post',
    data:obj
  })
}

export function getListByType(obj){//获取下拉框数据
  return request({
    url:'/wtcrm/dictionary/getListByType',
    method:'post',
    data: qs.stringify(obj)
  })
}

export function onSaleAchievement(obj){//上架成果
  return request({
    url:'/wtcrm/achievement/onSaleAchievementStatus',
    method:'post',
    data: obj
  })
}

export function offSaleAchievement(obj){//下架成果
  return request({
    url:'/wtcrm/achievement/offSaleAchievementStatus',
    method:'post',
    data: qs.stringify(obj)
  })
}

export function delAchievement(obj){//删除成果
  return request({
    url:'/wtcrm/achievement/deleteAchievementBatch',
    method:'post',
    data: qs.stringify(obj)
  })
}

export function onlydelAchievement(obj){//删除成果
    return request({
      url:'/wtcrm/achievement/deleteAchievement',
      method:'post',
      data: qs.stringify(obj)
    })
  }
  

export function getAchievementRecords(obj){//技术成果-操作记录
  return request({
    url:'/wtcrm/ygAchievementLog/getAchievementLogPage',
    method:'post',
    data: qs.stringify(obj)
  })
}

export function getAchievementsCoverList(){//技术成果-封面设置列表
  return request({
    url: '/wtcrm/recommend/getAchievementRecommendPictureList',
    method: 'post',
  })
}
export function editAchievementCover(obj){//技术成果-编辑封面
  return request({
    url: '/wtcrm/recommend/editAchievementRecommendPicture',
    method: 'post',
    data: obj
  })
}