import request from '~/utils/request'

// 资讯广场-卧涛问答提问-保存提问
export function saveQuestion(data){
    return request({
        url:'/tmQuestionAnswer/saveQuestion',
        method:'post',
        data: data
    })
  }
  // 资讯广场-分页获取问题
  export function getQuestionList(data){
    return request({
        url:`/tmQuestionAnswer/innerPageQuestion`,
        method:'post',
        data: data
    })
  }
  // 资讯广场-卧涛问答-取消采纳问题回答
  export function acceptAnswer(data){
    return request({
        url:'/tmQuestionAnswer/acceptAnswer',
        method:'post',
        data: data
    })
  }
  // 资讯广场-卧涛问答-点赞，点low
  export function likeAnswer(data){
    return request({
        url:'/tmQuestionAnswer/click',
        method:'post',
        data: data
    })
  }
  // 资讯广场-卧涛问答-分页获取问题回答
  export function getQAList(data){
    return request({
        url:'/tmQuestionAnswer/innerPageTmAnswerVo',
        method:'post',
        data: data
    })
  }

export function getSelection(type) {
    return request({
        url: '/policy/selection/' + type,
        method: 'GET'
    })
}

export function getSelectionName(type) {
    return request({
        url: '/policy/selectionApp/' + type,
        method: 'GET'
    })
}

export function getList(params) {
    return request({
        url: '/policy/PolicyList',
        method: 'POST',
        data: params
    })
}

export function getArtcleDetail(data) {
    return request({
        url: '/policy/detail?number=' + data.number + '&type=' + data.type+'&token='+data.screen+'&app=app',
        method: 'GET'
    })

}

// 获取通知公告详情
export function getNoticeDetail(obj){
    return request({
        url:`/policy/detailByNumber?number=${obj.number}&type=${obj.type}&id=${obj.id}`,
        method:'GET'
    })
}

// 资讯广场通知公告上一篇下一篇
export function getPreAndNext(id){
    return request({
        url:'/policy/getPreAndNext/'+id,
        method:'get',
    })
}

export function getFileList(params) {
    return request({
        url: '/file/list',
        method: 'POST',
        data: params
    })
}

export function downloadFile(data) {
    return request({
        url: '/file/download?url=' + data,
        method: 'get'
    })
}

export function getHotSearch(type) {
    return request({
        url: '/hotSearch/' + type,
        method: 'get'
    })
}

//最新的接口
export function getPolicyList(params) {
    return request({
        url: '/policy/list',
        method: 'post',
        data: params
    })
}

export function collection(obj){
    return request({
        url:'/collection/add',
        method:'post',
        data:obj
    })
}

export function delCollect(obj){
    return request({
        url:'/collection/delColl',
        method:'post',
        data:obj
    })
}

export function views(obj){
    return request({
        url:'/policy/pageviews/'+obj,
        method:'put',
    })
}

export function batchDelete(params){
    return request({
        url:'/collection/batchDelete',
        method:'post',
        data:params
    })
}


// 政策广场es搜索
export function esPagePolicy(data){
    return request({
        url:'/esPolicy/esPagePolicy',
        method:'post',
        data: data
    })
}

// 政策广场行业组下一步es搜索
export function esPageIndustry(data){
    return request({
        url:'/esIndustryInfo/esPageIndustryInfo',
        method:'post',
        data: data
    })
}

// 获取行业资讯详情
export function getIndustryDetail(number){
    return request({
        url:'/industryWeb/getDetail/'+number,
        method:'GET'
    })
}

// 获取推荐产品
export function recommendProducts(params){
    return request({
        url:'/product/spu/listRecommendedProducts?spuIds=' + params.spuIds,
        method:'GET',
    })
}

// 跳转小程序
export function goWechat(){
    return request({
        url:'/wx/generateScheme',
        method:'GET',
    })
}