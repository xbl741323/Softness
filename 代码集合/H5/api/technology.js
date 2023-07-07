import request from '~/utils/request'

export function getResultList(params){
    return request({
        url: '/achievement/getAchievementPage',
        method: 'post',
        data: params
    })
}

export function getResultDetail(params){
    return request({
        url: '/achievement/getAchievementDetail',
        method: 'post',
        data: params
    })
}

export function getNeedList(params){
    return request({
        url: '/requirement/getRequirementPage',
        method: 'post',
        data: params
    })
}

export function getNeedDetail(params){
    return request({
        url: '/requirement/getRequirementDetail',
        method: 'post',
        data: params
    })
}

export function getSelect(params){
    return request({
        url: '/dictionary/getListByType',
        method: 'post',
        data: params
    })
}

export function getSelectIndustry(data){
    return request({
        url:'/option/selection/'+data,
        method:'GET'
    })
}


export function collectNeed(params){
    return request({
        url:'/collectionRequirement/addRequirementCollect',
        method:'post',
        data:params
    })
}

export function cancelCollectNeed(params){
    return request({
        url:'/collectionRequirement/cancelRequirementCollect',
        method:'post',
        data:params
    })
}

export function collectResult(params){
    return request({
        url:'/collectionAchievement/addAchievementCollect',
        method:'post',
        data:params
    })
}

export function cancelCollectResult(params){
    return request({
        url:'/collectionAchievement/cancelAchievementCollect',
        method:'post',
        data:params
    })
}