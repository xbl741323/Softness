import request from 'axios'

export function getCaptureData(obj){
    return request({
        url:'/wtcrm/grab/grabcontent',
        method: 'post',
        data: obj
    })
}

export function deleteData(obj){
    return request({
        url:'/wtcrm/grab/deletes',
        method: 'post',
        data: obj
    })
}

export function getCaptureDetail(obj){
    return request({
        url:'/wtcrm/grab/getDetail/'+obj.id,
        method: 'get',
    })
}

export function addCapture(obj, url){
    return request({
        url: url,
        method: 'post',
        data: obj
    })
}

export function getStatisticsList(obj){
    return request({
        url:'/wtcrm/grab/list',
        method: 'post',
        data: obj
    })
}
export function del(id){
    return request({
        url:'/wtcrm/grab/delete/'+id,
        method: 'delete',
    })
}

export function updateStatus(obj){
    return request({
        url:'/wtcrm/grab/updatestate',
        method: 'put',
        data: obj
    })
}

export function records(obj){
    return request({
        url:'/wtcrm/grab/record',
        method: 'post',
        data: obj
    })
}

export function edit(obj){
    return request({
        url:'/wtcrm/grab/edit',
        method: 'post',
        data: obj
    })
}
export function editRecords(obj){
    return request({
        url:'/wtcrm/grab/contentrecord',
        method: 'post',
        data: obj
    })
}