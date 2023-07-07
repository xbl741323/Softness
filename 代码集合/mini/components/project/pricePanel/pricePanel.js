// components/project/pricePanel/pricePanel.js
import {
  filterUrl
} from "../../../utils/common/utils"
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    projectInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    productCount: 1,
    show: true,
    feeType: 1,
    agencyFeeType: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closePriceDialog() {
      this.triggerEvent('changeShow')
    },
    toAgencyFee() {
      wx.navigateTo({
        url: '/search/pages/agencyFee/agencyFee',
      })
    },
    changeAgencyType(e) {
      this.setData({
        agencyFeeType: e.currentTarget.dataset.optionindex
      })
    },
    reduceCount() {
      if (this.data.productCount > 1) {
        this.setData({
          productCount: this.data.productCount - 1
        })
      }
    },
    addCount() {
      if (this.data.productCount < 99) {
        this.setData({
          productCount: this.data.productCount + 1
        })
      }
    },
    // 判断用户是否认证（需求更改，付定金时不需要判断用户是否认证）
    checkUser() {
      this.toSubmit()
    },
    // 总价计算
    totalFix() {
      let optionList = this.data.projectInfo.policyGovfeeTypeList
      console.log(optionList, "optionList")
      let count = this.data.productCount // 选择的产品数量
      let earnestMoney = this.data.projectInfo.earnestMoney // earnestMoney 定金
      if (optionList.length == 0) {
        return count * (Number(earnestMoney))
      } else {
        let index = this.data.agencyFeeType // 官费代缴选择下标
        let governmentFee = optionList[index].typeFee // governmentFee 此处仅表示官费代缴费用
        return count * (Number(earnestMoney) + Number(governmentFee))
      }
    },
    // 项目申报提交订单
    toSubmit() {
      let info = this.data.projectInfo
      let index = this.data.agencyFeeType
      let optionList = this.data.projectInfo.policyGovfeeTypeList
      let params = {
        pageFrom: 1, // 1 代表从产品页面进
        id: info.id, // 产品id
        number: info.number, // 产品number
        agencyFee: info.agencyFee, // 产品agencyFee
        thirdPartyFee: info.thirdPartyFee, // 产品thirdPartyFee
        trustGmFeeTypeId: optionList.length > 0 ? optionList[index].id : "", // 选择的官费代缴id
        trustGmFeeTypeName: optionList.length > 0 ? optionList[index].typeName : "", // 选择的官费代缴name
        trustGmFeeTypeValue: optionList.length > 0 ? optionList[index].typeFee : "", // 选择的官费代缴value
        coverUrlInfo: filterUrl(info.coverUrl, info.coverUrls), // 封面对象
        productName: info.title, // 产品名称
        earnestMoney: info.earnestMoney, // 定金
        nowFee: info.nowFee, // 现价
        productCount: this.data.productCount, // 选择的产品数量
        feeType: optionList.length > 0 ? 1 : 2, // 此处用于判断是否有官费和选择了官费 1-选择了官费 2-没有选择官费 
        totalPrice: this.totalFix(), // 总价
        tailstatusPayFlag: false // 是否支付尾款
      }
      let data = JSON.stringify(params)
      wx.navigateTo({
        url: `/order/pages/submitOrder/projectOrder/projectOrder?data=${data}`,
      })
    },
  },
  lifetimes:{
    attached: function() {
      if (wx.getStorageSync('userInfo')) {
        this.setData({
          userInfo: wx.getStorageSync('userInfo')
        })
      }
    }
  }
})