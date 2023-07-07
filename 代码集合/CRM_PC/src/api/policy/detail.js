import request from '@/router/axios'

export function saveDraft(param, config) {
    let configObj = {
        url: '/wtcrm/policy/saveDraft',
        method: 'post',
        data: param
    };
    if (config && config.headers) {
        configObj.headers = config.headers;
    }
    return request(configObj);
}

export function addNotice(param, config) {
    let configObj = {
        url: '/wtcrm/policy/add',
        method: 'post',
        data: param
    };
    if (config && config.headers) {
        configObj.headers = config.headers;
    }
    return request(configObj);
}

export function editNotice(param, config) {
    let configObj = {
        url: '/wtcrm/policy/edit',
        method: 'put',
        data: param
    };
    if (config && config.headers) {
        configObj.headers = config.headers;
    }
    return request(configObj);
}

export function editProjectFast(param, config) {
    let configObj = {
        url: '/wtcrm/project/edit',
        method: 'put',
        data: param
    };
    if (config && config.headers) {
        configObj.headers = config.headers;
    }
    return request(configObj);
}

export function getDraft() {
    return request({
        url: '/wtcrm/announcement/getDraft',
        method: 'get',
    })
}

export function editDraft(param, config) {
    let configObj = {
        url: '/wtcrm/announcement/edit',
        method: 'post',
        data: param
    };
    if (config && config.headers) {
        configObj.headers = config.headers;
    }
    return request(configObj);
}

export function getDetail(number) {
    return request({
      url: '/wtcrm/policy/getDetail/'+number,
      method: 'get',
    })
}

export function deleteNotice(number) {
    return request({
      url: '/wtcrm/policy/delete/'+number,
      method: 'delete',
    })
}

export function rechecking(para) {
    return request({
      url: '/wtcrm/policy',
      method: 'post',
      data: para
    })
}

export function checkFileName(para) {
    return request({
      url: '/wtcrm/file/checkFileName',
      method: 'post',
      data: para
    })
}

export function checkFileNameList(para) {
    return request({
      url: '/wtcrm/file/checkFileName1',
      method: 'post',
      data: para
    })
}

export function getFileDetail(obj) {
    if(obj.method == 'get'){
        return request({
          url: '/wtcrm/file/'+obj.id,
          method: obj.method,
        })
    }else{
        return request({
            url: '/wtcrm/file',
            method: obj.method,
            data: obj
        })
    }
}

export function releateArticle(obj) {
    return request({
      url: '/wtcrm/doc/pageRelatedArticles',
      method: 'post',
      data:obj
    })
}

export function deleteRelate(obj) {
    return request({
      url: '/wtcrm/doc/delRelatedArticles',
      method: 'delete',
      data: obj,
    })
  }

  
//文件管理详情-文档预览
export function previewDoc(data) {
    return request({
        url: '/wtcrm/doc/preview',
        method: 'post',
        data: data
    })
}

//文件管理详情-文档预览我的
export function previewDocMy(data) {
    return request({
        url: '/wtcrm/doc/previewOfMy',
        method: 'post',
        data: data
    })
}

//文件管理详情-文件详情
export function docDetail(data) {
    return request({
        url: '/wtcrm/doc/getDoc',
        method: 'get',
        params: data
    })
}

//文件管理详情-文件详情我的
export function docDetailMy(data) {
    return request({
        url: '/wtcrm/doc/getDocOfMy',
        method: 'get',
        params: data
    })
}

//文件管理详情-修改文件
export function editDoc(data) {
    return request({
        url: '/wtcrm/doc/modDoc',
        method: 'put',
        data: data
    })
}

//文件管理详情-修改文件我的
export function editDocMy(data) {
    return request({
        url: '/wtcrm/doc/modDocOfMy',
        method: 'put',
        data: data
    })
}
  