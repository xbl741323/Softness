import request from '@/plugins/request'

export function sendcode(data){
    return request({
        url:'/msg/sms/'+data,
        method:'GET'
    })
};

export function registed(param){
    return request({
        url:'/uims/account/reg',
        method:'post',
        data:param
    })
}

//重构用户注册
export function userRegister(param){
    return request({
        url:'/pcloginUser/userRegister',
        method:'post',
        data:param
    })
} 


// 检测账号名是否存在
export function checkUsernameExist(username){
    return request({
        url:'/pcloginUser/duplicatesCheck/'+username,
        method:'GET'
    })
} 

// 老用户完善账号名密码
export function oldUserLogin(data){
    return request({
        url:'/pcTmUser/completeOldUserInfo',
        method:'post',
        data: data
    })
} 

// 发送短信给管理员手机号
export function smsToManager(params){
    return request({
        url:'/pcTmUser/smsToManager',
        method:'get',
        params: params
    })
}

// 管理员账户短信验证码校验
export function smsCheckForManager(authcode){
    return request({
        url:'/pcTmUser/smsCheckForManager/'+authcode,
        method:'get',
    })
}