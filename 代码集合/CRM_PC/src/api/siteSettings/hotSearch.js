import request from '@/router/axios'

export function getHotList(){
    return request({
        url:'/wtcrm/hotSearch/list'
    })
}

export function change(data){
    return request({
        url:'/wtcrm/hotSearch/change',
        method:'put',
        data:data
    })
}

export function move(data){
    return request({
        url:'/wtcrm/hotSearch/move',
        method:'put',
        data:data
    })
}

export function getStatisticsList(data){
    return request({
        url:'/wtcrm/keywordRecord/list',
        method:'post',
        data:data
    })
}

export function getTarget(){
    return request({
        url:'/wtcrm/target',
        method:'get',
    })
}

export function changeSynonym(obj){
    return request({
        url:'/wtcrm/target/changeSynonym',
        method:'put',
        data:obj
    })
}

export function delSynonym(obj){
    return request({
        url:'/wtcrm/target/delSynonym?id='+obj.id,
        method:'delete'
    })
}

export function addSynonyms(obj){
    if(obj.type ==0){
        return request({
            url:'/wtcrm/target',
            method:'post',
            data:obj
        })
    }else if(obj.type == 1){
        return request({
            url:'/wtcrm/target',
            method:'put',
            data:obj
        })
    }else{
        return request({
            url:'/wtcrm/target?id='+obj.id,
            method:'delete',
        })
    }
}