// personal/pages/wxlogin/wxlogin.js
import {
  getCode, verifyNum, mobileVer, wxBind, wxLogin, changeWxBind
} from "../../../utils/api/personal"
import * as CodeMsg from "../../../utils/common/codeMsg";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showStatus: 0,
    btnDisabled: true,
    btnText: "获取验证码",
    codeTime: 0,
    empNumber: "",
    empPwd: "",
    empCode: "",
    mobile:'',
    phone:'',//脱敏的手机号
    unionId:'',
    newUnionId:'',
    userId:'',
    numberError: false,
    pwdError: false,
    codeError: false,
    wxInfo: {},
    isUsed: false,
    bindStatus: false,
    code: '',//微信返回code
    show: false,
    isChange: false// 是否换绑 true 换绑    
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
  // 获取短信验证码
  getCode(e) {
    this.setData({
      empCode: e.detail.value.trim()
    })
  },
  // 工号 + 密码非空校验
  checkLoginInfo() {
    this.setData({
      numberError: this.data.empNumber == '' ? true : false,
      pwdError: this.data.empPwd == '' ? true : this.data.empPwd.length < 6 ? true : false,
      codeError: this.data.empCode== '' ? true : false,
    })
  },
  //获取验证码
  sendMsg() {
    var that = this
    getCode(that.data.mobile).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        wx.showToast({
          title: "正在向"+that.data.phone+"发送验证码",
          icon: "none",
          duration: 1500,
          success: function(){
            that.timer(that);
          }
        })
        that.setData({
          codeTime: 60,
          btnDisabled: true
        })
      } else if (res.code == CodeMsg.CODE_1) {
        wx.showToast({
          title: res.data.cnMsg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  timer:function(that) {
    var interval = setInterval(function(){
      var codeTime = that.data.codeTime
      if(codeTime == 0){
        that.setData({
          codeTime: 60,
          btnDisabled: true,
          btnText: '获取验证码'
        })
        clearInterval(interval)
      }else{
        codeTime --; 
        that.setData({
          codeTime: codeTime,
          btnDisabled: false,
          btnText: codeTime + "s后重新获取",
        })
      }
    },1000)
  },
  // 员工登录
  empLogin() {
    this.checkLoginInfo()
    if(this.data.empCode != ''){
      this.mobileVer()
    }
  },
  // 检查绑定状态
  judgeIsBind(e) {
    let that = this
    let wxInfo = that.data.wxInfo;
    let grant_type = 'mobile'
    wx.login({
      success: function (res) {
        that.setData({
          code: res.code
        })
        wxLogin({mobile: 'MINI@' + that.data.code, grant_type}).then(res=>{
          if(res.access_token){
            wx.showToast({
              icon: "success",
              title: '微信登录成功',
              duration: 1000
            })
            wx.setStorageSync('accessInfo', res)
            wx.setStorageSync('userInfo', res.user_info)
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }, 500)
          }else if(res.code == CodeMsg.CODE_90002){
            wx.showToast({
              icon: "none",
              title: '该微信未绑定员工账号，请输入信息进行绑定',
              duration: 2000
            })
            that.setData({
              unionId: res.data,
              showStatus: 1
            })
          }else{
            wx.showToast({
              icon: "none",
              title: res.msg,
              duration: 2000
            })
          }
        })
      }
    })
  },
  // 获取微信头像昵称信息
  getUserProfile(e) {
    // 推荐使用 wx.getUserProfile 获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于获取账号名和头像', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        wx.setStorageSync('wxInfo', res);
        this.setData({
          wxInfo: res.userInfo,
        })
        this.judgeIsBind();
      }
    })
  },
  // 获取微信头像昵称
  getUserInfo(e) {
    // 用户同意授权
    var that = this;
    if (e.detail.errMsg == 'getUserInfo:ok') {
      // 3.请求自己的服务器，解密用户信息 获取unionId等加密信息(返回是否登录)
      that.judgeIsBind();
    } else {
      wx.setStorageSync('isLogin', false);
      wx.showModal({
        title: '提示',
        content: '需要通过授权才能继续，请重新点击并授权！',
        showCancel: false,
        confirmColor: '#3AA6FB',
        complete: function (res) {},
      })
    }
  },
  // 工号密码校验
  verifyNum(){
    this.setData({
      numberError: this.data.empNumber == '' ? true : false,
      pwdError: this.data.empPwd == '' ? true : this.data.empPwd.length < 6 ? true : false,
    })
    
    let params = {
      number: this.data.empNumber,
      password: this.data.empPwd
    }
    if(!this.data.numberError&&!this.data.pwdError){
      verifyNum(params).then(res => {
        if(res.code == CodeMsg.CODE_0){
          this.setData({
            mobile: res.data,
            phone: res.data.substring(0,3) + '****' + res.data.substring(7),
            btnDisabled: false
          })
        }else{
          wx.showToast({
            icon: "none",
            title: res.msg,
            duration: 1000
          })
        }
      })
    }
  },
  // 微信绑定工号
  wxBind(){
    let params = {
      avatar: '',//微信头像
      username: '',//微信用户名称
      nickname: '',//微信用户昵称
      userId: this.data.userId,
      unionId: this.data.unionId
    }
    if(wx.getStorageSync('wxInfo')){
      params.avatar = wx.getStorageSync('wxInfo').userInfo.avatarUrl //微信头像
      params.nickname = wx.getStorageSync('wxInfo').userInfo.nickName //微信用户名称
      params.username = wx.getStorageSync('wxInfo').userInfo.nickName //微信用户昵称
    }
    wxBind(params).then(res => {
      if(res.code == CodeMsg.CODE_0){
        this.wxLogin()
      }else if(res.code == CodeMsg.CODE_90007){
        this.setData({
          show: true
        })
      }else{
        wx.showToast({
          icon: "none",
          title: res.msg,
          duration: 2000
        })
        wx.switchTab({
          url: '/pages/wxlogin/wxlogin',
        })
      }
    })
  },
  // 手机号验证码校验
  mobileVer(){
    let para = {
      number: this.data.empNumber,
      password: this.data.empPwd
    }
    let params = {
      phone: this.data.mobile,
      authCode: this.data.empCode
    }
    if(!this.data.numberError&&!this.data.pwdError){
      verifyNum(para).then(res => {
        if(res.code != CodeMsg.CODE_0){
          wx.showToast({
            icon: "none",
            title: res.msg,
            duration: 1000
          })
          return false
        }
        this.setData({
          mobile: res.data,
          phone: res.data.substring(0,3) + '****' + res.data.substring(7),
          btnDisabled: false
        })
        mobileVer(params).then(res => {
          if(res.code != CodeMsg.CODE_0){
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1000
            })
            return false
          }
          this.setData({
            userId: res.data
          })
          this.wxBind()
        })
      })
    }
  },
  // 换绑
  changeWxBind(){
    let params = {
      userId: this.data.userId,
      unionId: this.data.unionId,
      avatar: "",
      nickname: "",
      username: ""
    }
    if(wx.getStorageSync('wxInfo')){
      params.avatar = wx.getStorageSync('wxInfo').userInfo.avatarUrl //微信头像
      params.nickname = wx.getStorageSync('wxInfo').userInfo.nickName //微信用户名称
      params.username = wx.getStorageSync('wxInfo').userInfo.nickName //微信用户昵称
    }
    changeWxBind(params).then(res => {
      if(res.code == CodeMsg.CODE_0){
        this.setData({
          newUnionId: res.data,
          isChange: true
        })
        this.wxLogin()
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 微信登录
  wxLogin(){
    let isChange = this.data.isChange
    let unionId = this.data.unionId
    let newUnionId = this.data.newUnionId
    let grant_type = 'mobile'
    let id = !isChange ? unionId : newUnionId
    wxLogin({mobile: 'WECHAT_BIND@' + id, grant_type}).then(res=>{
      if(res.access_token){
        wx.showToast({
          icon: "success",
          title:  !isChange ? '微信绑定成功' : '微信换绑成功',
          duration: 1000
        })
        wx.setStorageSync('accessInfo', res)
        wx.setStorageSync('userInfo', res.user_info)
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index',
          })
        }, 500)
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 关闭换绑弹窗
  closeDialog(){
    this.setData({
      show: false,
      showStatus: 1,
      btnDisabled: false,
      btnText: "获取验证码",
      codeTime: 0
    })
  },
  // 打开滑块
  openSlide(){
    this.selectComponent('.demo2').show();
  },
  // 滑块验证成功
  verifySuccess(val) {
    // 进行加密处理
    if(val){
      this.sendMsg()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (wx.getUserProfile) {
      this.setData({
        isUsed: true
      })
    };
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})