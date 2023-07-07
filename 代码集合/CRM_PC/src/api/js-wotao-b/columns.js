
import request from 'axios'
 
export function checkName(data){//新增名称查重
  return request({
    url: '/hfxl/column/checkName',
    method: 'post',
    params: data
  })
}

export function checkUpdateName(data){//编辑名称查重
    return request({
      url: '/hfxl/column/checkUpdateName',
      method: 'post',
      data: data
    })
}

export function getOptions(){//筛选条件选项
    return request({
      url: '/hfxl/column/option',
      method: 'get',
    })
  }

export function addColumns(params){//添加栏目
    return request({
        url: '/hfxl/column/add',
        method: 'post',
        data:params
    })
}

export function editColumns(params){//添加栏目
    return request({
        url: '/hfxl/column/change',
        method: 'put',
        data:params
    })
}

export function getColumnsList(params){//添加栏目
    return request({
        url: '/hfxl/column/list',
        method: 'get',  
        params:params     
    })
}

export function deleteColumn(id){//删除栏目
    return request({
        url: '/hfxl/column/delete/'+id,
        method: 'delete',               
    })
}

export function moveColumn(params){//上、下栏目
    return request({
        url: '/hfxl/column/move',
        method: 'post', 
        data:params                 
    })
}

export function getHotList(params){//热点设置列表
    return request({
        url: '/hfxl/hotArticle/getHotList?substationId=' + params,
        method: 'get'          
    })
}

export function changeHotCount(obj){//修改点击量
    return request({
        url: '/hfxl/hotArticle/changHotCount',
        method: 'get',
        params: obj
    })
}

export function moveLocation(obj){//移动热点
    return request({
        url: '/hfxl/hotArticle/move',
        method: 'post',
        data: obj
    })
}
export function changeCount(obj){//修改状态
    return request({
        url: '/hfxl/hotArticle/changCount',
        method: 'post',
        data: obj
    })
}

export function changStatus(params){//改变栏目状态
    return request({
        url: '/hfxl/column/changStatus',
        method: 'post', 
        data:params                 
    })
}

export function getcolumn(id){//回显栏目
    return request({
        url: '/hfxl/column/getcolumn/'+id,
        method: 'get',               
    })
}

export function editNavPower(params){//回显栏目
    return request({
        url: '/hfxl/column/glqx',
        method: 'post',
        data:params               
    })
}

// 导航列表二级栏目移动上、下栏目
export function moveSecondColumn(params){
    return request({
        url: '/hfxl/column/moveSecond',
        method: 'post', 
        data:params                 
    })
}
