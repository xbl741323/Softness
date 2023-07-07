import request from 'axios'
export function accountDisabled(obj) {
    return request({
      url: '/wtuims/tmuser/accountDisabled',
      method: 'put',
      data: obj
    })
  }