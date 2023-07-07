import request from '@/plugins/request'
// 忘记密码校验
export function forgetPwdCheck(param) {
  return request({
    url: '/pcTmUser/forgetPwdCheck',
    method: 'POST',
    data: param
  });
};

// 忘记密码重置
export function forgetPwdReset(param) {
  return request({
    url: '/pcTmUser/forgetPwdReset',
    method: 'POST',
    data: param
  });
};
// 找回账号
export function findAccount(param) {
  return request({
    url: '/pcTmUser/recoverAccount',
    method: 'POST',
    data: param
  });
};

export function changePassword(param) {
    return request({
      url: '/pcTmUser/changePwd',
      method: 'PUT',
      data: param
    });
  };

  export function securityCode() {
    return request({
      url: '/uims/account/securityCode',
      method: 'GET'
    });
  };

  export function checkExist(mobilephone) {
    return request({
      url: '/uims/account/exist/' + mobilephone,
      method: 'get',
    });
  };
//全局搜索
  export function globalSearch(type) {
    return request({
      url: '/search' ,
      method: 'get',
      params:type
    });
  };

  // export function universalSearch(data) {
  //   return request({
  //     url: '/es/search' ,
  //     method: 'post',
  //     data: data
  //   });
  // };

  export function universalSearch(data) {
    return request({
      url: '/product/spu/pageGlobalSpu' ,
      method: 'post',
      data: data
    });
  };

  export function tree(param) {
    return request({
      url: '/product/category/tree' ,
      method: 'post',
      data: param
    });
  };

  //全局搜索服务产品搜索
  export function pageGlobalSpu(param) {
    return request({
      url: '/product/spu/pageGlobalSpu' ,
      method: 'post',
      data: param
    });
  };
  
  //全局搜索服务产品搜索
  export function countGlobalSpu(param) {
    return request({
      url: '/product/spu/countGlobalSpu' ,
      method: 'post',
      data: param
    });
  };

  // 主体账户名是否存在校验
  export function userNameCheck(data) {
    return request({
      url: '/pcTmUser/userNameCheck/' + data,
      method: 'get',
    });
  };

  // 管理员-个人身份真实性验证
  export function authByOnlyPerson(data) {
    return request({
      url: '/pcfddAut/authByOnlyPerson',
      method: 'post',
      data: data
    });
  };

  // 根据交易号获取身份认证状态
  export function getAuthPersonStatus(data) {
    return request({
      url: '/pcfddAut/getAuthPersonStatus/'+data,
      method: 'get',
    });
  };

   // 用户身份验证成功后，重置密码
   export function updatePwdByAuth(data) {
    return request({
      url: '/pcTmUser/updatePwdByAuth',
      method: 'put',
      data: data
    });
  };