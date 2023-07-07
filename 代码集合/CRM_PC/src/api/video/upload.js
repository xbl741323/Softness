import request from 'axios'

// 获取凭证
export function getVoucher(params) {
  return request({
    url: 'wtcrm/vod/createUploadVideo',
    method: "post",
    data: params
  })
}

// 刷新凭证
export function refreshVoucher(params) {
  return request({
    url: 'wtcrm/vod/refreshUploadVideo',
    method: "post",
    data: params
  })
}

// 获取视频url
export function getVideoUrl(params) {
  return request({
    url: 'wtcrm/vod/getPlayInfo',
    method: "post",
    data: params
  })
}

