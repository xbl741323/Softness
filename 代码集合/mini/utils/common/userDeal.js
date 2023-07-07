import { getMyAccountAndVipInfo,updateAccountInfo } from "../api/user"
import { signSelf,changeContractType } from "../api/orders"
const app = getApp();
function getUserInfos(val,success) {
  getMyAccountAndVipInfo().then(res=>{
      if(res.code ==0){
        if(res.data.vipInfo){wx.setStorageSync('vipInfo', res.data.vipInfo)};      
        if(!res.data.accountInfo) return app.modalBox(null,'获取账号信息异常，请重新登录！',false,function(response){
          if(response){
            app.toGoalUrl('/personal/pages/wxLogin/wxLogin')
          }
        })
        if(success){
          success(res.data.accountInfo)
        }
        // console.log(val,'aaaaaaaaa',res.data.accountInfo.username);
        if(res.data.accountInfo.username==null) return perfectUser(res.data.accountInfo.phone);
        wx.setStorageSync('userInfo', res.data.accountInfo);
        wx.setStorageSync('accountId', res.data.accountInfo.accountId);      
        if(!res.data.accountInfo.miniOpenId&&val) return updateUser()
      } else {
        app.toastBox('接口异常，稍后重试')
      }
  });
}
function perfectUser(phone){
    let para = {
      from: 'no-username',
      mobile: phone,
    };
    let data = JSON.stringify(para)
    app.toGoalUrl(`/personal/pages/regist/regist?data=${data}`)
  }
  // return new Promise(function(resolve, reject) {
  //   getMyAccountInfo().then(res=>{
  //     if (res.code==0){
  //       resolve(res.data)
  //     } else {
  //       reject(error)
  //     }
  //   })
  //   console.log(-1);
  // })
function updateUser(){
  wx.login({
    success: function (res) {
      let para = {
        code: res.code,
      }
      updateAccountInfo(para).then(res => {
        if (res.code == 0) {
          wx.setStorageSync('token', res.data)
        } else {          
        }
      })
    }
  })
}
  // async function asyncUserInfos() {
  //   let returnData = await getUserInfos()
  //   console.log(returnData,'===========');
  //   return returnData 
  // }
  // asyncUserInfos().then(value => {
  //   console.log(1);
  //     let data = value
  //     // return data
  // })
  // return getMyAccountInfo().then(res=>{
  //   if(res.code ==0){
  //     wx.setStorageSync('userInfo', res.data);
  //     wx.setStorageSync('accountId', res.data.accountId);
  //   }
  // });
// p = getUserInfos()
// p.then(result => console.log(result,'````````````````'))
function chooseSign(order,success){
  if(order.contractType == 1 ) return eleContract(order)
  if(order.contractType == 2) return paperContract(success)
}
    // 签约电子合同
function eleContract(order){
  let para = {
    contractType: order.contractType,
    orderId: order.id,
    returnUrl: '/pages/redirect/redirect?root=order'
  }
  signSelf(para).then(res=>{
    wx.setStorageSync('reloadUrl', res.data);
    app.toGoalUrl(`/pagesFace/pages/webview/webview?root=sign`)
  })
}
    //签约纸质合同
function  paperContract(success){
  wx.showModal({
    title: '操作提示',
    content: '后台正在处理您的纸质合同，请耐心等待~',
    showCancel:false,
    confirmText:'我知道了',
    success (res) {
      if (res.confirm) {
        success('success')
      }
    }
  })
}
    // 更改合同类型
function changeContract(order,success,fail) {
  changeContractType(order).then(res=>{
    // success(res)
    if(res.code==0){
      if(order.contractType == 1 ) return success(res)
      if(order.contractType == 2 ) return paperContract(success)
    } else {
      success(res)
      app.toastBox(res.msg, 'error', 2000)
    }
  }).catch(err=>{
    fail(err)
  })    
}
module.exports = {
  getUserInfos: getUserInfos,
  chooseSign: chooseSign,
  changeContract: changeContract,
  perfectUser: perfectUser,
  eleContract: eleContract
}
