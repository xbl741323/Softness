// pages/index/index.js
const app = getApp()
import {
  getCategoryList,
  getArea,
  allFactor,
} from "../../utils/api/category"
import {
  getUserDetail,
  getQrCode
} from "../../utils/api/personal"
import * as CodeMsg from "../../utils/common/codeMsg";
import {
  filterPer,
  workList,
  swiprList,
  heZhuoList
} from '../../utils/order/order.js'
import {
  filterPermissons
} from '../../utils/common/utils'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    bgUrl: "/image/index/img-CRM@2x.png",
    workList: [],
    heZhuoList: [],
    swiprList: [],
    userInfo: {},
    isLogin: false,
    url: '',
    show: false
  },
  // 获取订阅url
  getUrl() {
    getQrCode({
      number: wx.getStorageSync('userInfo').number
    }).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        this.setData({
          url: res.data
        })
      } else {
        wx.showToast({
          icon: "none",
          title: res.msg,
          duration: 1000
        })
      }
    })
  },
  // 修改tabbar index
  changeTabbar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
      })
    }
  },
  // 检查登录状态
  checkLoginStatus() {
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        isLogin: true
      })
      this.getCategoryData()
    } else {
      this.setData({
        isLogin: false
      })
      wx.navigateTo({
        url: '/personal/pages/login/login',
      })
    }
  },
  // 设置缓存数据
  getCategoryData() {
    // 获取分类数据
    getCategoryList().then(res => {
      if (res.code == CodeMsg.CODE_1000) {
        wx.setStorageSync('category', res.data)
      }
    })
    // 获取地区数据
    getArea().then(res => {
      if (res.code == CodeMsg.CODE_0) {
        wx.setStorageSync('area', res.data)
      }
    })
    allFactor(4).then(res => {
      if (res.code == CodeMsg.CODE_1000) {
        wx.setStorageSync('areas', res.data.area)
      }
    })
  },
  // 获取用户详情
  getUserDetail() {
    let show = this.data.show
    if (wx.getStorageSync('userInfo')) {
      getUserDetail({
        id: wx.getStorageSync('userInfo').id
      }).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          let data = res.data
          data.wxOpenid = data.wxOpenid == null ? '' : data.wxOpenid
          show = data.wxOpenid != '' ? false : true
          data.wxOpenid == '' && this.getUrl()
          if (wx.getStorageSync('close')) {
            show = false
          }
          this.filterList(data.isPartner);
          this.setData({
            show: show
          })
        }
      })
    }
  },
  filterList(isPartner) {
    if(isPartner){
      this.setData({
        heZhuoList: filterPer(heZhuoList()),
        swiprList: filterPermissons(swiprList())
      })
    }else{
      this.setData({
        workList: filterPer(workList()),
        swiprList: filterPermissons(swiprList())
      })
    }
  },
  // 页面跳转
  skipToPage(e) {
    let item = e.currentTarget.dataset.item
    if (item.path != "") {
      wx.navigateTo({
        url: item.path,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.changeTabbar()
    this.checkLoginStatus()
    this.getUserDetail()
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

})