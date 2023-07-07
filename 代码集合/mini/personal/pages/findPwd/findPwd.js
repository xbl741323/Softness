// personal/pages/findPwd/findPwd.js
const app = getApp();
const testCode = require('../../../utils/api.js').testCode;
import {hexMD5} from "../../../utils/md5.js";
import { forgetPwdCheck, forgetPwdReset } from "../../../utils/user"
import { smsToManager} from "../../../utils/api/user"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask: true ,
    phoneNumber: "",
    code: "",
    pwd:"",
    confirmpwd:"",
    phoneError: false,
    codeError: false,
    pwdError: false,
    confirmpwdError: false,
    pwdDefault: true,
    confirmPwdDefault: true,
    pwdType: true,
    confirmPwdType: true,
    btnDisabled: false,
    btnText: "发送验证码",
    codeTime: 0,
    error:[
      "请输入正确的手机号码",
      "验证码格式不正确",
      "请输入正确格式的密码",
    ],
    showStatus: 0,
    show:false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData:[], //下拉列表的数据
    index:0, //选择的下拉列表下标
    loginTemp:""
  },
  //获取用户输入框数据
  getPhone(e) {
    this.setData({
      phoneNumber: e.detail.value.trim()
    })
    let reg = /^1[3-9]\d{9}$/;
    if (reg.test(this.data.phoneNumber) && this.data.btnText == "发送验证码") {
      this.setData({
        btnDisabled: false
      })
    } else {
      this.setData({
        btnDisabled: true
      })
    }
  },
  //获取验证码数据
  getCode(e) {
    this.setData({
      code: e.detail.value.trim()
    })
  },
  // 获取密码输入框数据
  getPwd(e) {
    this.setData({
      pwd: e.detail.value.trim()
    })
  },
  // 获取密码输入框数据
  getConfirmPwd(e) {
    this.setData({
      confirmpwd: e.detail.value.trim()
    })
  },
  //手机号校验
  checkPhone() {
    let reg = /^1[3-9]\d{9}$/;
    if (reg.test(this.data.phoneNumber)) {
      this.setData({
        phoneError: false,
      })
    } else {
      this.setData({
        phoneError: true,
      })
    }
  },
  //验证码校验
  checkCode() {
    let reg = /^\d{6}$/;
    if (reg.test(this.data.code)) {
      this.setData({
        codeError: false,
      })
    } else {
      this.setData({
        codeError: true,
      })
    }
  },
  // 密码框校验
  checkPwd() {
    let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/;
    if (reg.test(this.data.pwd)) {
      this.setData({
        pwdError: false,
      })
    } else {
      this.setData({
        pwdError: true,
      })
    }
  },
  // 再次确认密码框校验
  checkConfirmPwd() {
    let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/;
    if (reg.test(this.data.confirmpwd)) {
      this.setData({
        confirmpwdError: false,
      })
    } else {
      this.setData({
        confirmpwdError: true,
      })
    }
  },
  // 获取手机短信验证码
  sendMsg() {
    console.log(11111)
    console.log(this.data.phoneNumber)
    if(this.data.phoneNumber==''){
      wx.showToast({
        title: "请先填写注册时绑定的手机号",
        icon: 'none',
        duration: 1500
      })
      return false
    }
    testCode(this.data.phoneNumber).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: "验证码已发送",
          icon: 'success',
          duration: 1000
        })
        this.setData({
          codeTime: 60,
          btnDisabled: true
        })
        this.timer();
      } else if (res.code == 1) {
        wx.showToast({
          title: res.data.cnMsg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 倒计时
  timer() {
    if (this.data.codeTime > 0) {
      this.setData({
        codeTime: this.data.codeTime - 1,
        btnText: this.data.codeTime + "s后重新获取",
      })
      setTimeout(this.timer, 1000);
    } else {
      this.setData({
        btnDisabled: false,
        btnText: "获取验证码"
      })
    }
  },
  // 点击下拉显示框
  selectTap(){
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e){
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    if(this.data.selectData[Index].isManager==0) return app.toastBox('该账号不可选！','none',1500)
    this.setData({
      index:Index,
      show:!this.data.show
    });
  },
  // 密码显示隐藏
  pwdStatus(){
    this.data.pwdDefault = !this.data.pwdDefault
    this.data.pwdType = !this.data.pwdType
    this.setData({
      pwdDefault: this.data.pwdDefault,
      pwdType: this.data.pwdType
    })
  },
  // 再次输入密码框显示隐藏
  confirmPwdStatus(){
    this.data.confirmPwdDefault = !this.data.confirmPwdDefault
    this.data.confirmPwdType = !this.data.confirmPwdType
    this.setData({
      confirmPwdDefault: this.data.confirmPwdDefault,
      confirmPwdType: this.data.confirmPwdType
    })
  },
  // 下一步操作（校验手机号验证码）
  toNext(){
    if(this.data.phoneNumber == ""){
      wx.showToast({
        title: "手机号码不能为空",
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if(this.data.code == ""){
      wx.showToast({
        title: "验证码不能为空",
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    let param = {
      authCode: this.data.code,
      mobile: this.data.phoneNumber
    }
    !this.phoneError && !this.codeError && forgetPwdCheck(param).then(res => {
        if(res.code != 0){
          res.code == 10003 ? this.setData({mask:false}) : this.setData({mask:true})
          res.code != 10003 && wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1500
          })
        }
        let list = res.data.userList;
        let ableIndex = list.findIndex(item => item.isManager==1);        
        this.setData({
          showStatus: 1,
          index: ableIndex,
          selectData: res.data.userList,
          loginTemp: res.data.loginTemp
        })
      })
  },
  // 修改密码
  updatePwd(){
    if(this.data.pwd == '' || this.data.confirmpwd == ''){
      wx.showToast({
        title: "密码不能为空",
        icon: 'none',
        duration: 1200
      })
      return false;
    }
    if(this.data.pwd != this.data.confirmpwd){
      wx.showToast({
        title: "两次密码输入不一致",
        icon: 'none',
        duration: 1200
      })
      return false;
    }
    let param = {
      loginTemp: this.data.loginTemp,
      password: hexMD5(this.data.pwd),
      userId: this.data.selectData[this.data.index].userId
    }
    !this.data.pwdError && !this.data.confirmpwdError && forgetPwdReset(param).then(res=>{
      if(res.code != 0){
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1200
        })
        return false;
      }
      wx.showToast({
        title: '找回密码成功',
        icon: 'success',
        duration: 1200
      });
      setTimeout(()=>{
        this.goLogin()
      },2000)
    })
  },
  // 关闭提示框
  closeMask(){
    this.setData({
      mask: true
    })
  },
  // 跳转注册页面
  goRegister(){
    wx.navigateTo({
      url: '/personal/pages/regist/regist',
    })
  },
  // 跳转登录页
  goLogin(){
    wx.navigateTo({
      url: '/personal/pages/phoneLogin/phoneLogin',
    })
    // wx.navigateBack({
    //   delta: 1,
    // })
  },










  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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