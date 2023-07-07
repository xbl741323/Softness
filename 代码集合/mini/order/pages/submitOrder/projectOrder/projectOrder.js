// order/pages/submitOrder/projectOrder/projectOrder.js
const app = getApp();
var common = require('../../../../utils/common/userDeal')
import { getOpenId, layout } from "../../../../utils/api"
import { getEssAuthStatus } from "../../../../utils/api/user"
import { payForApplet } from "../../../../utils/api/orders"
import { submitOrder, submitToPay } from "../../../../utils/api/order"
import { getAddressList } from "../../../../utils/api/address"
import { updateAccountInfo } from "../../../../utils/api/user"
import { throttle } from "../../../../utils/common/utils"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 微信支付参数
    signList:[{
      value:1,
      title:'电子合同',
      desc: '线上签约，安全高效省心'
    },{
      value:2,
      title:'纸质合同',
      desc: '面签，扫描，邮寄等流程'
    }],
    signIndex:2,
    wxInfo: {},
    orderItemInfo: {},
    baseURL: app.globalData.baseURL,
    priceType: '',
    // 尾款总价
    tailAmount: 0,
    thirdFee: 0,
    orderListNo: '',
    // 显示价格总价
    totalPriceList: [{
        title: "定金总计",
        value: ""
      },
      {
        title: "官费总计",
        value: ""
      },
      {
        title: "本次应支付金额",
        value: ""
      },
    ],
    mask:true,
    wxPayMax: false,
    finalIndex: null, //防止数据结构有问题，尾款未设置情况
    // status：0-待付款 1-未开始 2-已付款
    // payProcess：控制样式显示 true红色 false灰色
    serviceFee: [{
      title: "定金",
      value: "",
      status: 0,
      payProcess: true
    }, {
      title: "尾款",
      value: "",
      status: 1,
      payProcess: false
    }, {
      title: "官费",
      value: "",
      status: 0,
      payProcess: true
    }],
    dialogStatus: true,
    orderNo: "",
    // 页面内容距最顶部的距离
    height: app.globalData.navHeight * 2 + 10,
    // 跳转到对公转账支付页要带的信息
    transferInfo: {},
    defaultAddress: {},
    userInfo: {},
    orderInfo: {},
    imageUrl: app.globalData.imageURL,
    proImageUrl:'https://static.wotao.com/',
    agreementStatus: true,
    checkedIndex: 1,
    payList: [{
        url: "/order/image/orders/transfar_pay.png",
        title: "线下对公转账支付",
        index: 1,
      },
      {
        url: "/order/image/orders/bao_pay.png",
        title: "支付宝支付",
        index: 0,
      },
      {
        url: "/order/image/orders/weixin_icon.png",
        title: "微信支付",
        index: 2,
      },
    ],
    saveOrderInfo:null,
  },
  // 检查授权情况
  checkPower(){
    let that = this;
    let data = this.data.orderInfo;
    let contractType = data.contractScope == 3 ? 2 : data.contractScope; //1:电子，2:纸质，contractScope：3合同可选择
    let certifiedType = wx.getStorageSync('userInfo').certifiedType; //0：未认证；1：初级认证；2：高级认证
    let hignAuth = certifiedType == 1 ? '高级' : '';
    if(certifiedType == 0 || contractType == 1 && certifiedType == 1 || !certifiedType) return wx.showModal({
      title: '操作提示',
      content: '由于您的身份未'+hignAuth+'认证，暂时无法进行签约操作，为了给您提供更好的服务，请尽快完成认证!',
      showCancel: true,
      confirmText:'去认证',
      cancelText:'放弃认证',
      success (res) {
        if (res.confirm) {
          let userInfo = wx.getStorageSync('userInfo');
          setTimeout(function () {
            wx.navigateTo({
              url: '/personal/pages/authentication/authentication?accountType=' + userInfo.accountType,
            })
          }, 1000)
        }
      }
    });     
    console.log(contractType,certifiedType);
    if(contractType == 2 && (certifiedType == 1 || certifiedType == 2)) return this.toSignOrder();
    getEssAuthStatus().then(res=>{      
      if(res.code == 0){
        if(res.data.status=='2'|| res.data.status=='5' || res.data.status=='6') return this.toSignOrder();
        // if(res.data.status == '0') return app.toGoalUrl(`/personal/pages/authentication/authentication`) 0 未激活
        let content = res.data.status=='3'?'签约授权中，点击查看授权结果' : '由于您首次使用签约功能，需要完成签约授权，请先去授权再来签约吧~'
        if(res.data.status!='2') return app.modalBox('',content,'',function(response){
          if(response){
            that.toImpower(res.data.status,res.data.authUrl)
          }
        })
      }
    });
  },
  // 去授权查看授权结果
  toImpower(status,url){
    let para = {
      from: 'old-sign',
      authorizer: 'sq'
    }
    let data = JSON.stringify(para)
    let authUrl = wx.getStorageSync('userInfo').userType=='2'?`/personal/pages/orgAuthentication/orgAuthentication?data=${data}`: `/personal/pages/perAuthentication/operatePage/operatePage?data=${data}`
    console.log(authUrl);
    if(status==3){
      wx.setStorageSync('reloadUrl', url);
      app.toGoalUrl(`/pagesFace/pages/webview/webview?root=user`)
    } else {
      app.toGoalUrl(authUrl)
    }
  },
  toSignOrder(){
    let data = this.data.orderInfo;
    if(data.contractScope == 3) return this.setData({
      mask: false,
    });
    this.submitOrderData();
  },
  changeContract() {
    let that = this;
    let certifiedType = wx.getStorageSync('userInfo').certifiedType; //0：未认证；1：初级认证；2：高级认证
    // 选择电子签约身份只有初级认证
    if(this.data.signIndex == 1 && certifiedType == 1) return wx.showModal({
      title: '操作提示',
      content: '由于您的身份未高级认证，暂时无法进行电子签约操作，为了给您提供更好的服务，请尽快完成高级认证，或者更换签约方式！',
      showCancel: true,
      confirmText:'去认证',
      cancelText:'放弃认证',
      success (res) {
        if (res.confirm) {
          that.closeMask();
          let userInfo = wx.getStorageSync('userInfo');
          setTimeout(function () {
            wx.navigateTo({
              url: '/personal/pages/authentication/authentication?accountType=' + userInfo.accountType,
            })
          }, 300)
        }
      }
    });    
    that.closeMask();
    this.submitOrderData();
    // if(this.data.signIndex == 1 && certifiedType == 2) return common.eleContract({
    //   id: this.data.saveOrderInfo.tmOrderPayment.id,
    //   contractType: 1,
    //   orderNo: this.data.saveOrderInfo.orderNo
    // })
    // wx.showModal({
    //   title: '操作提示',
    //   content: '订单提交成功，请待业务经理上传纸质合同~',
    //   showCancel:false,
    //   confirmText:'我知道了',
    //   success (res) {
    //     if (res.confirm) {
    //       wx.navigateTo({
    //         url: '/personal/pages/orderIndex/order?type=1',
    //       })
    //     }
    //   }
    // })
  }, 
  closeMask(){
    this.setData({
      mask: true,
    })
  },  
  //弹框选择签约方式
  chooseOne(e){
    let index = e.currentTarget.dataset.item;
    console.log(index);
    this.setData({
      signIndex: index
    })
  },
  // 提交订单
  submitOrderData() {
    let orderInfo = this.data.orderInfo
    let params = {
      buyNum: orderInfo.productCount,
      goodsSkuId: orderInfo.goodsId,
      // addressId: this.data.defaultAddress.id,
      orderPort: 'APPLET', //下单端口(PC，APP，H5,APPLET)
      orderSource: 1, //订单来源(1-自主下单；2-后台发起)
      totalAmount: orderInfo.pageFrom == 2 ? orderInfo.totalAmount : this.finalFixTotal(),
    }
    if (wx.getStorageSync('spuLinkId') && wx.getStorageSync('spuInfoArr')) {
      let spuInfoArr = wx.getStorageSync('spuInfoArr')
      let result = spuInfoArr.filter(item => {
        return item.spuId == orderInfo.id
      })
      if (result.length > 0) {
        params.inviteCode = wx.getStorageSync('spuLinkId')
      }
    }
    // 从订单页面过来采用支付宝支付传订单编号orderNo
    if (this.data.orderInfo.pageFrom == 0) {
      params.orderNo = orderInfo.orderNo
      params.id = orderInfo.orderId
    }
    console.log('产品参数', params)
    if (this.data.orderInfo.pageFrom == 1 || this.data.orderInfo.pageFrom == 2) {
      // 首次提交订单
      this.firstToPayOroder(params)
    } else {
      // 待付款去支付
      this.submitToPayOrder(params)
    }
  },
  // 首次提交订单
  firstToPayOroder(params) {
    let that = this;
    let page2 = {
      id: wx.getStorageSync('orderId').orderId,
      addressId: this.data.defaultAddress.id,
      orderPort: 'APPLET',
    }
    let contractType = that.data.orderInfo.contractScope == 3 ? that.data.signIndex : that.data.orderInfo.contractScope;
    let data = Object.assign({contractType: contractType}, params)
    let urls = that.data.orderInfo.pageFrom == 2 ? '/tmOrder/confirmOrder' : '/tmOrder/saveOrder';
    wx.request({
      url: that.data.baseURL + urls,
      method: 'post',
      data: that.data.orderInfo.pageFrom == 2 ? page2 : data,
      header: {
        'content-type': 'application/json',
        'Accept': 'application/json',
        'Authorization': wx.getStorageSync('token')
      },
      success(res) {
        if (res.statusCode == 401) {
          wx.showToast({
            title: '您还未认证,请先认证吧~',
            icon: 'none',
            duration: 1000
          })
          let userInfo = wx.getStorageSync('userInfo');
          setTimeout(function () {
            wx.navigateTo({
              url: '/personal/pages/authentication/authentication?accountType=' + userInfo.accountType,
            })
          }, 1000)
        } else {
          let resp = res.data;
          if (resp.code == 0) {
            console.log(that.data.signIndex,'00000');
            let datas = resp.data;
            let data = that.data.orderInfo;
            let contractType = data.contractScope == 3 ? that.data.signIndex : data.contractScope; //1:电子，2:纸质，contractScope：3合同可选择
            // if(data.contractScope == 3) return that.setData({
            //   mask: false,
            //   saveOrderInfo: datas,
            // })
            if(contractType == 1) return common.eleContract({
              id: datas.id,
              contractType: 1,
              orderNo: datas.orderNo
            })
            wx.showModal({
              title: '操作提示',
              content: '订单提交成功，请待业务经理上传纸质合同~',
              showCancel:false,
              confirmText:'我知道了',
              success (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/personal/pages/orderIndex/order?type=1',
                  })
                }
              }
            })
            // let para = {
            //   accountNo: datas.accountNo,
            //   accountId: datas.accountId,
            //   orderNo: datas.orderNo,
            //   totalPrice: datas.tmOrderPayment.payAmount,
            //   paymentId: datas.tmOrderPayment.id,
            //   outTradeNo: datas.tmOrderPayment.outTradeNo,
            //   payChannel: that.data.checkedIndex,
            //   categoryId: that.data.orderInfo.categoryId,
            // }
            // that.setData({
            //   transferInfo: para
            // })            
            // wx.showToast({
            //   title: '订单提交成功！',
            //   duration: 1000,
            //   icon: 'success'
            // })
            // setTimeout(() => {
            //   that.skipToPay();
            // }, 1500)
          } else {
            wx.showToast({
              title: resp.msg,
              icon: 'none',
            })
          }
        }
      },
      fail(err) {
        console.log(err);
        console.log(urls);
        wx.showModal({
          title: '提示',
          content: '网络请求失败',
          showCancel: false
        })
      }
    })
  },
  toOrderListSign(){
    
  },
  // 总价计算
  totalFix(count) {
    let goverment = this.data.totalPriceList[1].value // 官费价格
    let deposit = this.data.totalPriceList[0].value // 定金
    return count * (Number(deposit) + Number(goverment))
  },
  // 订单总价判断返回
  finalFixTotal() {
    let cOrderInfo = this.data.orderInfo;
    let previous = this.totalFix(cOrderInfo.productCount);
    let tail = cOrderInfo.productCount * (Number(this.data.tailAmount))
    if (this.data.tailAmount == 0) {
      return previous
    } else {
      return previous + tail
    }
  },
  // 修改产品数量
  setCount(val) {
    let status = val.detail
    let cOrderInfo = this.data.orderInfo
    if (status) {
      if (cOrderInfo.productCount < 99) {
        cOrderInfo.productCount += 1
        cOrderInfo.totalPrice = this.totalFix(cOrderInfo.productCount)
        console.log(cOrderInfo.totalPrice);
        this.setData({
          orderInfo: cOrderInfo
        })
      }
    } else {
      if (cOrderInfo.productCount > 1) {
        cOrderInfo.productCount -= 1
        cOrderInfo.totalPrice = this.totalFix(cOrderInfo.productCount)
        this.setData({
          orderInfo: cOrderInfo
        })
      }
    }
    if (cOrderInfo.totalPrice && this.data.checkedIndex == 2) {
      this.setData({
        checkedIndex: 0,
        wxPayMax: true,
      })
    }
    // this.fixTotalPay()
  },
  againPay() {
    if (this.data.checkedIndex == 0) {
      // 选择支付宝支付
      wx.redirectTo({
        url: `/order/pages/orderPay/baoPay/baoPay?orderNo=${this.data.orderListNo}&addressId=${this.data.defaultAddress.id}`,
      });
    } else {
      // 选择对公转账支付或者微信支付
      this.skipToPay()
    }
  },
  toConfrim() {
    let that = this
    wx.showModal({
      title: "操作提示",
      content: '由于您的身份未认证，暂时无法进行提交订单操作，为了给您提供更好的服务，请尽快完成认证~',
      cancelColor: "#999999",
      cancelText: '放弃认证',
      confirmColor: "#36A6FE",
      confirmText: '去认证',
      success(res) {
        if (res.confirm) {
          if (that.data.orderInfo.pageFrom == 2) {
            let para = {
              from: 'launch-order',
            }
            let data = JSON.stringify(para)
            let url = wx.getStorageSync('launchUser').userType == '2' ? `/personal/pages/orgAuthentication/orgAuthentication?data=${data}` : `/personal/pages/perAuthentication/operatePage/operatePage?data=${data}`
            app.toGoalUrl(url)
          } else {
            let url = '/personal/pages/authentication/authentication'
            app.toGoalUrl(url)
          }
        } else if (res.cancel) {

        }
      }
    })

  },
  // 跳转对公转账支付页
  toPay: throttle(function () {
    let status = ['2','5','6'];
    let certified = [1,2];
    if(!status.includes(wx.getStorageSync('userInfo').status)&&!certified.includes(wx.getStorageSync('userInfo').certifiedType)) return this.toConfrim();
    // if (wx.getStorageSync('userInfo').authStatus == '0')
    if (this.data.defaultAddress.id) {
      if (this.data.agreementStatus) {
        if (this.data.orderInfo.pageFrom == 0) {
          // 从订单页面过来分两种情况判断
          this.skipToPay();
        } else {
          // 从产品页面过来先提交订单再跳转支付页面
          this.checkPayWay()
        }
      } else {
        wx.showToast({
          icon: "none",
          title: '请勾选《卧涛网交易服务协议》！',
        })
      }
    } else {
      wx.showToast({
        icon: "none",
        title: '请添加收件地址！',
      })
    }
  }, 3000),
  // 跳转对公转账支付页
  toOrderPay: throttle(function () {
    if (!this.data.agreementStatus) return wx.showToast({
      icon: "none",
      title: '请勾选《卧涛网交易服务协议》！',
    })
    if (!this.data.defaultAddress.id) return wx.showToast({
      icon: "none",
      title: '请添加收件地址！',
    })
    if (this.data.orderInfo.pageFrom == 0) {
      // 从订单页面过来分两种情况判断
      this.skipToPay();
    } else {
      // 从产品页面过来先提交订单再跳转支付页面
      this.checkPayWay()
    }
      
  }, 3000),
  // 改变支付方式 0：支付宝 1：线下对公转账支付
  changePay(e) {
    let index = e.currentTarget.dataset.index
    if (this.data.orderInfo.totalPrice > 6000 && index == 2) return app.modalBox('操作提示', '金额大于6000请使用其他付款方式！', false);
    this.setData({
      checkedIndex: index
    })
  },
  // 是否同意《卧涛网交易服务协议》 true：同意 false：不同意
  changeAgreement(e) {
    let status = e.currentTarget.dataset.status
    console.log(status)
    this.setData({
      agreementStatus: status
    })
  },
  // 计算价格总价
  fixTotalPay() {
    let info = this.data.orderInfo
    let totalPriceList = this.data.totalPriceList
    let priceType = 'orderInfo.priceType';
    let choiceAttribute = info.choiceAttribute;
    if (choiceAttribute.dueTypeAgencyFee || choiceAttribute.dueTypeOfficialFee || choiceAttribute.dueTypeThirdPartyFee) {
      console.log(choiceAttribute, 'due-price');
      totalPriceList[0].title = '服务费总计'
      totalPriceList[0].value = Number(choiceAttribute.dueTypeAgencyFee || 0) + Number(choiceAttribute.dueTypeThirdPartyFee || 0)
      totalPriceList[1].value = Number(choiceAttribute.dueTypeOfficialFee) || 0
      totalPriceList[2].value = totalPriceList[0].value + totalPriceList[1].value
      this.setData({
        [priceType]: 'due-price', //一口价
        totalPriceList: totalPriceList,
        thirdFee: choiceAttribute.dueTypeOfficialFee
      })
      console.log(this.data.totalPriceList, 'totalPriceList');
    } else if (choiceAttribute.finalTypePendingFee == 0) {
      console.log(choiceAttribute, 'wait-tail');
      totalPriceList[0].value = Number(choiceAttribute.depositTypeAgencyFee || 0) + Number(choiceAttribute.depositTypeThirdPartyFee || 0)
      totalPriceList[1].value = Number(choiceAttribute.depositTypeOfficialFee || 0)
      totalPriceList[2].value = totalPriceList[0].value + totalPriceList[1].value
      this.setData({
        [priceType]: 'wait-tail', //尾款待定
        totalPriceList: totalPriceList,
        thirdFee: choiceAttribute.depositTypeOfficialFee
      })
    } else {
      let finalIndex = String(Object.keys(choiceAttribute)).indexOf("final"); //防止数据结构有问题，尾款未设置情况
      console.log(choiceAttribute, 'tail-price');
      totalPriceList[0].value = Number(choiceAttribute.depositTypeAgencyFee || 0) + Number(choiceAttribute.depositTypeThirdPartyFee || 0)
      totalPriceList[1].value = Number(choiceAttribute.depositTypeOfficialFee || 0)
      totalPriceList[2].value = totalPriceList[0].value + totalPriceList[1].value
      this.setData({
        [priceType]: 'tail-price', //有尾款,
        totalPriceList: totalPriceList,
        finalIndex: finalIndex,
        thirdFee: choiceAttribute.depositTypeOfficialFee,
        tailAmount: Number(choiceAttribute.finalTypeAgencyFee || 0) + Number(choiceAttribute.finalTypeThirdPartyFee || 0)
      })
    }
    console.log(this.data.totalPriceList, 'totalPriceList');
    let price = 'orderInfo.totalPrice';
    this.setData({
      [price]: this.totalFix(this.data.orderInfo.productCount)
    });
    if (this.data.orderInfo.totalPrice && this.data.checkedIndex == 2) {
      this.setData({
        checkedIndex: 0
      })
    }
    this.getServiceFeeSty();
  },
  // 赋值价格样式数据
  getServiceFeeSty() {
    let info = this.data.orderInfo
    let serviceFee = this.data.serviceFee
    if (info.pageFrom == 1) {
      // 从产品页面进入此页面或者从订单列表和详情（前提tailstatusPayFlag必须为false）进入此页面
      if (info.priceType == 'due-price') {
        serviceFee[0].title = '服务费'
      }
      serviceFee[0].value = this.data.totalPriceList[0].value;
      serviceFee[0].status = info.tailstatusPayFlag == true ? 2 : 0
      serviceFee[0].payProcess = true
      serviceFee[1].value = this.data.finalIndex == -1 ? '待定' : this.data.tailAmount
      serviceFee[1].status = info.tailstatusPayFlag == true ? 0 : 1
      serviceFee[1].payProcess = false
      serviceFee[2].value = this.data.thirdFee ? this.data.thirdFee : 0
      serviceFee[2].status = info.tailstatusPayFlag == true ? 2 : 0
      serviceFee[2].payProcess = true
      console.log(this.data.orderInfo.priceType, '价格类型');
      this.setData({
        serviceFee: serviceFee.filter((item, i) => {
          return item.value != 0 && item.value != '' && item.value != undefined || item.value == 0 && i == 1 && this.data.orderInfo.priceType == 'wait-tail'
        }),
      });
      console.log(this.data.serviceFee, '流程费用list');
    }
  },
  // 从产品详情页（订单页）进入本页面时对orderInfo赋值
  setOrderInfo(data) {
    this.setData({
      orderInfo: data
    });
    console.log(data, '产品详情信息')
    this.fixTotalPay();
  },
  //过滤支付方式
  filterPayways(data) {
    if (data.type == 3 || data.categoryId == 3) {
      let data = this.data.payList
      this.setData({
        payList: data.splice(0, data.length - 2)
      });
    }
  },
  // 地址赋值
  fitAddressVal(list) {
    let result = list.filter((item) => {
      return item.isDefault == 1
    })
    if (result.length > 0) {
      this.setData({
        defaultAddress: result[0]
      })
    } else {
      this.setData({
        defaultAddress: list[0]
      })
    }
  },
  // 判断选择地址
  filterAddress(list) {
    // 判断是否存储地址id，是则取用
    if (wx.getStorageSync('addressId')) {
      let id = wx.getStorageSync('addressId')
      console.log(id, "输出存储的id")
      let result = list.filter((item) => {
        return item.id == id
      })
      console.log(result, "输出result")
      if (result.length > 0) {
        this.setData({
          defaultAddress: result[0]
        })
      } else {
        this.fitAddressVal(list)
      }
      // 不是取用数组isDefault为1的数据
    } else {
      this.fitAddressVal(list)
    }
  },
  // 获取收件地址
  getAddressData() {
    let params = {
      accountId: wx.getStorageSync('userInfo').accountId
    }
    getAddressList(params).then(res => {
      if (res.code == 0) {
        if (res.data.length > 0) {
          this.filterAddress(res.data)
        } else {
          this.setData({
            defaultAddress: {}
          })
        }
      }
    })
  },
  // 跳转到支付页
  skipToPay() {
    let info = this.data.transferInfo;
    let orders = this.data.orderInfo;
    if (this.data.checkedIndex == 1) {
      // 跳转对公转账支付页
      let data = JSON.stringify(Object.assign({addressId: this.data.defaultAddress.id}, this.data.transferInfo))
      wx.redirectTo({
        url: `/order/pages/orderPay/transferPay/transferPay?data=${data}`,
      })
    } else {
      let para = {
        payChannel: this.data.checkedIndex,
        addressId: this.data.defaultAddress.id,
        id: orders.pageFrom == 0 ? orders.feeInfo.paymentId : info.paymentId,
      }
      payForApplet(para).then(res => {
        if (res.code == 0) {
          if (this.data.checkedIndex == 0) {
            // 跳转支付宝支付页
            let pageFrom = this.data.orderInfo.pageFrom
            let orderNo = pageFrom == 0 ? this.data.orderListNo : this.data.transferInfo.outTradeNo
            wx.redirectTo({
              url: `/order/pages/orderPay/baoPay/baoPay?orderNo=${orderNo}&addressId=${this.data.defaultAddress.id}`,
            })
          } else {
            this.setData({
              wxInfo: JSON.parse(res.data),
              throttle: true
            })
            wx.setStorageSync('wxPay', this.data.wxInfo)
            // 跳转微信支付
            wx.navigateTo({
              url: `/order/pages/orderPay/wxPay/wxPay?addressId=${this.data.defaultAddress.id}`,
            })
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'error'
          })
        }
      })
    }
  },
  // 判断支付方式 0-支付宝 1-对公转账 2-微信支付
  checkPayWay() {
    let checkedIndex = this.data.checkedIndex
    let that = this
    if (checkedIndex == 2) {
      wx.login({
        success: function (res) {
          let para = {
            code: res.code,
          }
          updateAccountInfo(para).then(res => {
            if (res.code == 0) {
              wx.setStorageSync('token', res.data)
              that.submitOrderData()
            } else {
              // 调用注销接口强制退出
              // that.layoutAccount()
            }
          })
        }
      })
    } else {
      this.submitOrderData()
    }
  },
  // 注销退出
  layoutAccount() {
    wx.login({
      success: function (res) {
        layout({
          code: res.code
        }).then(res => {
          if (res.code == 0) {
            // 清除所有storageSync
            wx.clearStorageSync()
            wx.setStorageSync('hasLogo', false);
            wx.redirectTo({
              url: "/personal/pages/wxLogin/wxLogin"
            })
          }
        })
      }
    })
  },
  // 待付款去支付
  submitToPayOrder(params) {
    submitToPay(params).then(res => {
      if (res.code == 0) {
        let r = res.data
        wx.showToast({
          title: '提交成功！',
        })
        if (this.data.checkedIndex == 2) {
          this.setData({
            wxInfo: r.wxPaymentParams
          })
        }
        setTimeout(() => {
          this.skipToPay()
        }, 100)
      } else if (res.code == 50000) {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
        setTimeout(() => {
          wx.navigateTo({
            url: `/personal/pages/orderIndex/order?type=${0}`,
          })
        }, 100)
      }
    })
  },
  // 回显支付方式
  getPayInfo(data) {
    if (data.pageFrom == 0) {
      console.log(data,'*****1');
      let info = {
        orderNo: data.orderNo + '_' + data.feeInfo.payType,
        productName: data.productName,
        categoryId: data.categoryId ? data.categoryId : data.type,
        totalPrice: data.totalPrice,
        tailShould: data.feeInfo.tailShould,
        tailstatusPayFlag: data.tailstatusPayFlag,
        paymentId: data.feeInfo.paymentId
      }
      this.setData({
        orderNo: data.orderNo,
        transferInfo: info,
      });
    }
    if (data.pageFrom != 1) {
      this.setData({
        orderInfo: data
      });
      this.orderListFee();
    }
  },
  orderListFee() {
    let fee = this.data.orderInfo.feeInfo;
    let serviceFee = this.data.serviceFee;
    let totalPriceList = this.data.totalPriceList
    if (this.data.orderInfo.tailstatusPayFlag) { //支付尾款修改列表状态
      serviceFee[0].payProcess = serviceFee[2].payProcess = false
      serviceFee[0].status = serviceFee[2].status = 2
      serviceFee[1].payProcess = true
      serviceFee[1].status = 0
    }
    if (fee.isDue) {
      serviceFee[0].title = '服务费';
      serviceFee[0].value = fee.dueDeposit;
      totalPriceList[0].value = fee.dueDeposit;
    };
    if (fee.hasDeposit) {
      serviceFee[0].value = fee.deposit
      totalPriceList[0].value = fee.deposit;
      serviceFee[1].value = fee.tailPrice ? fee.tailPrice : fee.tailStatus
    };
    if (fee.hasOffical) {
      serviceFee[2].value = fee.offical
      totalPriceList[1].value = fee.offical
    }
    totalPriceList[2].value = totalPriceList[0].value + totalPriceList[1].value
    this.setData({
      serviceFee: serviceFee.filter((item, i) => {
        return item.value != 0 && item.value != ''
      }),
      orderListNo: this.data.orderInfo.orderNo + '_' + fee.payType,
      totalPriceList: totalPriceList,
    });
    console.log(this.data.totalPriceList, '*******');
  },
  closeDialog(e) {
    this.setData({
      dialogStatus: e.detail
    })
    if (!e.detail) {
      wx.disableAlertBeforeUnload({
        success: (res) => {},
      })
    } else {
      let pageFrom = this.data.orderInfo.pageFrom
      let msg = pageFrom == 1 ? '是否取消订单' : '是否放弃支付'
      wx.enableAlertBeforeUnload({
        message: `${msg}，返回上一级页面？`,
      })
    }
  },
  // 离开页面弹框（手势离开）
  leaveEnable() {
    let pageFrom = this.data.orderInfo.pageFrom
    let msg = pageFrom == 1 ? '是否取消订单' : '是否放弃支付'
    wx.enableAlertBeforeUnload({
      message: `${msg}，返回上一级页面？`,
    })
  },
  // 跳转项目申报交易服务协议
  toAgreement() {
    wx.navigateTo({
      url: '/order/pages/tsAgreement/projectTa/projectTa',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'----');
    let data = JSON.parse(decodeURIComponent(options.data))//防止值出现特殊字符如?、&、=等，导致转换不了报错
    this.filterPayways(data)
    if (data.pageFrom == 1) {
      this.setOrderInfo(data)
    };
    this.getPayInfo(data)
    if (this.data.dialogStatus) {
      this.leaveEnable();
    }
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 订单列表和详情进入此页面无法修改收件地址
    let orderInfo = this.data.orderInfo
    if (orderInfo.pageFrom == 0 || orderInfo.pageFrom == 2) {
      this.getAddressData()
    } else {
      let defaultAddress = this.data.defaultAddress
      defaultAddress.id = orderInfo.receiveAddressId
      this.setData({
        defaultAddress: defaultAddress
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('生命周期函数--监听页面隐藏')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('addressId')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})