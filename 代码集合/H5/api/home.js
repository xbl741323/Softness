import request from '~/utils/request'

export function getPolicyClassList(data){
    return request({
        url:'/policy/compile?areaNo='+data.areaNo + '&size='+ data.size,
        method:'GET'
    })
}

export function getTroubleClassList(data){
    return request({
        url:'/policy/question?areaNo='+data.areaNo + '&size='+ data.size,
        method:'GET'
    })
}

export function getIndustryClassList(data){
    return request({
        url:'/policy/Information?areaNo='+data.areaNo + '&size='+ data.size,
        method:'GET'
    })
}
export function getProjectList(data){
    return request({
        url:'/policy/project?areaNo='+data.areaNo + '&source='+ data.source,
        method:'GET'
    })
}

export function getCity(data){
    return request({
        url:'/area/city?areaNo='+data,
        method:'GET'
    })
}

export function recommendProject(size){
    return request({
        url:'/policy/recommendProject/'+size,
        method:'GET'
    })
}

export function homeProject(size){
    return request({
        url:'/policy/appProject/'+size,
        method:'GET'
    })
}

export function getPolicyList(obj){
    return request({
        url:'/policy/notice?areaNo='+obj.areaNo +'&size='+obj.size,
        method:'get',
    })
}

export function getLocation(data){
    return request({
        url:'area/location?identification='+data,
        method:'get'
    })
}

export function getProvince(){
    return request({
        url:'/area/switchProvince',
        method:'get'
    })
}

export function getBannerList(type) {
    return request({
      url: '/banner/'+type,
      method: 'get',
    })
}

export function getNewArea(){
    return request({
        url:'/tcRegion/tree',
        methos:'GET'
    })
}