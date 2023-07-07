// pages/personal/personal.js
const app = getApp();
import {
  empLogout,
  editInfo
} from "../../utils/api/personal"
import * as CodeMsg from "../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    userInfo: "",
    accessInfo: "",
    userList: null,
    imageUrl: app.globalData.imageURL,
    workList: [{
        imgUrl: "/image/personal/icon_my_popularize@2x.png",
        title: "我的推广",
        disabled: false,
        path: "/personal/pages/my-promotion/my-promotion"
      },
      {
        imgUrl: "/image/personal/icon_my_collect_gray@2x.png",
        title: "我的收藏",
        disabled: true,
        path: ""
      },
      {
        imgUrl: "/image/personal/icon_my_journal@2x.png",
        title: "我的日志",
        disabled: false,
        path: "/personal/pages/my-blogs/list/index"

      },
      {
        imgUrl: "/image/personal/icon_setting_up_gray@2x.png",
        title: "账户设置",
        disabled: true,
        path: ""
      },
    ],
    logoUrl: "",
    imgbase64: "",
    isRefresh: false
  },
  // 工作列表跳转
  toWorkItem(e) {
    let item = e.currentTarget.dataset.item
    if (item.path != "") {
      wx.navigateTo({
        url: item.path,
      })
    }
  },
  // 跳转到微信登录页
  toLogin() {
    wx.navigateTo({
      url: '/personal/pages/login/login',
    })
  },
  // 退出登录
  logout() {
    let that = this
    wx.showModal({
      title: "确定退出？",
      cancelColor: "#36A6FE",
      cancelText: "再想想",
      confirmColor: "#999999",
      confirmText: "确定",
      success(res) {
        if (res.confirm) {
          wx.showToast({
            icon: "success",
            title: '退出成功！',
          })
          empLogout().then(res => {
            if (res.code == CodeMsg.CODE_0) {
              wx.clearStorageSync()
              that.checkLoginStatus()
            }
          })
        } else if (res.cancel) {}
      }
    })

  },
  // 修改tabbar index
  changeTabbar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3,
      })
    }
  },
  // 检查登录状态
  checkLoginStatus() {
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        accessInfo: wx.getStorageSync('accessInfo'),
        isLogin: true
      })
    } else {
      this.setData({
        isLogin: false
      })
      wx.navigateTo({
        url: '/personal/pages/login/login',
      })
    }
  },
  // 更改用户头像
  updateAvatar(username, img) {
    let that = this
    let params = {
      username: username,
      avatar: img
    }
    editInfo(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let user = wx.getStorageSync('userInfo');
        user.avatar = img
        wx.setStorageSync('userInfo', user);
        that.onShow()
      }
    })
  },
  // 调用摄像头拍照
  openCamera() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        let imgbase64 = 'data:image/png;base64,' + wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], "base64")
        that.setData({
          logoUrl: res.tempFilePaths[0],
          imgbase64: imgbase64
        });
        wx.uploadFile({
          filePath: that.data.logoUrl,
          name: 'file', //后台接收图片的字段
          url: app.globalData.baseURL + "/wtcrm/file/upload",
          method: "post",
          formData: imgbase64,
          header: {
            "Content-Type": "multipart/form-data",
            'Authorization': 'Bearer ' + that.data.accessInfo.access_token,
          },
          success(res) {
            let data = JSON.parse(res.data)
            if (data.code == CodeMsg.CODE_0) {
              that.updateAvatar(that.data.userInfo.username, data.data)
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.changeTabbar()
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

})