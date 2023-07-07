import request from '~/utils/request'

// 技术成果收藏列表
// export function getResultCollectList(params) {
//     return request({
//         url: '/collectionAchievement/getAchievementCollectionPage',
//         method: 'post',
//         data: params
//     })
// };
export function getLetter(obj) {
    return request({
        url: '/authentication/tupian',
        method: 'post',
        data: obj
    })
}

// export function submitAuth(obj) {
//     return request({
//         url: '/authentication/appliAuthentication',
//         method: 'post',
//         data: obj
//     })
// }
// 提交单位认证
export function submitAuth(params, resetStatus) {
    let url = resetStatus == true ? 'againAddAuthCompany' : 'addAuthCompany'
    return request({
      url: `/pcfddAut/${url}`,
      method: 'post',
      data: params
    })
  }
  // 提交个人认证
export function submitPersonAuth(params, resetStatus) {
    let url = resetStatus == true ? 'againAddAuthPerson' : 'addAuthPerson'
    return request({
      url: `/pcfddAut/${url}`,
      method: 'post',
      data: params
    })
  }
  // 获取认证状态
export function getAuthStatus() {
    return request({
      url: '/pcfddAut/getAutStatus',
      method: 'get'
    })
  }
export function checkAuth(obj) {
    return request({
        url: '/authentication/checkAuth',
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
export function getResultCollectList(params) {
    return request({
        url: '/collectionAchievement/getAchievementCollectionPageApp',
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
// export function getNeedCollectList(params) {
//     return request({
//         url: '/collectionRequirement/getRequirementCollectionPage',
//         method: 'post',
//         data: params
//     })
// };
export function getNeedCollectList(params) {
    return request({
        url: '/collectionRequirement/getRequirementCollectionPageApp',
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

// 历史记录
export function getHistoryList(params) {
    return request({
        url: '/collection/getSearchKeyList',
        method: 'post',
        data: params
    })
}

// 身份证校验
export function checkPersonalAuth(obj){
    return request({
        url: '/authentication/checkPersonalAuth',
        method: 'post',
        data: obj
    })
}


// 阿里云开启
export function getAliUrl(obj){
    return request({
        url: '/authentication/getMetaInfoPhone',
        method: 'post',
        data: obj
    })
}

// 阿里扫码结果
export function getAliResult(obj){
    return request({
        url: '/authentication/getAliFaceResult',
        method: 'post',
        data: obj
    })
}

// 支付宝开启
export function getzfbUrl(obj) {
    return request({
        url: '/authentication/startAuthPhone',
        method: 'post',
        data: obj
    })
}

// 支付宝扫码结果 
export function getzfbResult(obj) {
    return request({
        url: '/authentication/getAuthPhone',
        method: 'post',
        data: obj
    })
}

//根据条件统计不同状态的订单量
export function statisticsOrderNumForFront(obj) {
    return request({
        url: '/tmOrder/statisticsOrderNumForFront',
        method: 'post',
        data: obj
    })
}

export function statisticsOrderNum(obj) {
    return request({
        url: '/tmOrder/statisticsOrderNum',
        method: 'post',
        data: obj
    })
}