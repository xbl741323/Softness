import request from '@/router/axios'


//栏目设置
export function addColumn(params) {
    return request({
        url: '/wtcrm/program/add',
        method: 'post',
        data: params
    })
}

export function getColumnList(params) {
    return request({
        url: '/wtcrm/program/list?size=' + params.size + '&start=' + params.start,
        method: 'get',
    })
}

export function editColumn(params) {
    return request({
        url: '/wtcrm/program/change',
        method: 'put',
        data: params
    })
}

export function deleteColumn(id) {
    return request({
        url: '/wtcrm/program/delete/' + id,
        method: 'delete'
    })
}

export function moveColumn(params) {
    return request({
        url: '/wtcrm/program/move',
        method: 'put',
        data: params
    })
}
export function getSiderList() {
    return request({
        url: '/wtcrm/program/manageList',
        method: 'get',
    })
}

//栏目文章
export function addArticle(params) {
    return request({
        url: '/wtcrm/programArticle/add',
        method: 'post',
        data: params
    })
}

export function editArticle(params) {
    return request({
        url: '/wtcrm/programArticle/change',
        method: 'put',
        data: params
    })
}

export function deleteArticle(params) {
    return request({
        url: '/wtcrm/programArticle/delete',
        method: 'delete',
        data: params
    })
}

export function articleDetail(id) {
    return request({
        url: '/wtcrm/programArticle/detail/' + id,
        method: 'get'
    })
}

export function articleList(params) {
    return request({
        url: '/wtcrm/programArticle/list',
        method: 'post',
        data: params
    })
}

export function changeArticleSatus(params) {
    return request({
        url: '/wtcrm/programArticle/changeOne',
        method: 'put',
        data: params
    })
}

export function batchDelete(params) {
    return request({
        url: '/wtcrm/programArticle/batchDel',
        method: 'delete',
        data: params
    })
}

export function getRecords(id) {
    return request({
        url: '/wtcrm/programArticle/recode/' + id,
        method: 'get'
    })
}


export function checkName(params) {
    return request({
        url: '/wtcrm/program/checkName',
        method: 'post',
        data: params
    })
}

export function previewColumn(params) {
    return request({
      url: '/wtcrm/policy/view ',
      method: 'post',
      data: params
    })
  }




