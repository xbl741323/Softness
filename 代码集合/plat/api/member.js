import request from '@/plugins/request'

export function getCollecPro(params) {
    return request({
        url: '/collection/xmsb',
        method: 'post',
        data: params
    })
};

export function getCollectPol(params) {
    return request({
        url: '/collection/wzzc',
        method: 'post',
        data: params
    })
};

export function setInfo(params) {
    return request({
        url: '/uims/account',
        method: 'put',
        data: params
    })
};

export function getSelectData(type) {
    return request({
        url: '/uims/dropdown/' + type,
        method: 'get'
    })
};
// 获取账户信息列表
export function getUserDetail() {
    return request({
        // url: '/uims/account/detail',
        url: '/pcTmUser/getMyAccountInfo',
        method: 'get'
    })
};

// 修改手机号
export function changePhone(params) {
    return request({
        // url: '/uims/account/changeMoilephone',
        url:'/pcTmUser/changeMobile',
        method: 'put',
        data: params
    })
};

// 校验验证码
export function checkCode(params) {
    return request({
        url: '/msg/sms/checkCode',
        method: 'post',
        params: params
    })
};

// 校验手机号完整性
export function checkMobile(params) {
    return request({
        url: '/pcTmUser/checkMobile',
        method: 'get',
        params: params
    })
};
// 校验密码
export function checkPassword(params) {
    return request({
        url: '/pcTmUser/checkPwd',
        method: 'POST',
        data: params
    })
};
// 账号信息-绑定微信
export function wxBind(params) {
    return request({
        url: '/pcTmUser/wxBind',
        method: 'POST',
        data: params
    })
};
// 账号信息-微信解绑
export function wxUnbind() {
    return request({
        url: '/pcTmUser/wxUnBind',
        method: 'PUT',
    })
};

// 上传头像
export function uploadUrl(params) {
    return request({
        url: '/pcTmUser/uploadDiyLogoUrl',
        method: 'POST',
        data:params
    })
};

// 修改基本账户信息
export function updateBaseInfo(params) {
    return request({
        url: '/pcTmUser/updateAccountBaseInfo',
        method: 'PUT',
        data:params
    })
};

export function getCollectList(params) {
    return request({
        url: '/collection/list',
        method: 'post',
        data: params
    })
};



// 技术成果收藏列表
export function getResultCollectList(params) {
    return request({
        url: '/collectionAchievement/getAchievementCollectionPage',
        method: 'post',
        data: params
    })
};
export function getCountResultCollectList(params) {
    return request({
        url: '/collectionAchievement/getCollectionStatistic',
        method: 'post',
        data: params
    })
};
export function cancelResult(params) {
    return request({
        url: '/collectionAchievement/cancelAchievemenCollectiontBatch',
        method: 'post',
        data: params
    })
};


// 技术需求收藏列表
export function getNeedCollectList(params) {
    return request({
        url: '/collectionRequirement/getRequirementCollectionPage',
        method: 'post',
        data: params
    })
};
export function getCountNeedCollectList(params) {
    return request({
        url: '/collectionRequirement/getCollectionStatistic',
        method: 'post',
        data: params
    })
};
export function cancelNeed(params) {
    return request({
        url: '/collectionRequirement/cancelRequirementCollectiontBatch',
        method: 'post',
        data: params
    })
};


export function getAreaList() {
    return request({
        url: '/area/tree',
        method: 'get'
    })
};

export function batchDelete(params) {
    return request({
        url: '/collection/batchDelete',
        method: 'post',
        data: params
    })
}

export function batchDeleteColl(params) {
    return request({
        url: '/collection/batchDeleteCollection',
        method: 'post',
        data: params
    })
}

export function getLetter(obj) {
    return request({
        url: '/authentication/tupian',
        method: 'post',
        data: obj
    })
}

export function submitAuth(obj) {
    return request({
        url: '/authentication/appliAuthentication',
        method: 'post',
        data: obj
    })
}

export function startAuth(obj) {
    return request({
        url: '/authentication/startAuth',
        method: 'post',
        data: obj
    })
}

export function getAuth(obj) {
    return request({
        url: '/authentication/getAuth',
        method: 'post',
        data: obj
    })
}

export function getAuthentication(obj) {
    return request({
        url: '/authentication/getAuthentication',
        method: 'get',
        params: obj
    })
}

export function checkAuth(obj){
    return request({
        url: '/authentication/checkAuth',
        method: 'post',
        data: obj
    })
}

export function upload(obj){
    return request({
        url: '/authentication/upload',
        method: 'post',
        data: obj
    })
}

export function getZfbAuth(obj){
    return request({
        url: '/authentication/getAuth',
        method: 'post',
        data: obj
    })
}

export function getMetaInfoUrl(obj){
    return request({
        url: '/authentication/getMetaInfo',
        method: 'post',
        data: obj
    })
}

export function getResult(obj){
    return request({
        url: '/authentication/getResult',
        method: 'post',
        data: obj
    })
}

export function checkPersonalAuth(obj){
    return request({
        url: '/authentication/checkPersonalAuth',
        method: 'post',
        data: obj
    })
}

export function receiveList(obj){//获取收件地址
    return request({
        url: '/receiveAddress/getList',
        method: 'get',
        params: obj
    })
}

export function addAddress(obj){//添加收件地址
    return request({
        url: '/receiveAddress/add',
        method: 'post',
        data: obj
    })
}

export function submitOrder(obj){//提交订单
    return request({
        url: '/order/submit',
        method: 'post',
        data: obj
    })
}

export function submitPay(obj){// 获取支付链接
    return request({
        url: '/order/payOrder',
        method: 'post',
        data: obj
    })
}

export function deteleOrder(obj){
    return request({
      url:'/receiveAddress/deleteReceiveAddressById',
      method:'put',
      data:  obj
    })
}

export function defaultOrder(obj){
    return request({
        url:'/receiveAddress/setReceiveAddressDefault ',
        method:'put',
        data:  obj
      })
}
export function editAddress(obj){//编辑收获地址
    return request({
        url: '/receiveAddress/updateReceiveAddress',
        method: 'put',
        data: obj
    })
}
// 服务产品列表
export function getCollList(params) {
    return request({
        url: '/collection/getCollectionList',
        method: 'post',
        data: params
    })
};

// 统计数量
export function getCount(params) {
    return request({
        url: '/collection/getCollectionNumbers',
        method: 'post',
        data: params
    })
};