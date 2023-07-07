import request from "axios";

// 获取sts token
export function getFileRepositorySts() {
  return request({
    url: '/wtcrm/tmCustomerResource/getFileRepositorySts',
    method: 'get'
  })
}







