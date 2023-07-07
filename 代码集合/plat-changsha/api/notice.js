import request from '@/plugins/request'

export function getPolicyList(params) {
  return request({
    url: '/policy/list',
    method: 'post',
    data: params
  })
}

export function getPolicyDetail(params) {
  return request({
    url: '/policy/detail',
    method: 'get',
    params: params
  })
}

export function getSelection(type) {
  return request({
    url: '/policy/selection/' + type,
    methos: 'get'
  })
}

export function getViews(number) {
  return request({
    url: '/policy/pageviews/' + number,
    method: 'put',
  })
}

export function getBnner(bannerType) {
  return request({
    url: '/hfxl/jsbanner/listBannerByType?type='+ bannerType+'&substationId=20',
    method: 'get'
  })
}