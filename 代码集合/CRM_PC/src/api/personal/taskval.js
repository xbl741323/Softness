import request from "@/router/axios";

// 开启任务审核

export function amendTaskState(data){
    return request({
        url:"wtorder/tmTaskOpen/taskOpen",
        method: "POST",
        data
    })
}
//  任务审核状态数字
export function taskOPenStatistics(Bool){
if (Bool) {
    return request({
        url:'wtorder//tmTaskOpen/taskOPenStatisticsMy',
        method:'get'
    })  
    }else{
        return request({
            url:'wtorder/tmTaskOpen/taskOPenStatistics',
            method:'get'
        })  
    }
}
// 获取任务审核类标
export function getTaskOpenList(data,Bool){
    if (Bool) {
        return request({
            url:'/wtorder/tmTaskOpen/pageMyTaskOpen',
            method:'post',
            data
        })
    }else{
        return request({
            url:'/wtorder/tmTaskOpen/pageTaskOpen',
            method:'post',
            data
        })
    }
}
//  审批详情接口
    export  function getTaskOpenInfo(params,Bool){
        if (Bool) {
            return request({
                url:"/wtorder/tmTaskOpen/tmTaskOpenInfoMy/"+params,

                method:"get",
                // params
            })
        }else{
            return request({
                url:"/wtorder/tmTaskOpen/tmTaskOpenInfo/"+params,
                method:"get",
                // params
            })
        }
    }
    // 开启任务审批接口
    export  function changeTaskOpenCheck(data,Bool){
        if (Bool) {
            return request({
                url:"/wtorder/tmTaskOpen/tmTaskOpenCheckMy",
                method:"post",
                data
            })
        }else{
            return request({
                url:"/wtorder/tmTaskOpen/tmTaskOpenCheck",
                method:"post",
                data
            })
        }
    }
    // 发送开启任务状态
    export function  sendTaskState(data){
        return request({
            url:"/wtorder/tmTaskOpen/taskOpenStatus",
            method:"post",
            data
        })
    }
