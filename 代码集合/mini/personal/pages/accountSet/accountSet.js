// personal/pages/accountSet/accountSet.js
const app = getApp();
const getAccountDetail = require('../../../utils/api.js').getAccountDetail;
import {
  updataUserInfo
} from "../../../utils/common/utils.js";
import {
  getAutStatus,
  getMyAccountAndVipInfo
} from "../../../utils/api/user"
import {
  logOut
} from "../../../utils/api/user";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userState: {},
    optionList: [{
        title: "基本信息",
        url: "/personal/pages/Settings/Settings"
      },
      {
        title: "收件地址",
        url: `/personal/pages/address/address?type=${1}`
      },
      {
        title: "实名认证",
        url: `/personal/pages/authentication/authentication?accountType=' + ${wx.getStorageSync('userInfo').accountType} + '&status=' + ${wx.getStorageSync('userInfo').accountType}`
      }
    ]
  },

  // 跳转对应页面
  skip(e) {
    console.log(e);
    console.log(e);
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  // 修改tabbar index
  changeTabbar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        isLogin: false
      })
    }
  },
  layout() {
    let that = this;
    logOut().then(res => {
      if (res.code == 0) {
        // 清除所有storageSync
        wx.clearStorageSync()
        wx.setStorageSync('hasLogo', false);
        wx.showToast({
          title: '退出成功！',
        });
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/me/me'
          })
        }, 300)
        that.onShows();
      }
    })
  },
  onShows() {
    // updataUserInfo(this);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    let info = app.checkLogin(true);
    this.setData({
      userInfo: info
    })
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