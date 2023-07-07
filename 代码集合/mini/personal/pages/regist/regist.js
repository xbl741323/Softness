const app = getApp();
const phoneLogin = require('../../../utils/api.js').phoneLogin;
const testCode = require('../../../utils/api.js').testCode;
import {
  getUserInfos
} from "../../../utils/common/userDeal";
import {
  hexMD5
} from "../../../utils/md5.js";
import {
  userRegister,
  completeOldUserInfo
} from "../../../utils/api/user"
Page({
  data: {
    linkId: "",
    tipStatus: false,
    phoneNumber: "",
    account: "",
    error: [
      "请输入正确的手机号码",
      "请输入验证码",
      "请输入4~16位纯字母（或字母+数字组合）",
      '请输入6~16字母加数字或特殊符号组合的密码',
      '密码输入错误，请重新输入！'
    ],
    phoneError: false,
    codeError: false,
    wordError: false,
    wordErrorAgain: false,
    accountError: false,
    codeTime: "",
    btnDisabled: true,
    btnText: "获取验证码",
    codeTime: 0,
    loginDisabled: true,
    code: "",
    embedToken: "",
    password: '',
    passwordAgain: '',
    pageFrom: {},
    eyesOn: false,
    eyesOnAgain: false,
    // from: "launch-order",
    // mobile: "18019935577"
  },
  openAgreement() {
    wx.navigateTo({
      url: '/personal/pages/agreement/agreement',
    })
  },
  openSecrecy() {
    wx.navigateTo({
      url: '/personal/pages/secrecy/secrecy',
    })
  },
  //获取用户输入框数据
  getPhone(e) {
    this.setData({
      phoneNumber: e.detail.value.trim()
    })
    let reg = /^1[3-9]\d{9}$/;
    if (reg.test(this.data.phoneNumber) && this.data.btnText == "获取验证码") {
      this.setData({
        btnDisabled: false
      })
    } else {
      this.setData({
        btnDisabled: true
      })
    }
  },
  getCode(e) {
    this.setData({
      code: e.detail.value.trim()
    })
  },
  getAccount(e) {
    this.setData({
      account: e.detail.value.trim()
    })
  },
  getword(e) {
    this.setData({
      password: e.detail.value.trim()
    })
  },
  eyeStatus() {
    this.setData({
      eyesOn: !this.data.eyesOn
    })
  },
  eyeStatusAgain() {
    this.setData({
      eyesOnAgain: !this.data.eyesOnAgain
    })
  },
  //协议勾选
  checkboxChange(e) {
    console.log(e.detail.value)
    if (e.detail.value.length == 0) {
      this.setData({
        loginDisabled: true
      })
    } else {
      this.setData({
        loginDisabled: false
      })
    }
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
  //校验账号
  checkAccount() {
    // let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z][0-9A-Za-z_-]{5,15}$/;   
    let reg = /^(?![0-9]+$)[a-zA-Z0-9]{4,16}$/;
    if (reg.test(this.data.account)) {
      this.setData({
        accountError: false,
      })
    } else {
      this.setData({
        accountError: true,
      })
    }
  },
  //校验密码
  checkPassword() {
    let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![_/#\\@*&%]+$)[\da-zA-Z_/#\\@*&%]{6,16}$/;
    if (reg.test(this.data.password)) {
      this.setData({
        wordError: false,
      })
    } else {
      this.setData({
        wordError: true,
      })
    }
  },
  getwordAgain(e) {
    this.setData({
      passwordAgain: e.detail.value.trim()
    })
  },
  checkPasswordAgain() {
    let password = this.data.password
    let passwordAgain = this.data.passwordAgain
    if (password == passwordAgain) {
      this.setData({
        wordErrorAgain: false,
      })
    } else {
      this.setData({
        wordErrorAgain: true,
      })
    }
  },
  //验证码非空校验
  checkCode() {
    this.setData({
      codeError: this.data.code ? false : true,
    })
  },
  //获取验证码
  sendMsg() {
    let that = this;
    let mobile = that.data.pageFrom.mobile ? that.data.pageFrom.mobile : that.data.phoneNumber
    testCode(mobile).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: "验证码已发送",
          icon: 'success',
          duration: 2000
        })
        that.setData({
          codeTime: 60,
          btnDisabled: true
        })
        that.timer();
      } else if (res.code == 1) {
        wx.showToast({
          title: res.data.cnMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
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
  //登录
  phoneRegist() {
    if (this.data.account == "") return app.toastBox('请输入账号名！', 'none', 1500);
    if (!this.data.pageFrom.mobile && this.data.phoneNumber == "") return app.toastBox('请输入手机号码！', 'none', 1500);
    if (this.data.code == "") return app.toastBox('请输入验证码！', 'none', 1500);
    if (this.data.password == "") return app.toastBox('请输入密码！', 'none', 1500);
    if (this.data.passwordAgain == "" || this.data.passwordAgain != this.data.password) return app.toastBox('请确认密码！', 'none', 1500);
    let data = {
      mobile: this.data.pageFrom.mobile ? this.data.pageFrom.mobile : this.data.phoneNumber,
      authCode: this.data.code,
      password: hexMD5(this.data.password),
      registerClient: 2,
      username: this.data.account,
    };
    if (this.data.linkId !== "") {
      data.inviteCode = this.data.linkId
    }
    let url = this.data.pageFrom.from == 'no-username' ? completeOldUserInfo : userRegister
    let _this = this
    url(data).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: this.data.pageFrom.from == 'no-username' ? '修改成功！' : '注册成功！',
          icon: 'success',
          duration: 1000
        });
        if (!this.data.loginDisabled) {
          if (url == userRegister) {
            wx.setStorageSync('token', res.data)
          }
          getUserInfos('openId');
          setTimeout(() => {
            if (_this.data.pageFrom.from == 'launch-order') return app.toGoalUrl('/order/pages/launch/launch?from=regLog');
            _this.checkCodeStatus()
          }, 1000)
        } else {
          setTimeout(() => {
            return app.toGoalUrl('/personal/pages/wxLogin/wxLogin');
          }, 1000)
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  // 扫码返回判断
  checkCodeStatus() {
    if (wx.getStorageSync('codeStatus')) {
      wx.navigateBack({
        delta: 2,
      })
      wx.removeStorageSync('codeStatus')
    } else {
      app.toTabUrl('/pages/me/me')
    }
  },
  // 取消弹窗
  cancel() {
    this.setData({
      tipStatus: false
    })
    wx.navigateBack({
      delta: 2
    })
  },
  // 检查用户是否认证，且是否存在待认证的订单
  checkCertify(userInfo) {
    let params = {
      accountId: userInfo.accountId
    }
    getUncertifiedOrder(params).then(res => {
      if ((res.code == 1) && (userInfo.certificationStatus !== '1')) {
        this.setData({
          tipStatus: true
        })
      } else {
        this.cancel()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.data) {
      this.setData({
        pageFrom: JSON.parse(options.data),
      })
      if(this.data.pageFrom.from=='no-username'){
        wx.setNavigationBarTitle({
          title: "完善信息"
        })
      }
    }
    if (wx.getStorageSync('linkId')) {
      this.setData({
        linkId: wx.getStorageSync('linkId')
      })
      console.log(this.data.linkId + "-linkId")
    }
  },
  onShow() {
    // this.lauchOrder()
  }
})