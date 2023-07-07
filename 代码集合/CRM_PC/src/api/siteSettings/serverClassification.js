import request from '@/router/axios'

export function getServerList(){
    return request({
        url:'wtcrm/serviceClass/classificationList',
        method: 'post'
    })
}

export function getList(obj){
    return request({
        url:'wtcrm/serviceClass/list',
        method: 'post',
        data: obj
    })
}

export function changeOption(data){
    return request({
        url:'wtcrm/serviceClass/changeOption',
        method:'put',
        data:data
    })
}

export function move(data){
    return request({
        url:'wtcrm/serviceClass/move',
        method:'put',
        data:data
    })
}

export function change(data){
    return request({
        url:'wtcrm/serviceClass/change',
        method:'put',
        data:data
    })
}

export function changeIcon(data){
    return request({
        url:'wtcrm/serviceClass/icon',
        method:'put',
        data:data
    })
}

export function changeName(data){
    return request({
        url:'wtcrm/serviceClass/changeName',
        method:'put',
        data:data
    })
}

export function addServiceClass(data){//添加服务分类
    return request({
        url:'wtcrm/serviceClass/add',
        method:'post',
        data:data
    })
}