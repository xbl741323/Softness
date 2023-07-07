const app = getApp();
var WxParse = require('../wxParse/wxParse.js');
const getPropertyDetail = require('../../../utils/api.js').getPropertyDetail;
const addPropertyCollection = require('../../../utils/api.js').addPropertyCollection;
const deletePropertyCollection = require('../../../utils/api.js').deletePropertyCollection;
import {
  addCollect,
  batchDelCollect
} from "../../../utils/api/collect.js"
Page({
  data: {
    productInfo: {},
    userInfo: {},
    evaluateList: ['快速响应', '专业代理', '品质服务', '无忧售后'],
    title: "",
    slogan: "",
    coverUrl: "",
    imageUrl: app.globalData.imageURL,
    bannerList: [],
    isShowNavbar: false,
    showTop: false,
    articleArray: [],
    toViewid: 'list0',
    propertyId: '',
    isCollected: '',
    shareTitle: "",
    resourceTitle: '',
    isOnline: 1,
    hasPublicExpense: 1,
    feeType: "",
    agencyFee: "",
    previousFee: "",
    optionList: [],
    agencyFeeType: 0,
    productCount: 1,
    show: true,
  },
  // 总价计算
  totalFix() {
    let type = this.data.feeType // type 产品价格类型 2：仅官费  否则：其他
    let count = this.data.productCount // 选择的产品数量
    let nowFee = this.data.agencyFee // nowFee 现单价
    if (type == 2) {
      return count * (Number(nowFee))
    } else {
      let hasPublicExpense = this.data.hasPublicExpense
      let index = this.data.agencyFeeType // 官费代缴选择下标
      let governmentFee = hasPublicExpense == 0 ? this.data.optionList[index].typeFee : 0 // governmentFee 此处仅表示官费代缴费用
      return count * (Number(nowFee) + Number(governmentFee))
    }
  },
  // 官费计算
  governmentFeeFix() {
    let type = this.data.feeType // type 产品价格类型 2：仅官费  否则：其他
    let nowFee = this.data.agencyFee // nowFee 现单价
    if (type == 2) {
      return nowFee
    } else {
      let hasPublicExpense = this.data.hasPublicExpense
      let index = this.data.agencyFeeType // 官费代缴选择下标
      let governmentFee = hasPublicExpense == 0 ? this.data.optionList[index].typeFee : 0 // governmentFee 此处仅表示官费代缴费用
      return governmentFee
    }
  },
  // 判断用户是否认证（需求更改，不需要判断用户是否认证）
  checkUser() {
    this.toSubmit()
  },
  // 跳转到提交订单页面
  toSubmit() {
    let info = this.data.productInfo
    let index = this.data.agencyFeeType
    let params = {
      pageFrom: 1, // 1 代表从产品页面进
      id: info.id, // 产品id
      number: info.number, // 产品number
      agencyFee: info.agencyFee, // 产品agencyFee
      thirdPartyFee: info.thirdPartyFee, // 产品thirdPartyFee
      trustGmFee: info.governmentFee, // 产品governmentFee
      trustGmFeeTypeId: info.feeType !== 2 ? (info.hasPublicExpense == 0 ? this.data.optionList[index].id : "") : "", // 官费代缴id
      trustGmFeeTypeName: info.feeType !== 2 ? (info.hasPublicExpense == 0 ? this.data.optionList[index].typeName : "") : "", // 官费代缴name
      coverUrl: info.coverUrl, // 封面
      productName: info.name, // 产品名称
      nowFee: info.nowFee, // 现价
      feeType: info.feeType, // 费用类型
      productCount: this.data.productCount, // 选择的产品数量
      productType: info.type, // 产品类型
      governmentFee: this.governmentFeeFix(), // 计算后的官费（与产品governmentFee不同）
      hasPublicExpense: info.hasPublicExpense, // 是否添加官费
      totalPrice: this.totalFix() // 总价
    }
    let data = JSON.stringify(params)
    wx.navigateTo({
      url: `/order/pages/submitOrder/propertyOrder/propertyOrder?data=${data}`,
    })
  },
  // 减少产品数量
  reduceCount() {
    if (this.data.productCount > 1) {
      this.setData({
        productCount: this.data.productCount - 1
      })
    }
  },
  // 增加产品数量
  addCount() {
    if (this.data.productCount < 99) {
      this.setData({
        productCount: this.data.productCount + 1
      })
    }
  },
  // 选择官费option
  changeAgencyType(e) {
    this.setData({
      agencyFeeType: e.currentTarget.dataset.optionindex
    })
  },
  // 关闭上拉价格面板
  closePriceDialog() {
    this.setData({
      show: true
    })
  },
  // 展示上拉价格面板
  showPriceDialog() {
    this.setData({
      show: false
    })
  },
  // 跳转到代理费展示页面
  toAgencyFee() {
    wx.navigateTo({
      url: '/search/pages/agencyFee/agencyFee',
    })
  },
  // 回到首页
  toIndex() {
    wx.switchTab({
      url: "/pages/index/index",
    })
  },
  //收藏操作
  handlCollection() {
    var that = this;
    if (this.data.isCollected == 0) {
      let params = {
        number: this.data.propertyId,
        resourceTitle: this.data.resourceTitle,
      }
      deletePropertyCollection(params).then(res => {
        if (res.code == 0) {
          wx.showToast({
            title: '已取消收藏',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            isCollected: 1
          })
        }
      })
    } else {
      let params = {
        number: this.data.propertyId,
        resourceTitle: this.data.resourceTitle,
      }
      addPropertyCollection(params).then(res => {
        if (res.code == 0) {
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            isCollected: 0
          })
        }
      })
    }
  },
  // 回到页面顶部
  toTop() {
    app.toTop()
  },
  //监听页面滑动
  onPageScroll(e) {
    var that = this;
    if (e.scrollTop > 0) {
      that.setData({
        showTop: true
      })
    } else {
      that.setData({
        showTop: false
      })
    }
    wx.createSelectorQuery().select('#productBox').boundingClientRect(function (rect) {
      if (rect.top < 0) {
        that.setData({
          isShowNavbar: true
        })
      } else {
        that.setData({
          isShowNavbar: false
        })
      }
    }).exec()
  },
  changeNavBar(e) {
    let myid = e.currentTarget.dataset.myid;
    this.setData({
      toViewid: myid
    })
    var query = wx.createSelectorQuery() //创建节点查询器    
    query.selectViewport().scrollOffset(); //节点的竖直滚动位置
    query.select(`#${myid}`).boundingClientRect() //动态获取id
    query.exec(function (res) { //执行请求
      wx.pageScrollTo({
        scrollTop: res[0].scrollTop + res[1].top, //滚动到页面节点的上边界坐标
        duration: 0 // 滚动动画的时长
      });
    })
  },
  getData() {
    var that = this;
    let params = {
      id: this.data.propertyId,
      browser: true
    }
    getPropertyDetail(params).then(res => {
      let content = res.data.detail.labelAndContent;
      let titleList = [];
      for (let i = 0; i < content.length; i++) {
        titleList.push({
          id: 'list' + i,
          name: content[i].name
        })
        WxParse.wxParse('article' + i, 'html', content[i].content, that);
        if (i === content.length - 1) {
          WxParse.wxParseTemArray("articleArray", 'article', content.length, that)
        }
      }
      console.log(this.data.articleArray)
      that.setData({
        productInfo: res.data.detail,
        title: res.data.detail.name,
        slogan: res.data.detail.slogan,
        coverUrl: res.data.detail.coverUrl,
        bannerList: titleList,
        isCollected: res.data.isCollected,
        shareTitle: res.data.detail.name,
        resourceTitle: res.data.detail.name,
        agencyFee: res.data.detail.nowFee,
        previousFee: res.data.detail.previousFee,
        isOnline: res.data.detail.isOnline,
        feeType: res.data.detail.feeType,
        hasPublicExpense: res.data.detail.hasPublicExpense,
        optionList: res.data.detail.governmentFeeTypeList,
      })
      this.data.optionList.forEach((item, index) => {
        if (item.isDefault == 0) {
          this.setData({
            agencyFeeType: index
          })
        }
      })
    })
  },
  // 转发给朋友
  onShareAppMessage(res) {
    return {
      title: this.data.shareTitle,
    }
  },
  //分享到朋友圈
  onShareTimeline() {
    return {
      title: this.data.shareTitle,
    }
  },
  onLoad: function (options) {
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }
    this.setData({
      propertyId: options.propertyId
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
  },

})