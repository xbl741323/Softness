import request from 'axios'

//用户列表
export function getUserList(type,param){
   if(type==0){ //单位
    return request({
        url:'/wtuims/tmuser/listAutCompanyUser',
        method:'post',
        data:param
    })
   }else if(type==1){ //个人
    return request({
        url:'/wtuims/tmuser/listAutPersonUser',
        method:'post',
        data:param
    })
   }else{ //未认证
    return request({
        url:'/wtuims/tmuser/listNotAutUser',
        method:'post',
        data:param
    })
   }
}

//我的用户列表
export function mygetUserList(type,param){
    if(type==0){ //单位
     return request({
         url:'/wtuims/tmuser/myListAutCompanyUser',
         method:'post',
         data:param
     })
    }else if(type==1){ //个人
     return request({
         url:'/wtuims/tmuser/myListAutPersonUser',
         method:'post',
         data:param
     })
    }else{ //未认证
     return request({
         url:'/wtuims/tmuser/myListNotAutUser',
         method:'post',
         data:param
     })
    }
}

//用户详情
export function getUserDetail(type,param){
    if(type==0){
      return request({
          url:'/wtuims/tmuser/getCompanydetail',
          method:'get',
          params:param
      })
    }else if(type==1){
      return request({
          url:'/wtuims/tmuser/getPersonDetail',
          method:'get',
          params:param
      })
    }else{
      return request({
        url:'/wtuims/tmuser/getNotAutUserDetail',
        method:'get',
        params:param
      })
    }
}

//我的用户详情
export function mygetUserDetail(type,param){
    if(type==0){
      return request({
          url:'/wtuims/tmuser/getMyCompanydetail',
          method:'get',
          params:param
      })
    }else if(type==1){
      return request({
          url:'/wtuims/tmuser/getMyPersonDetail',
          method:'get',
          params:param
      })
    }else{
      return request({
        url:'/wtuims/tmuser/getMyNotAutUserDetail',
        method:'get',
        params:param
      })
    }
}

//注册信息
export function getRegister(type,param){
     if(type==0){
        return request({
          url:'/wtuims/tmuser/getRegCompanyUser/'+param,
          method:'get',
          // params:param
        })
     }else if(type==1){
        return request({
          url:'/wtuims/tmuser/getRegPersonUser/'+param,
          method:'get',
          // params:param
        })
     }else{
        return request({
          url:'/wtuims/tmuser/getNotAutRegUser/'+param,
          method:'get',
          // params:param
        })
     }
}

//我的注册信息
export function mygetRegister(type,param){
    if(type==0){
       return request({
         url:'/wtuims/tmuser/getMyRegCompanyUser/'+param,
         method:'get',
        //  params:param
       })
    }else if(type==1){
       return request({
         url:'/wtuims/tmuser/getMyRegPersonUser/'+param,
         method:'get',
        //  params:param
       })
    }else{
       return request({
         url:'/wtuims/tmuser/getMyNotAutRegUser/'+param,
         method:'get',
        //  params:param
       })
    }
}

// 用户列表-单位-查询主体账户下的账户列表(不含主账户)
export function getAccountList(param){
     return request({
       url:'/wtuims/tmuser/accountListBelongUser/'+param,
       method:'get',
      //  params:param
     })
}

// 我的用户-单位-查询主体账户下的账户列表(不含主账户)
export function getMyAccountList(param){
     return request({
       url:'/wtuims/tmuser/accountListBelongUserMy/'+param,
       method:'get',
      //  params:param
     })
}



//启用禁用
export function Enabledisable(param){
    return request({
        url:'/wtuims/tmuser/userDisabled',
        method:'put',
        data:param
    })
}

//用户分配
export function distribution(param){
  return request({
    url:'/wtuims/tmuser/userAllocationBatch',
    method:'post',
    data:param
  })
}

//编辑备注
export function editMark(param){
   return request({
    url:'/wtuims/tmuser/editRemark',
    method:'put',
    data:param
   })
}
