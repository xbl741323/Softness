import { revokeRefund } from "../api/refund"
const app = getApp();
function copyTap(e) {
  console.log(e);
  let no = e.currentTarget.dataset.no
  wx.setClipboardData({
    data: no,
    success: function (res) {
      wx.getClipboardData({
        success: function (res) {
          wx.showToast({
            title: '复制成功'
          })
        }
      })
    }
  })
}
 // 撤销退款
function cancelRefundOperate(e,reses){
  let id = e.currentTarget.dataset.order
  wx.showModal({
    title: "撤销退款申请",
    content: "您将撤销本次申请，如果问题未解决，您还可以再次发起。确定撤销吗？",
    cancelColor: "#999999",
    cancelText: "再想想",
    confirmColor: "#36A6FE",
    confirmText: "确定",
    success(res) {
      if (res.confirm) {
        cancelRefund(id,reses)
      } else if (res.cancel) {}
    }
  })
}
 // 撤销退款接口调用
 function cancelRefund(id,reses) {
  revokeRefund(id).then(res=>{
    if(res.code == 0){
      app.toastBox('操作成功！','success',1000)
      // reses('success') 
      setTimeout(()=>{
        reses('success')
       },1100)
    } else {
      app.toastBox(res.msg,'warning',1500)
    }
  })
}
module.exports = {
  copyTap: copyTap,
  cancelRefundOperate: cancelRefundOperate,
}
