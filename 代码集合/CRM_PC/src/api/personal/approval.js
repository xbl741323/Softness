import request from "@/router/axios";

// 获取初级认证/授权审批 列表
// Boole == true 我的流程
export function getContractList(param,Boole) {
  if(Boole){
    return request({
      url: "/wtcrm/tmClueCompanyAuthRecord/pageMyTmClueCompanyAuthRecordVo",
      method: "POST",
      data: param
    });
  }else{
    return request({
      url: "/wtcrm/tmClueCompanyAuthRecord/pageTmClueCompanyAuthRecordVo",
      method: "POST",
      data: param
    });
  }
}
  // 流程状态
export function getContractStatus(Boole) {
  if(Boole){
    return request({
      url: "/wtcrm/tmClueCompanyAuthRecord/statisticsStatusOfMine",
      method: "POST"
    });
  }else{
    return request({
      url: "/wtcrm/tmClueCompanyAuthRecord/statisticsStatus",
      method: "POST"
    });
  }
}
  // 通过id查询
export function getClueCompId(id,Boole) {
 return request({
     url: '/wtcrm/tmClueCompanyAuthRecord/getTmClueCompanyAuthRecordVoById/'+id,
     method:'GET'
    })
}
// 根据信用代码获取认证信息
export function getByOrganization(obj,num) {
  if(num==1){
    return request({
      url: "/wtuims/tmuser/getAuthCompanyUserVo",
      method:'GET',
      params:obj
     })
  }else{
    return request({
      url: "/wtuims/tmuser/getAuthCompanyUserVoByOrganization",
      method:'GET',
      params:obj
     })
  }
 } 

//  处理认证流程 	类型1：认证；2：授权
export function auditPaperContractAuditOfMy(data ,num,Boole) {
  if (num==1) {
    if (Boole) {
      return request({
        url: "/wtcrm/tmClueCompanyAuthRecord/handleMyCertified",
        method:'POST',
        data
       })
    }else{
      return request({
        url: "/wtcrm/tmClueCompanyAuthRecord/handleCertified",
        method:'POST',
        data
       })
    }
  }else{
    if (Boole) {
      return request({
        url: "/wtcrm/tmClueCompanyAuthRecord/handleMyAuthorized",
        method:'POST',
        data
       })
    }else{
      return request({
        url: "/wtcrm/tmClueCompanyAuthRecord/handleAuthorized",
        method:'POST',
        data
       })
    }
  }
 } 