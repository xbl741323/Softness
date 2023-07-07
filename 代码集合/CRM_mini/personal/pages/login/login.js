// personal/pages/login/login.js
import {
  empLogin,
} from "../../../utils/api/personal"
import {
  getCategoryList,
  getArea,
  allFactor
} from "../../../utils/api/category"
import {
  encryption
} from "../../utils/ase"
import * as CodeMsg from "../../../utils/common/codeMsg";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pwdStatus: true, // 控制密码是否加密
    backToken: "", // 后端返回的唯一token值
    secretKey: "", // 后端返回的加密秘钥字段
    backImgBase: "", // 滑块背景图
    blockBackImgBase: '', //验证滑块的背景图片
    empNumber: "",
    empPwd: "",
    numberError: false, // false校验通过 true校验不通过
    pwdError: false,
    btnDisabled: true,
    //滑动验证码-弹出式
    captchaOption: {
      baseUrl: app.globalData.baseURL, //服务器前缀
      mode: 'pop', //弹出式pop，固定fixed, 默认：pop
      captchaType: "blockPuzzle", //验证码类型：滑块blockPuzzle，点选clickWord，默认：blockPuzzle
      imgSize: { //底图大小, 默认值：{ width: '310px',height: '155px'}
        width: '295px',
        height: '147px',
      },
      barHeight: '32px', //滑块大小，默认值：{ width: '310px',height: '40px'}
      vSpace: 5, //底图和verify-bar-area间距，默认值：5像素
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      },
    },
  },
  // 修改加密状态
  changePwdStatus(){
    this.setData({
      pwdStatus: !this.data.pwdStatus
    })
  },
  // 员工登录
  empLogin() {
    this.checkLoginInfo()
    if (!this.data.numberError && !this.data.pwdError) {
      this.selectComponent('.demo2').show();
    }
  },
  // 获取员工工号
  getNumber(e) {
    this.setData({
      empNumber: e.detail.value.trim()
    })
  },
  // 获取员工密码
  getPwd(e) {
    this.setData({
      empPwd: e.detail.value.trim()
    })
  },
  // 工号 + 密码非空校验
  checkLoginInfo() {
    this.setData({
      numberError: this.data.empNumber == '' ? true : false,
      pwdError: this.data.empPwd == '' ? true : this.data.empPwd.length < 6 ? true : false,
    })
  },
  // 滑块验证成功
  verifySuccess(val) {
    // 进行加密处理
    const user = encryption({
      data: {
        username: this.data.empNumber,
        password: this.data.empPwd,
        code: val.detail.captchaVerification.trim(),
        randomStr: 'blockPuzzle'
      },
      key: 'pigxpigxpigxpigx',
      param: ['password']
    })
    // 调用登录接口
    let params = {
      randomStr: "blockPuzzle",
      code: user.code.trim(),
      grant_type: "password",
    }
    let data = {
      username: user.username,
      password: user.password
    }
    empLogin(params, data).then(res => {
      if (res.access_token) {
        wx.showToast({
          icon: "success",
          title: '登录成功！',
        })
        wx.setStorageSync('accessInfo', res)
        wx.setStorageSync('userInfo', res.user_info)
        this.getCategoryData()
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index',
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
      if (res.code == 1000) {
        wx.setStorageSync('areas', res.data.area)
      }
    })
  },
  // 跳转微信登录界面
  wxLogin() {
    wx.navigateTo({
      url: '/personal/pages/wxlogin/wxlogin',
    })
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