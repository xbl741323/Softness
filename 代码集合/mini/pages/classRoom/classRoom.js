// pages/classRoom/classRoom.js
const app = getApp();
import {
  getSVideoList,
  getClassList,
  getPlateList,
  getPlateRelateClass
} from "../../utils/api/wtClass"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    imageUrl: app.globalData.imageURL,
    temUrl: "https://static-tst.wotao.com/icon/head/9ded28f1ded944519df7fa73d4f85823.png",
    swiperList: [{
      imgUrl: '/image/classRoom/pic_banner@2x.png'
    }],
    shortList: [],
    freeList: [], // 完全免费
    vipFreeList: [], // vip免费
    soloFeeList: [], // 单独收费
    courseList: [],
    plateId: '',
    classifyList: [],
  },
  // 修改tabbar index
  changeTabbar() {
    let islogin = wx.getStorageSync('userInfo') ? true : false
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3,
        isLogin: islogin
      })
    }
  },
  // 获取短视频列表
  getShortList() {
    let params = {
      pageSize: 10,
      pageNo: 1
    }
    getSVideoList(params).then(res => {
      if (res.code == 0) {
        this.setData({
          shortList: res.data.records
        })
      }
    })
  },
  // 获取课程列表
  getClassData(type) {
    let params = {
      pageSize: type == 1 ? 4 : type == 2 ? 3 : 6,
      pageNo: 1,
      baseShowState: 1,
      getTrySeeSectionNumber: true,
      tradingChargeType: type, // 1-完全免费 2-vip免费 3-单独收费
    }
    getClassList(params).then(res => {
      if (res.data.code == 0) {
        let list = res.data.data.records
        this.filterClassData(type, list)
      }
    })
  },
  // 针对不同类型课程列表复制
  filterClassData(type, list) {
    let classObj = type == 1 ? { // 1-完全免费
      freeList: list
    } : type == 2 ? { // 2-vip免费
      vipFreeList: list
    } : type == 3 ? { // 3-单独收费
      soloFeeList: list
    } : ""
    this.setData(classObj)
  },
  // 获取板块列表数据
  getPlateData() {
    getPlateList().then(res => {
      if (res.code == 0 && res.data.length > 0) {
        let plateId = this.data.plateId
        this.setData({
          classifyList: res.data,
          plateId: plateId != '' ? plateId : res.data[0].id // 初始化板块tab值
        })
        this.getPlateRelateData()
      }
    })
  },
  // 新产品类型选择
  changeNew(e) {
    let plateId = e.currentTarget.dataset.id
    this.setData({
      plateId: plateId
    })
    this.getPlateRelateData()
  },
  // 获取板块关联课程列表数据
  getPlateRelateData() {
    let plateId = this.data.plateId
    let params = {
      pageSize: 1000,
      pageNo: 1,
      baseShowState: 1,
      tradingChargeType: 2,
      plateId: plateId,
      getTrySeeSectionNumber: true,
    }
    getPlateRelateClass(params).then(res => {
      if (res.code == 0) {
        this.setData({
          courseList: res.data.records
        })
      }
    })
  },
  // 跳转课程详情
  toCourseDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/classRoom/pages/detail/course/course?id=${id}`,
    })
  },
  // 跳转短视频详情
  toShortDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/classRoom/pages/detail/shortVideo/shortVideo?id=${id}`,
    })
  },
  // 校验登录
  checkLoginStatus() {
    if (!wx.getStorageSync('userInfo')) {
      this.setData({
        isLogin: false
      })
      wx.navigateTo({
        url: "/personal/pages/wxLogin/wxLogin"
      })
    } else {
      this.getShortList()
      this.getClassData(1)
      this.getClassData(2)
      this.getClassData(3)
      // 获取板块-及关联课程数据
      this.getPlateData()
      this.setData({
        isLogin: true
      })
    }
  },
  // 跳转到vip会员
  toVip() {
    wx.navigateTo({
      url: '/personal/pages/class/member'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // tabbar切换赋值
    this.changeTabbar()
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
    this.checkLoginStatus()
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