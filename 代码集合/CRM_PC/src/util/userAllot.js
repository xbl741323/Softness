export function judgeStatus(row){
var obj = {
    serviceDisabled:false,
    userDisabled:false,
    salesDisabled:false
}
    // 我是客服，是用户归属，是业务员
if(row.loginEmpNo == row.customerNo&&row.loginEmpNo == row.userBelongNo&&row.loginEmpNo == row.saleBelongNo){
    obj.serviceDisabled = false
    obj.userDisabled = false
    obj.salesDisabled = false

    // 我是客服，是用户归属，不是业务员
  }else if(row.loginEmpNo == row.customerNo&&row.loginEmpNo == row.userBelongNo&&row.loginEmpNo !== row.saleBelongNo){
    obj.serviceDisabled = false
    obj.userDisabled = false
    obj.salesDisabled = false

    // 我是客服，不是用户归属,是业务员
  }else if(row.loginEmpNo == row.customerNo&&row.loginEmpNo !== row.userBelongNo&&row.loginEmpNo == row.saleBelongNo){
    obj.serviceDisabled = false
    obj.userDisabled = true
    obj.salesDisabled = false

    // 我不是客服，是用户归属,是业务员
  }else if(row.loginEmpNo !== row.customerNo&&row.loginEmpNo == row.userBelongNo&&row.loginEmpNo == row.saleBelongNo){
    obj.serviceDisabled = true
    obj.userDisabled = false
    obj.salesDisabled = false

    // 我是客服，不是用户归属,不是业务员
  }else if(row.loginEmpNo == row.customerNo&&row.loginEmpNo !== row.userBelongNo&&row.loginEmpNo !== row.saleBelongNo){
    obj.serviceDisabled = false
    obj.userDisabled = true
    obj.salesDisabled = false

     // 我不是客服，是用户归属,不是业务员
  }else if(row.loginEmpNo !== row.customerNo&&row.loginEmpNo == row.userBelongNo&&row.loginEmpNo !== row.saleBelongNo){
    obj.serviceDisabled = true
    obj.userDisabled = false
    obj.salesDisabled = false

     // 我不是客服，不是用户归属,是业务员
  }else if(row.loginEmpNo !== row.customerNo&&row.loginEmpNo !== row.userBelongNo&&row.loginEmpNo == row.saleBelongNo){
    obj.serviceDisabled = true
    obj.userDisabled = true
    obj.salesDisabled = false

     // 我不是客服，不是用户归属,不是业务员
  }else if(row.loginEmpNo !== row.customerNo&&row.loginEmpNo !== row.userBelongNo&&row.loginEmpNo !== row.saleBelongNo){
    obj.serviceDisabled = true
    obj.userDisabled = true
    obj.salesDisabled = true
  }
  return obj;
}