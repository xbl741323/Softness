import request from '@/router/axios'

export function policyList(query) {
  return request({
    url: '/wtcrm/policy/getList',
    method: 'post',
    data: query
  })
}

export function batchTransfer(query) {
  return request({
    url: '/wtcrm/policy/batchTransfer',
    method: 'put',
    data: query
  })
}

export function batchCopy(query) {
  return request({
    url: '/wtcrm/policy/batchCopy',
    method: 'put',
    data: query
  })
}

export function recordList(query) {
  return request({
    url: '/wtcrm/policy/record',
    method: 'post',
    data: query
  })
}

export function delNotice(number) {
  return request({
    url: '/wtcrm/policy/delete/' + number,
    method: 'delete',
  })
}

export function batchShowStatus(query) {
  return request({
    url: '/wtcrm/policy/batchShowStatus',
    method: 'put',
    data: query
  })
}

export function batchDelete(query) {
  return request({
    url: '/wtcrm/policy/batchDelete',
    method: 'delete',
    data: query
  })
}

export function dropBelong(type) {
  return request({
    url: '/wtcrm/classSet/drop/' + type + '/' + 1,
    method: 'get',
  })
}

export function listHead() {
  return request({
    url: '/wtcrm/factor/project ',
    method: 'get',
  })
}

export function dropEditData(type) {
  return request({
    url: '/wtcrm/classSet/drop/' + type + '/' + 0,
    method: 'get',
  })
}

export function getFileList(param) {
  if(param.id){
    return request({
      url: '/wtcrm/file',
      method: param.method,
      data:param
    })
  }else{
    return request({
      url: '/wtcrm/file',
      method: param.method,
      params:param
    })
  }
}

export function listChangeStatus(param) {
  return request({
    url: '/wtcrm/policy/changeShowStatus',
    method: 'put',
    data: param
  })
}
export function fileChangeStatus(param) {
  return request({
    url: '/wtcrm/file',
    method: 'put',
    data: param
  })
}

export function upLoad(param, config) {
  let configObj = {
    url: '/wtcrm/file',
    method: 'post',
    data: param
  };
  if (config && config.headers) {
    configObj.headers = config.headers;
  }
  return request(configObj);
}

export function removeFile(data) {
  return request({
    url: '/wtcrm/doc/delDoc',
    method: 'delete',
    data: data,
  });
}

export function removeFileMy(data) {
  return request({
    url: '/wtcrm/doc/delDocOfMy',
    method: 'delete',
    data: data,
  });
}

export function fileDownload(id,no) {
  return request({
    url: '/wtcrm/file/download/' + id+ '/'+ no,
    method: 'get',
    responseType: "blob"
  });
}

export function batchShow(param) {
  return request({
    url: '/wtcrm/doc/modState',
    method: 'put',
    data: param
  });
}

export function batchShowMy(param) {
  return request({
    url: '/wtcrm/doc/modStateOfMy',
    method: 'put',
    data: param
  });
}

export function batchDel(idList,NoList) {
  return request({
    url: '/wtcrm/file/batchDel?fileIds=' + idList+'&fileNumbers='+NoList,
    method: 'delete',
  });
}

export function checkFiles(obj) {
  return request({
    url: '/wtcrm/file/repeat',
    method: 'get',
    params: obj
  });
}

export function getDropPolicy(type) {
  return request({
    url: '/wtcrm/factor/allFactor?type=' + type,
    method: 'get',
  })
}

export function getrapidChange(number) {
  return request({
    url: '/wtcrm/policy/rapidChange?number=' + number,
    method: 'get',
  })
}

export function getListPolicy(type) {
  return request({
    url: '/wtcrm/factor/selection?type=' + type,
    method: 'get',
  })
}

export function getLibraryList(obj) {
  return request({
    url: '/wtcrm/file/replaceFileList',
    method: 'get',
    params:obj
  })
}

export function replace(obj) {
  return request({
    url: '/wtcrm/file/replace',
    method: 'put',
    data:obj
  })
}

export function Batchreplace(obj) {
    return request({
      url: '/wtcrm/file/replaceBatch',
      method: 'put',
      data:obj
    })
  }

export function articleRelateReplace(obj) {
  return request({
    url: '/wtcrm/file/batchReplaceByArticle',
    method: 'put',
    data:obj
  })
}

export function getNewArea() {
  return request({
    url: '/wtcrm/tcRegion/tree',
    method: 'get',
  })
}

//oss获取token
export function getOssToken() {
  return request({
    url: '/wtcrm/doc/getDocUploadSts',
    method: 'get',
  })
}

//oss获取token我的
export function getOssTokenMy() {
  return request({
    url: '/wtcrm/doc/getDocUploadStsOfMy',
    method: 'get',
  })
}

//文件管理-新增文件
export function addDoc(data) {
  return request({
    url: '/wtcrm/doc/addDoc',
    method: 'post',
    data: data,
  })
}

//文件管理-新增文件我的
export function addDocMy(data) {
  return request({
    url: '/wtcrm/doc/addDocOfMy',
    method: 'post',
    data: data,
  })
}

//文件管理-查询文档
export function getDocList(data) {
  return request({
    url: '/wtcrm/doc/pageDoc',
    method: 'post',
    data: data,
  })
}

//文件管理-查询文档我的
export function getDocListMy(data) {
  return request({
    url: '/wtcrm/doc/pageDocOfMy',
    method: 'post',
    data: data,
  })
}

//文件管理-下载文件
export function downloadDoc(id) {
  return request({
    url: '/wtcrm/doc/download?id='+id,
    method: 'get',
  })
}

//文件管理-下载文件我的
export function downloadDocMy(id) {
  return request({
    url: '/wtcrm/doc/downloadOfMy?id='+id,
    method: 'get',
  })
}
