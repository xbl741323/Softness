import request from '@/plugins/request'

export function getArea(data) {
    return request({
        url: '/area/city?areaNo=' + data,
        method: 'GET'
    })
}

export function getPolicyList(obj) {
    return request({
        url: '/policy/notice?areaNo=' + obj.areaNo + '&size=' + obj.size,
        method: 'get'
    })
}

export function getLocation(data) {
    return request({
        url: '/area/location?identification=' + data,
        method: 'get'
    })
}

// export function getAssembly(obj) {
//     return request({
//         url: '/policy/compile?areaNo=' + obj.areaNo + '&size=' + obj.size
//     })
// }
export function getAssembly(obj) {
    return request({
        url: '/policy/compileAll?areaNo=' + obj.areaNo + '&size=' + obj.size
    })
}

export function getIndustry(obj) {
    return request({
        url: '/policy/InformationPc?areaNo=' + obj.areaNo + '&size=' + obj.size
    })
}

export function getAnswer(obj) {
    return request({
        url: '/policy/question?areaNo=' + obj.areaNo + '&size=' + (obj.size)
    })
}

export function getProvince() {
    return request({
        url: '/area/switchProvincePC'
    })
}

export function getProjectList(obj) {
    return request({
        url: '/policy/project?areaNo=' + obj.areaNo + '&source=' + obj.source,
        method: 'GET'
    })
}

export function getserverList() {
    return request({
        url: '/serviceClass/allInfo',
        method: 'GET'
    })
}

export function getHotSearch(data) {
    return request({
        url: '/hotSearch/' + data,
        method: 'GET'
    })
}

export function banner(data) {
    return request({
        url: '/banner/' + data,
        method: 'GET'
    })
}

export function getProgram() {
    return request({
        url: '/program',
        method: 'GET'
    })
}

export function getContent(data) {
    return request({
        url: '/program/' + data,
        method: 'GET'
    })
}


export function getLeft() {
    return request({
        url: '/program',
        method: 'GET'
    })
}

export function getRight(data) {
    return request({
        url: '/program/page',
        method: 'GET',
        params: data
    })
}

export function getRightdetail(data) {
    return request({
        url: '/program/getById?id=' + data,
        method: 'GET'
    })
}

export function getResultList(params){
    return request({
        url: '/achievement/getAchievementPage',
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
 
export function getBtnCode(data) {
    return request({
        url: '/WtIndex/sms/'+data.phoneNumber+'/'+data.origin,
        method: 'get',
    })
}

export function getConsult(params) {
    return request({
        url: '/WtIndex/consult',
        method: 'post',
        params:params
    })
}

export function getThree() {
    return request({
        url: '/WtIndex/appoint',
        method: 'get',
    })
}

export function getFirst() {
    return request({
        url: '/WtIndex/selectTopWhereAreaIsNation',
        method: 'get',
    })
}

export function getNewProject(data){
    return request({
        // url:'/policy/index/list',
        url:'/product/category/tree',
        method:'post',
        data:data
    })
}

// 浏览量
export function getView(data) {
    return request({
        url: '/program/add?id=' + data,
        method: 'GET'
    })
}

export function getService(){
    return request({
        url: '/pagehome/serviceclass',
        method: 'post'
    })
}

export function getProduct(){
    return request({
        url: '/pagehome/product',
        method: 'post'
    })
}

export function getJInxuan() {
    return request({
        url: '/WtIndex/selectservice',
        method: 'GET'
    })
}