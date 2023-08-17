import request from './reuqest'

// 登录接口
export function loginOperate(params) {
  return request({
    url: '/user/login',
    method: 'post',
    data: params
  });
}

// 注销接口
export function logout() {
  return request({
    url: '/user/logout',
    method: 'get',
  });
}

// 获取产品列表
export function productList(params) {
  return request({
    url: '/prod/pageProdByKey',
    method: 'get',
    params: params
  });
}

// 添加/编辑产品信息
export function setProduct(status, params) {
  if (status) {
    return request({
      url: '/prod/addProd',
      method: 'post',
      data: params
    });
  } else {
    return request({
      url: '/prod/modProd',
      method: 'put',
      data: params
    });
  }
}

// 删除产品信息
export function delProduct(id) {
  return request({
    url: `/prod/remove/${id}`,
    method: 'delete'
  });
}

// 修改账户密码信息
export function updatePwd(params) {
  return request({
    url: `user/modPassword`,
    method: 'put',
    data: params
  });
}




