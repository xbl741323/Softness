import request from '~/utils/request'

export function getArea(data){
    return request({
        url:'/area/city/'+data,
        method:'GET'
    })
}
//手机端用户基本信息下拉框
export function getDropdown(data){
    return request({
        url:'/uims/dropdown/'+data,
        method:'GET'
    })
}
//新手机号换绑
export function changePho(params) {
    return request({
        url: '/uims/account/changeMoilephone',
        method: 'POST',
        data: params
    })
}
//旧手机号短信验证
export function checkPho(params) {
    return request({
        url: '/msg/sms/checkCode',
        method: 'POST',
        params: params
    })

    
}
//获取省市区联动
export function getProvince(data){
    return request({
        url:"/area/sub/"+data,
        method:'GET'
    })
}

//获取省市区联动
export function getProvince1(){
    return request({
        url:"/area/tree",
        method:'GET'
    })
}
//保存用户基本信息修改
export function setInfo(params) {
    return request({
        url: '/pcTmUser/updateAccountBaseInfo',
        method: 'put',
        data: params
    })
};
//个人中心获取用户基本信息
export function getUserDetail() {
    return request({
        url: '/uims/account/detail',
        method: 'get'
    })
}

// export function getCollectList(params) {
//     return request({
//         url: '/collection/list',
//         method: 'POST',
//         data: params
//     })
// }

export function getCollectList(params) {
    return request({
        url: '/collection/listApp ',
        method: 'POST',
        data: params
    })
}

//上传头像
export function uploadDiyLogoUrl(params) {
    return request({
        url: '/pcTmUser/uploadDiyLogoUrl',
        method: 'POST',
        data: params
    })
}
