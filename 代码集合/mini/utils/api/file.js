import {
  request
} from "../common/request.js"

module.exports = {
  // 获取文档列表数据
  fileList: (data) => {
    return request('post', '/esDoc/esPageDoc', data)
  },

  // 获取文档详情数据
  docDetail: (data) => {
    return request('get', '/doc/getDoc', data)
  },

  // 文档下载
  docDownload: (data) => {
    return request('get', '/doc/download', data)
  },

  // 文档预览
  docPreview: (data) => {
    return request('post', '/doc/preview', data)
  },

  // 保存订单
  saveFileOrder: (data) => {
    return request('post', '/tmFileOrder/saveTmFileOrder', data)
  },

  // 微信支付
  miniPayWx: (data) => {
    return request('post', '/tmFileOrder/miniPayWx', data, true)
  },
}