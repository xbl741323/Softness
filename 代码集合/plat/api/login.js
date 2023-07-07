import request from '@/plugins/request'
// 手机号登录
export function newLogin(param){
    return request({
        url:'/pcloginUser/loginBySMS',
        method:'post',
        data:param
    })
};

// 账户名登录
export function accountLogin(param){
    return request({
        // url:'/uims/account/login',
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

export function bindWechat(param){
    return request({
        url:'/uims/account/bind',
        method:'post',
        data:param
    })
};

// 获取微信登录url
export function getQrcode(params){
    return request({
        // url:'/msg/wx/qrcode',
        url:'/pcloginUser/getWxAuthorizeUrl',
        method:'GET',
        params:params
    })
};

// 获取微信授权登录状态
export function  wechatLogin(obj){
    return request({
        url:'/pcloginUser/wxLogin',
        // url:'/uims/account/wx/auth',
        method:'post',
        data: obj
    })
};

// 微信绑定登录-账号名密码校验
export function wxBind(param){
    return request({
        url:'/pcloginUser/wxBind/getAccountList',
        method:'post',
        data:param
    })
};

// 微信绑定登录
export function wxBindLogin(param){
    return request({
        url:'/pcloginUser/wxBindLogin',
        method:'post',
        data:param
    })
};

// 微信解绑
export function delWechatBind(param){
    return request({
        url:'/uims/account/unbind',
        method:'post',
        params:param
    })
}

// 获取图形验证码
export function getSecurityCode(){
    return request({
        url:'/pcloginUser/getCode',
        // url:'/uims/account/securityCode',
        method:'get'
    })
}

export function checkUser(mobilephone) {
    return request({
        url: '/uims/account/checkUser/' + mobilephone,
        method: 'get',
    });
};

// 获取用户信息
export function getUserInfo(){
    return request({
        url:'/pcTmUser/getMyAccountInfo',
        method:'get'
    })
}
export function checkExist(mobilephone) {
    return request({
        url: '/uims/account/exist/' + mobilephone,
        method: 'get',
    });
};

// 退出登录
export function logOut() {
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


export function getInviteUserIdByCode(obj) {//获取推广码员工id
    return request({
        url: '/pcTmUser/getInviteUserIdByCode',
        method: 'get',
        params: obj
    });
};