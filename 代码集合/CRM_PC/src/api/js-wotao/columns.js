
import request from 'axios'
 
export function checkName(data){//新增名称查重
  return request({
    url: '/wtcrm/column/checkName',
    method: 'post',
    params: data
  })
}

export function checkUpdateName(data){//编辑名称查重
    return request({
      url: '/wtcrm/column/checkUpdateName',
      method: 'post',
      data: data
    })
}

export function getOptions(){//筛选条件选项
    return request({
      url: '/wtcrm/column/option',
      method: 'get',
    })
  }

export function addColumns(params){//添加栏目
    return request({
        url: '/wtcrm/column/add',
        method: 'post',
        data:params
    })
}

export function editColumns(params){//添加栏目
    return request({
        url: '/wtcrm/column/change',
        method: 'put',
        data:params
    })
}

export function getColumnsList(params){//添加栏目
    return request({
        url: '/wtcrm/column/list',
        method: 'get',  
        params:params     
    })
}

export function deleteColumn(id){//删除栏目
    return request({
        url: '/wtcrm/column/delete/'+id,
        method: 'delete',               
    })
}

export function moveColumn(params){//上、下栏目
    return request({
        url: '/wtcrm/column/move',
        method: 'post', 
        data:params                 
    })
}

export function getHotList(){//热点设置列表
    return request({
        url: '/wtcrm/hotArticle/getHotList',
        method: 'get'          
    })
}

export function changeHotCount(obj){//修改点击量
    return request({
        url: '/wtcrm/hotArticle/changHotCount',
        method: 'get',
        params: obj
    })
}

export function moveLocation(obj){//移动热点
    return request({
        url: '/wtcrm/hotArticle/move',
        method: 'post',
        data: obj
    })
}
export function changeCount(obj){//修改状态
    return request({
        url: '/wtcrm/hotArticle/changCount',
        method: 'post',
        data: obj
    })
}

export function changStatus(params){//改变栏目状态
    return request({
        url: '/wtcrm/column/changStatus',
        method: 'post', 
        data:params                 
    })
}

export function getcolumn(id){//回显栏目
    return request({
        url: '/wtcrm/column/getcolumn/'+id,
        method: 'get',               
    })
}

export function editNavPower(params){//回显栏目
    return request({
        url: '/wtcrm/column/glqx',
        method: 'post',
        data:params               
    })
}

