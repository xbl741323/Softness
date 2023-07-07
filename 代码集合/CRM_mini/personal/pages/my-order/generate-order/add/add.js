// personal/pages/my-order/generate-order/add/add.js
import {
  getByOrganizationForOrder,
  getByMobile
} from "../../../../../utils/api/clue"
import {
  generateOrder,
  validateAudit
} from "../../../../../utils/api/order"
import {
  getAttributeList,
  getAttributeLabel
} from "../../../../../utils/order/order"
import * as CodeMsg from "../../../../../utils/common/codeMsg";
import {
  throttle
} from "../../../../../utils/common/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModelStatus: false, // 是否显示签约人弹窗
    defaultArr: [0],
    highCertifyImg: '/personal/image/my-clue/certified-high.png',
    lowCertifyImg: '/personal/image/my-clue/certified-low.png',
    auditStatus: false, // 审核状态 true-不通过 false-通过
    phoneStatus: 0, // 单位线索发起订单-当前签约手机号状态 0-未授权 1-初级授权 2-高级授权
    orderStatus: 1, // 订单状态 1-待签约 -2-草稿
    clueType: null, // 线索类型 2-单位 1-类型
    clueInfo: null, // 线索信息
    signManInfo: null, // 签约人信息
    selectProduct: [], // 选择产品信息列表
    fixTotalAmount: 0, // 订单总金额
    isFixTotalPeding: false, // 订单总金额是否待定 true-是 false-否
    shareImgUrl: "",
    showCode: false,
    signManList: [] // 签约人选择列表
  },
  // 关闭签约人弹窗
  onClose() {
    this.setData({
      showModelStatus: false
    })
  },
  // 显示签约人弹窗
  onOpen() {
    this.setData({
      showModelStatus: true
    })
  },
  // 提交审核回调
  submitAudit(val) {
    let auditManInfo = val.detail.auditManInfo
    let auditRemark = val.detail.auditRemark
    let params = this.returnParams()
    params.handleBy = auditManInfo.userId // 审核人userId
    params.handleByNo = auditManInfo.number // 审核人number
    params.handleByName = auditManInfo.name // 审核人name
    params.changePriceRemark = auditRemark // 审核备注
    this.generateNewOrder(params, true)
  },
  // 显示弹窗
  showAuditTip() {
    this.selectComponent('#audit-tip').showTip()
  },
  // 去产品显示页面
  toSelect() {
    wx.navigateTo({
      url: '/personal/pages/my-order/select-product/select-product',
    })
  },
  // 改变签约人
  changeSignMan(e) {
    this.setData({
      defaultArr: e.detail.value,
    })
  },
  // 选择签约人前校验
  validateConfirm() {
    let signManList = this.data.signManList
    let index = this.data.defaultArr[0]
    let signInfo = signManList[index]
    if (!signInfo.legalMobileFlag || signInfo.authorizedLabel == 0) {
      wx.showToast({
        icon: 'none',
        title: !signInfo.legalMobileFlag ? '手机号格式不正确，请到线索修改后再试！' : '仅已授权联系人可选，如需选择，请先去授权！',
      })
    } else {
      this.confirmSelect()
    }
  },
  // 确认选择签约人
  confirmSelect() {
    let signManList = this.data.signManList
    let index = this.data.defaultArr[0]
    this.setData({
      signManInfo: {
        name: signManList[index].contactName,
        mobile: signManList[index].mobile
      }
    })
    this.getAccountInfo()
    this.onClose()
  },
  // 改变产品显示状态
  changeProduct(e) {
    let info = e.currentTarget.dataset.item
    let selectProduct = this.data.selectProduct
    selectProduct.forEach(item => {
      if (item.id == info.id) {
        item.isShow = !item.isShow
      }
    })
    this.setData({
      selectProduct: selectProduct
    })
  },
  // 改变产品信息 type: 0-产品数量 1-规格属性 2-订单备注 3-修改价格 4-修改支付方式 5-修改尾款状态
  changeProInfo(e) {
    let detail = e.detail
    let selectProduct = this.data.selectProduct
    let fixTotalAmount = 0
    let isFixTotalPeding = false
    selectProduct.forEach(item => {
      if (item.id == detail.id) {
        // 修改订单备注
        detail.type == 2 ? item.payInfo.remark = detail.val : ""
        if (detail.type == 0) {
          item.payInfo.productNum = detail.val
          item.payInfo.totalAmount = this.fixSoloTotalAmount(item.payInfo) // 修改总价
        }
        if (detail.type == 1) {
          item.payInfo.attributeIndex = detail.val
          item.payInfo.cAttributeInfo = item.tradeInfo.skuList[detail.val]
          item.payInfo.copyPayTypeInfo = this.startFixPayInfo(item.tradeInfo.skuList[detail.val])
          item.payInfo.payWay = this.startFixPayWay(item.tradeInfo.skuList[detail.val])
          item.payInfo.footPayStatus = this.startFixPayFootStatus(item.tradeInfo.skuList[detail.val])
          item.payInfo.totalAmount = (item.payInfo.productNum) * item.tradeInfo.skuList[detail.val].skuAmount // 修改总价
          if (item.tradeInfo.skuList[detail.val].skuPayTypeList.finalTypePendingFee == 0) {
            item.payInfo.isFinalPeding = true
          } else {
            item.payInfo.isFinalPeding = false
          }
        }
        // 修改金额信息
        if (detail.type == 3) {
          item.payInfo.copyPayTypeInfo = this.fixPayInfo(item.payInfo.copyPayTypeInfo, detail.val)
          item.payInfo.totalAmount = this.fixSoloTotalAmount(item.payInfo) // 修改总价
        }
        // 修改支付方式
        if (detail.type == 4) {
          item.payInfo.payWay = detail.val
          item.payInfo.totalAmount = this.fixSoloTotalAmount(item.payInfo) // 修改总价
          item.payInfo.isFinalPeding = item.payInfo.footPayStatus == 1 ? true : false
        }
        // 修改尾款状态
        if (detail.type == 5) {
          item.payInfo.footPayStatus = detail.val
          item.payInfo.totalAmount = this.fixSoloTotalAmount(item.payInfo) // 修改总价
          item.payInfo.isFinalPeding = item.payInfo.footPayStatus == 1 ? true : false
        }
      }
      if (item.payInfo.footPayStatus == 1) {
        isFixTotalPeding = true
      }
      fixTotalAmount += item.payInfo.totalAmount
    })
    this.setData({
      selectProduct: selectProduct,
      fixTotalAmount: fixTotalAmount,
      isFixTotalPeding: isFixTotalPeding
    })
    console.log(this.data.selectProduct, "输出修改后的selectProduct")
  },
  // 计算单个订单总价
  fixSoloTotalAmount(val) {
    let {
      copyPayTypeInfo,
      payWay,
      footPayStatus,
      productNum
    } = val
    let totalAmount = 0
    // 定金尾款型（尾款正常）
    if (payWay == 0 && footPayStatus == 0) {
      totalAmount = productNum * (copyPayTypeInfo.depositTypeAgencyFee + copyPayTypeInfo.depositTypeThirdPartyFee + copyPayTypeInfo.depositTypeOfficialFee + copyPayTypeInfo.finalTypeAgencyFee + copyPayTypeInfo.finalTypeThirdPartyFee)
    }
    // 定金尾款型（尾款待定）
    if (payWay == 0 && footPayStatus == 1) {
      totalAmount = productNum * (copyPayTypeInfo.depositTypeAgencyFee + copyPayTypeInfo.depositTypeThirdPartyFee + copyPayTypeInfo.depositTypeOfficialFee)
    }
    // 一次性付款型
    if (payWay == 1) {
      totalAmount = productNum * (copyPayTypeInfo.dueTypeAgencyFee + copyPayTypeInfo.dueTypeThirdPartyFee + copyPayTypeInfo.dueTypeOfficialFee)
    }
    return totalAmount
  },
  // 金额信息修改
  fixPayInfo(copyPayTypeInfo, val) {
    let r = copyPayTypeInfo
    switch (val.type) {
      case 1:
        r.depositTypeAgencyFee = val.value;
        break
      case 2:
        r.depositTypeThirdPartyFee = val.value;
        break
      case 3:
        r.depositTypeOfficialFee = val.value;
        break
      case 4:
        r.finalTypeAgencyFee = val.value;
        break
      case 5:
        r.finalTypeThirdPartyFee = val.value;
        break
      case 6:
        r.dueTypeAgencyFee = val.value;
        break
      case 7:
        r.dueTypeThirdPartyFee = val.value;
        break
      case 8:
        r.dueTypeOfficialFee = val.value;
        break
    }
    return r
  },
  // 初始化金额信息修改赋值
  startFixPayInfo(val) {
    console.log(val, "输出商品属性信息")
    let skuPayTypeList = val.skuPayTypeList
    return {
      depositTypeAgencyFee: skuPayTypeList.depositTypeAgencyFee || 0,
      depositTypeThirdPartyFee: skuPayTypeList.depositTypeThirdPartyFee || 0,
      depositTypeOfficialFee: skuPayTypeList.depositTypeOfficialFee || 0,
      finalTypeAgencyFee: skuPayTypeList.finalTypeAgencyFee || 0,
      finalTypeThirdPartyFee: skuPayTypeList.finalTypeThirdPartyFee || 0,
      dueTypeAgencyFee: skuPayTypeList.dueTypeAgencyFee || 0,
      dueTypeThirdPartyFee: skuPayTypeList.dueTypeThirdPartyFee || 0,
      dueTypeOfficialFee: skuPayTypeList.dueTypeOfficialFee || 0,
    }
  },
  // 初始化支付方式信息修改赋值 支付方式 0-定金尾款 1-一次性付款
  startFixPayWay(val) {
    let skuPayTypeList = val.skuPayTypeList
    if (skuPayTypeList.dueTypeAgencyFee || skuPayTypeList.dueTypeThirdPartyFee || skuPayTypeList.dueTypeOfficialFee) {
      return 1
    } else {
      return 0
    }
  },
  // 初始化尾款状态信息修改赋值  尾款状态 0-尾款正常 1-尾款待定
  startFixPayFootStatus(val) {
    let skuPayTypeList = val.skuPayTypeList
    if (skuPayTypeList.finalTypePendingFee == 0) {
      return 1
    } else {
      return 0
    }
  },
  // 选择产品后回显产品
  setSelectedPro() {
    if ((wx.getStorageSync('selectedPro') && this.data.selectProduct.length == 0) || wx.getStorageSync('addNewPro')) {
      wx.removeStorageSync('addNewPro')
      let fixTotalAmount = 0
      let isFixTotalPeding = false
      let selectedPro = wx.getStorageSync('selectedPro')
      selectedPro.forEach((item, index) => {
        item.isShow = index == 0 ? false : true
        item.attributeList = getAttributeList(item.tradeInfo.dynamicAttributeList)
        item.tradeInfo.skuList.forEach(cItem => {
          cItem.skuLabel = getAttributeLabel(getAttributeList(item.tradeInfo.dynamicAttributeList), cItem.skuIndex)
        })
        item.payInfo = {
          // 初始化产品总价
          totalAmount: 1 * item.tradeInfo.skuList[0].skuAmount,
          // 初始化产品数量
          productNum: 1,
          // 初始化规格属性下标
          attributeIndex: 0,
          // 初始化规格属性下标对应的规格属性信息
          cAttributeInfo: item.tradeInfo.skuList[0],
          // 备注字段
          remark: "",
          // 当前规格属性下尾款是否待定 true-是 false-否
          isFinalPeding: false,
          // 价格显示对象
          copyPayTypeInfo: this.startFixPayInfo(item.tradeInfo.skuList[0]),
          // 支付方式 0-定金尾款 1-一次性付款
          payWay: this.startFixPayWay(item.tradeInfo.skuList[0]),
          // 尾款状态 0-尾款正常 1-尾款待定
          footPayStatus: this.startFixPayFootStatus(item.tradeInfo.skuList[0])
        }
        if (item.tradeInfo.skuList[0].skuPayTypeList.finalTypePendingFee == 0) {
          item.payInfo.isFinalPeding = true
          isFixTotalPeding = true
        }
        fixTotalAmount += item.tradeInfo.skuList[0].skuAmount
      })
      this.setData({
        selectProduct: selectedPro,
        fixTotalAmount: fixTotalAmount,
        isFixTotalPeding: isFixTotalPeding
      })
      console.log(this.data.selectProduct, "输出选择的产品信息")
    }
  },
  // 发起订单-防重复提交
  throttleGenerateOrder: throttle(function () {
    this.validatePhone()
  }, 2000),
  // 校验手机号是否满足11位
  validatePhone() {
    let signManInfo = this.data.signManInfo // 签约人信息
    if ((/^1[3456789]\d{9}$/.test(signManInfo.mobile))) {
      this.validatePreAudit()
    } else {
      wx.showToast({
        icon: "none",
        title: '手机号格式有误，请到线索中修改后再发起订单！',
      })
    }
  },
  // 计算payCostList费用总金额
  fixPayCostAmount(payCostList) {
    let r = 0
    payCostList.forEach(item => {
      r = r + item
    })
    return r
  },
  // 一次性付款型传参计算
  fixDueTypePay(payInfo) {
    return [{
      payTypeId: 3, // 支付类型ID 1-定金 2-尾款 3-一口价
      payTypeAmount: this.fixPayCostAmount([
        payInfo.copyPayTypeInfo.dueTypeAgencyFee,
        payInfo.copyPayTypeInfo.dueTypeThirdPartyFee,
        payInfo.copyPayTypeInfo.dueTypeOfficialFee
      ]), // 类型合计金额（payCostList金额合计）
      // 费用列表
      payCostList: [{
          costTypeId: 1, // 1-代理费 2-第三方费用 3-官费 
          costAmount: payInfo.copyPayTypeInfo.dueTypeAgencyFee // 费用金额
        },
        {
          costTypeId: 2, // 1-代理费 2-第三方费用 3-官费 
          costAmount: payInfo.copyPayTypeInfo.dueTypeThirdPartyFee // 费用金额
        },
        {
          costTypeId: 3, // 1-代理费 2-第三方费用 3-官费 
          costAmount: payInfo.copyPayTypeInfo.dueTypeOfficialFee // 费用金额
        }
      ]
    }]
  },
  // 定金尾款型传参计算
  fixDepFinalTypePay(payInfo) {
    let r = []
    let list = ['', '']
    list.forEach((item, index) => {
      r.push({
        payTypeId: Number(index) + 1, // 支付类型ID 1-定金 2-尾款 3-一口价
        payTypeAmount: this.fixPayCostAmount(
          index == 0 ? [
            payInfo.copyPayTypeInfo.depositTypeAgencyFee,
            payInfo.copyPayTypeInfo.depositTypeThirdPartyFee,
            payInfo.copyPayTypeInfo.depositTypeOfficialFee
          ] : [
            payInfo.footPayStatus == 1 ? 0 : payInfo.copyPayTypeInfo.finalTypeAgencyFee,
            payInfo.footPayStatus == 1 ? 0 : payInfo.copyPayTypeInfo.finalTypeThirdPartyFee
          ]
        ), // 类型合计金额（payCostList金额合计）
        // 费用列表
        payCostList: index == 0 ? [{
            costTypeId: 1, // 1-代理费 2-第三方费用 3-官费 
            costAmount: payInfo.copyPayTypeInfo.depositTypeAgencyFee // 费用金额
          },
          {
            costTypeId: 2, // 1-代理费 2-第三方费用 3-官费 
            costAmount: payInfo.copyPayTypeInfo.depositTypeThirdPartyFee // 费用金额
          },
          {
            costTypeId: 3, // 1-代理费 2-第三方费用 3-官费 
            costAmount: payInfo.copyPayTypeInfo.depositTypeOfficialFee // 费用金额
          }
        ] : [{
            costTypeId: 1, // 1-代理费 2-第三方费用 3-官费 
            costAmount: payInfo.footPayStatus == 1 ? 0 : payInfo.copyPayTypeInfo.finalTypeAgencyFee // 费用金额
          },
          {
            costTypeId: 2, // 1-代理费 2-第三方费用 3-官费 
            costAmount: payInfo.footPayStatus == 1 ? 0 : payInfo.copyPayTypeInfo.finalTypeThirdPartyFee // 费用金额
          },
        ]
      })
    })
    return r
  },
  // 传参计算
  fixPayTypeList(payInfo) {
    // payWay 0-定金尾款 1=一次性付款
    return payInfo.payWay == 0 ? this.fixDepFinalTypePay(payInfo) : this.fixDueTypePay(payInfo)
  },
  // 传参价格计算
  fixGenelAmount(payInfo, fixVolist) {
    if (payInfo.payWay == 1) {
      return payInfo.productNum * fixVolist[0].payTypeAmount
    } else {
      return payInfo.productNum * (fixVolist[0].payTypeAmount + fixVolist[1].payTypeAmount)
    }
  },
  // 价格非空校验 // 支付类型payTypeId: 1-定金 2-尾款 3-一口价
  checkPrice(selectProduct) {
    console.log(selectProduct, "selectProduct")
    let status = false
    selectProduct.forEach(item => {
      // 定金尾款型（尾款待定）
      if (item.tailStatus == 0) {
        let r = item.payTypeVoList.filter(cItem => {
          return (cItem.payTypeId == 1) && (cItem.payTypeAmount == 0)
        })
        if (r.length > 0) {
          status = true
        }
      }
      // 定金尾款型（尾款确定）
      if (item.tailStatus == 1) {
        let r = item.payTypeVoList.filter(cItem => {
          return (cItem.payTypeAmount == 0)
        })
        if (r.length > 0) {
          status = true
        }
      }
      // 一次性付款型
      if (item.tailStatus == 3) {
        let r = item.payTypeVoList.filter(cItem => {
          return (cItem.payTypeAmount == 0)
        })
        if (r.length > 0) {
          status = true
        }
      }

    })
    return status
  },
  // 返回参数
  returnParams() {
    let orderStatus = this.data.orderStatus
    let clueType = this.data.clueType // 线索类型
    let clueInfo = this.data.clueInfo // 线索信息
    let signManInfo = this.data.signManInfo // 签约人信息
    let selectProduct = this.data.selectProduct // 选择的产品列表
    let tmOrderVoList = []
    selectProduct.forEach(item => {
      let fixVolist = this.fixPayTypeList(item.payInfo)
      tmOrderVoList.push({
        goodsSkuId: item.payInfo.cAttributeInfo.id,
        buyNum: item.payInfo.productNum,
        remark: item.payInfo.remark,
        orderPort: "APPLET",
        totalAmount: this.fixGenelAmount(item.payInfo, fixVolist),
        tailStatus: item.payInfo.payWay == 1 ? '3' : item.payInfo.footPayStatus == 1 ? 0 : 1, // 尾款状态（0：待定；1：待付款；3：无）
        payTypeVoList: fixVolist
      })
    })
    let params = {
      orderStatus: orderStatus, // 1-待签约 -2-草稿
      clueType: clueType,
      clueId: clueType == 2 ? clueInfo.clueCompanyId : clueInfo.cluePersonId,
      signName: signManInfo.name,
      signMobile: signManInfo.mobile,
      tmOrderVoList: tmOrderVoList,
      orderPort: 'APPLET',
      orderSource: 2
    }
    return params
  },
  // 发起订单添加弹窗提示
  generateNewOrder(params, status) {
    let orderStatus = this.data.orderStatus
    if (orderStatus == -2 || status) {
      this.generateFinalNewOrder(params)
    } else {
      let that = this
      wx.showModal({
        title: "确定发起订单？",
        cancelColor: "#A5A5A5",
        cancelText: "取消",
        confirmColor: "#0082FC",
        confirmText: "确定",
        success(res) {
          if (res.confirm) {
            that.generateFinalNewOrder(params)
          } else if (res.cancel) {}
        }
      })
    }
  },
  // 发起订单
  generateFinalNewOrder(params) {
    let orderStatus = this.data.orderStatus
    generateOrder(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        wx.showToast({
          icon: "success",
          title: orderStatus == 1 ? '操作成功！' : '存为草稿成功！',
        })
        this.selectComponent('#audit-tip').closeTip()
        let auditStatus = this.data.auditStatus
        setTimeout(() => {
          let orerListUrl = `/personal/pages/my-order/list/list?type=${auditStatus?3:orderStatus==1?0:3}`
          wx.redirectTo({
            url: orerListUrl,
          })
        }, 500)
      } else {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
      }
    })
  },
  // 判断是否需要审核人
  checkFinalAudit(params) {
    let orderStatus = this.data.orderStatus
    if (orderStatus == 1) {
      validateAudit(params).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          let status = res.data // 是否通过校验 true没通过 false通过
          this.setData({
            auditStatus: status
          })
          if (status) {
            this.showAuditTip() // 没通过弹窗
          } else {
            this.generateNewOrder(params, false) // 通过校验直接调用发起订单接口
          }
        } else {
          wx.showToast({
            icon: "none",
            title: res.msg,
          })
        }
      })
    } else {
      // 草稿状态不用调用审核判断接口
      this.generateNewOrder(params, true)
    }
  },
  // 判断订单总价是否符合要求
  validatePreAudit() {
    let params = this.returnParams()
    let checkStatus = this.checkPrice(params.tmOrderVoList)
    if (!checkStatus) {
      this.checkFinalAudit(params)
    } else {
      wx.showToast({
        icon: "none",
        title: '单条订单（定金/尾款/一口价）总价必须大于0！',
      })
    }
  },
  // 存为草稿
  saveDraft() {
    this.setData({
      orderStatus: -2
    })
    this.filterCreateOrder()
  },
  // 发起订单
  createLink() {
    this.setData({
      orderStatus: 1
    })
    this.filterCreateOrder()
  },
  // 发起订单校验
  filterCreateOrder() {
    let selectProduct = this.data.selectProduct // 选择的产品列表
    // 需要添加校验条件
    if (selectProduct.length > 0) {
      this.throttleGenerateOrder()
    } else {
      wx.showToast({
        icon: "none",
        title: '请添加订单!',
      })
    }
  },
  // 设置线索信息
  setClueInfo(options) {
    if (options.clueInfo) {
      let r = JSON.parse(options.clueInfo)
      this.setData({
        clueType: options.clueType,
        clueInfo: r,
        signManList: options.clueType == 2 ? r.clueCompanyContactList : [],
        signManInfo: options.clueType == 2 ? {
          name: r.clueCompanyContactList[0].contactName,
          mobile: r.clueCompanyContactList[0].mobile
        } : {
          name: r.contactName,
          mobile: r.mobile
        }
      })
      this.getAccountInfo()
    }
  },
  // 获取手机号授权状态
  getAccountInfo() {
    let clueType = this.data.clueType
    clueType == 2 ? this.getUnitInfo() : this.getSoloInfo()
  },
  // 获取单位授权信息
  getUnitInfo() {
    let organization = this.data.clueInfo.organization
    let params = {
      organization: organization
    }
    getByOrganizationForOrder(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let signManInfo = this.data.signManInfo
        let result = res.data
        if (result != null && result.length > 0) {
          let valideResult = result.filter(item => {
            return item.mobile == signManInfo.mobile
          })
          this.setData({
            phoneStatus: valideResult.length > 0 ? valideResult[0].authorizedType : 0
          })
        } else {
          this.setData({
            phoneStatus: 0
          })
        }
      }
    })
  },
  // 获取个人授权信息
  getSoloInfo() {
    let mobile = this.data.clueInfo.mobile
    if (mobile != null) {
      let params = {
        mobile: mobile
      }
      getByMobile(params).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          let result = res.data
          this.setData({
            phoneStatus: result.status == 2 ? 2 : 0
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setClueInfo(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setSelectedPro()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 页面卸载时移除选择产品
    wx.removeStorageSync('selectedPro')
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  }
})