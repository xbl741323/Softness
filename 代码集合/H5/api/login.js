import request from '~/utils/request'

//发送验证码
export function sendCode(mobilephone) {
    return request({
      url: '/msg/sms/'+ mobilephone,
      method: 'get'
    });
};

export function phoneRegist(param){
  return request({
      url:'/uims/account/reg',
      method:'post',
      data:param
  })
}

//忘记密码
export function findPassword(param){
  return request({
      url:'/uims/account/forgetPassword',
      method:'post',
      data:param
  })
}

export function checkUser(mobilephone) {
  return request({
    url: '/uims/account/checkUser/' + mobilephone,
    method: 'get',
  });
};

export function checkExist(mobilephone) {
  return request({
    url: '/uims/account/exist/' + mobilephone,
    method: 'get',
  });
};

export function layout() {
  return request({
    url: '/pcloginUser/logOut',
    method: 'post',
  });
};

export function embed(data) {//埋点
  return request({
      url: '/embed/'+data,
      method: 'post',
  });
};

// 获取账号信息
export function getUserInfo() {
  return request({
    url:'/pcTmUser/getMyAccountInfo',
    method:'get'
  })
};

// 获取验证码
export function securityCode() {
  return request({
    url:'/pcloginUser/getCode',
    method:'get'
})
};

// 手机号登录
export function phoneLogin(param){
  return request({
    url:'/pcloginUser/loginBySMS',
    method:'post',
    data:param
  })
}

// 检测用户名是否存在
export function checkUsernameExist(username){
  return request({
      url:'/pcloginUser/duplicatesCheck/'+username,
      method:'GET'
  })
} 

// 注册
export function userRegister(param){
  return request({
      url:'/pcloginUser/userRegister',
      method:'post',
      data:param
  })
}

// 账户名登录
export function accountLogin(param){
  return request({
      url:'/pcloginUser/loginByPwd',
      method:'post',
      data:param
  })
};

// 选择登录账户
export function chooseAccount(param){
  return request({
      url:'/pcloginUser/chooseAccount',
      method:'post',
      data:param
  })
};