// search/pages/newProductDetail/newProductDetail.js
const app = getApp();
var WxParse = require('../wxParse/wxParse.js');
import {
  getProductDetail,
  addPageViews
} from "../../../utils/api/product.js"
import {
  addCollect,
  batchDelCollect
} from "../../../utils/api/collect.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 0-已收藏 1-未收藏
    isCollected: 1,
    showAll: false, // 是否显示内容
    navBarIndex: 0, // 导航头下标
    showTabStatus: false, // 控制导航头显示
    productInfo: {},
    imageUrl: app.globalData.imageURL,
    cType: "", // 产品类型
    id: "", // 产品id
    articleTitleArray: [],
    articleArray: [],
    coverUrls: [],
    introList: ["快速响应", "专业代理", "品质服务", "无忧售后"],
    iconList: [{
      name: "全程监督",
      url: "/search/image/details/jd_icon.png"
    }, {
      name: "保障权益",
      url: "/search/image/details/qy_icon.png"
    }, {
      name: "多年经验",
      url: "/search/image/details/jy_icon.png"
    }]

  },
  // 转换type
  translateType() {
    let cType = this.data.cType
    return cType == 2 ? 2 : cType == 3 ? 3 : cType == 4 ? 4 : cType == 5 ? 5 : cType == 6 ? 6 : ""
  },
  //收藏操作 gs-2 cs-3 rz-4 fl-5 rj-6
  handlCollection() {
    var that = this;
    let accountId = wx.getStorageSync('accountId')
    if (this.data.isCollected == 0) {
      let params = {
        accountId: accountId,
        numbers: [this.data.productInfo.number],
      }
      batchDelCollect(params).then(res => {
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
        accountId: accountId,
        number: this.data.productInfo.number,
        type: this.translateType(),
      }
      addCollect(params).then(res => {
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
  // 导航头选择并滑动到指定区域
  changeNav(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      navBarIndex: index
    })
    var query = wx.createSelectorQuery() // 创建节点查询器    
    query.selectViewport().scrollOffset(); // 节点的竖直滚动位置
    query.select(`#pc-item${index}`).boundingClientRect() // 动态获取id
    query.exec(function (res) { // 执行请求
      console.log(res)
      wx.pageScrollTo({
        scrollTop: res[0].scrollTop + res[1].top - 60, // 滚动到页面节点的上边界坐标
        duration: 0 // 滚动动画的时长
      });
    })
  },
  // 获取产品详情
  getDetail() {
    wx.showLoading({
      title: '加载中',
    })
    let cType = this.data.cType
    let id = this.data.id
    let params = {
      id: id,
    }
    getProductDetail(params, cType).then(res => {
      if (res.code == 0) {
        this.setData({
          productInfo: res.data
        })
        console.log(this.data.productInfo)
        if (res.data.coverUrls && res.data.coverUrls.length > 0) {
          let urlList = [];
          res.data.coverUrls.forEach((item, index) => {
            urlList[index] = Object.assign(item, {
              urlType: item.url.substr(item.url.lastIndexOf('.') + 1)
            })
          })
          this.setData({
            coverUrls: urlList,
          });
        }
        let articleArray = [];
        if (res.data.labelOneName !== "" && res.data.labelOneName !== null) {
          articleArray.push({
            title: res.data.labelOneName,
            content: res.data.labelOneContent,
          })
        }
        if (res.data.labelTwoName !== "" && res.data.labelTwoName !== null) {
          articleArray.push({
            title: res.data.labelTwoName,
            content: res.data.labelTwoContent,
          })
        }
        if (res.data.labelThreeName !== "" && res.data.labelThreeName !== null) {
          articleArray.push({
            title: res.data.labelThreeName,
            content: res.data.labelThreeContent,
          })
        }
        if (res.data.labelFourName !== "" && res.data.labelFourName !== null) {
          articleArray.push({
            title: res.data.labelFourName,
            content: res.data.labelFourContent,
          })
        }
        this.setData({
          articleTitleArray: articleArray
        })
        let that = this
        for (let i = 0; i < articleArray.length; i++) {
          WxParse.wxParse('article' + i, 'html', articleArray[i].content, that);
          if (i === articleArray.length - 1) {
            WxParse.wxParseTemArray("articleArray", 'article', articleArray.length, that);
          }
        }
        wx.hideLoading({
          success: (res) => {
            that.setData({
              showAll: true
            })
          },
        })

      }
    })
  },
  //监听页面滑动
  onPageScroll(e) {
    let that = this
    wx.createSelectorQuery().select('#productBox').boundingClientRect(function (rect) {
      if (rect.top <= 70) {
        that.setData({
          showTabStatus: true
        })
      } else {
        that.setData({
          showTabStatus: false
        })
      }
    }).exec()
  },
  // 添加浏览量
  addViews(options) {
    let params = {
      id: options.id,
      type: options.type
    }
    addPageViews(params).then(res => {})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.data) {
      let data = JSON.parse(options.data)
      this.setData({
        cType: data.type,
        id: data.id
      })
      this.getDetail()
      this.addViews(data)
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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