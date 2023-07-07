import {
  request
} from "../common/request.js"

module.exports = {
  // 获取收件地址列表数据
  getAddressList: (data) => {
    return request('get', '/receiveAddress/getList', data)
  },
  // 添加收件地址
  addAddress: (data) => {
    return request('post', '/receiveAddress/add', data)
  },
  // 删除收件地址
  deleteAddress: (data) => {
    return request('post', '/receiveAddress/deleteReceiveAddressById', data)
  },
  // 更新收件地址详情
  updateAddress: (data) => {
    return request('post', '/receiveAddress/updateReceiveAddress', data)
  },
  // 获取收件地址详情
  getAddressDetail: (data) => {
    return request('post', '/receiveAddress/selectReceiveAddress', data)
  },
  // 设置默认地址
  setDefaultAddress: (data) => {
    return request('post', '/receiveAddress/setReceiveAddressDefault', data)
  },
}