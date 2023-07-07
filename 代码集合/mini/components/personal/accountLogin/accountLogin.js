// components/personal/accountLogin/accountLogin.js
const app = getApp();
import {
  getUserInfos
} from "../../../utils/common/userDeal"
import {
  accountLogin,
  getCode
} from "../../../utils/user"
import {
  hexMD5
} from "../../../utils/md5.js";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loginDisabled:{
      type:Boolean,
      value:false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    account: "",
    password: "",
    captchaCode: "",
    accountError: false,
    pwdError: false,
    defaultType: true,
    passwordType: true,
    mask: true,
    loginDisabled: true,
    codeMask: true,
    submitBtn: true,
    verifyData: "",
    error: [
      "请输入正确的账号名",
      "请输入正确的登录密码"
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取账号名输入框数据
    getAccount(e) {
      this.setData({
        account: e.detail.value.trim()
      })
    },
    // 获取密码输入框数据
    getPwd(e) {
      this.setData({
        password: e.detail.value.trim()
      })
    },
    // 获取验证码输入框数据
    getCaptchaCode(e) {
      this.setData({
        captchaCode: e.detail.value.trim(),
        submitBtn: false
      })
      if (e.detail.value.trim() == '') {
        this.setData({
          submitBtn: true
        })
      }
    },
    //校验账号
    checkAccount() {
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
          pwdError: false,
        })
      } else {
        this.setData({
          pwdError: true,
        })
      }
    },
    //校验验证码
    checkCaptchaCode() {
      // if (this.data.password) {
      //   this.setData({
      //     pwdError: false,
      //   })
      // } else {
      //   this.setData({
      //     pwdError: true,
      //   })
      // }
    },
    // 密码显示隐藏
    eyeStatus() {
      this.data.defaultType = !this.data.defaultType
      this.data.passwordType = !this.data.passwordType
      this.setData({
        defaultType: this.data.defaultType,
        passwordType: this.data.passwordType
      })
    },
    // 关闭遮罩
    closeMask() {
      this.setData({
        mask: true,
      })
    },
    // 关闭验证码弹窗
    closeCodeDialog() {
      this.setData({
        codeMask: true
      })
    },
    // 跳转注册页面
    goRegister() {
      wx.navigateTo({
        url: '/personal/pages/regist/regist',
      })
    },
    // 跳转到忘记密码页面
    findPwd() {
      wx.navigateTo({
        url: '/personal/pages/findPwd/findPwd',
      })
    },
    // 账号密码登录
    accountLogin() {
      if(this.data.loginDisabled) return app.toastBox('请勾选协议！', 'none', 1500);
      if (this.data.account == "") {
        wx.showToast({
          title: '账号名不能为空',
          icon: 'none',
          duration: 1200,
        })
        return false
      }
      if (this.data.password == "") {
        wx.showToast({
          title: '登录密码不能为空',
          icon: 'none',
          duration: 1200,
        })
        return false
      }
      if (this.data.codeMask == false && this.data.captchaCode == '') {
        wx.showToast({
          title: '图形验证码不能为空',
          icon: 'none',
          duration: 1200,
        })
        return false
      }
      let data = {
        captchaCode: this.data.captchaCode,
        username: this.data.account,
        password: hexMD5(this.data.password)
      }
      let _this = this
      accountLogin(data).then(res => {
        if (res.code != 0) {
          if (res.code == 10003) {
            this.setData({
              mask: false,
            })
          } else if (res.code == 10009) { //登录过于频繁
            this.getCode()
            this.setData({
              codeMask: false,
            })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 1200,
            })
          }
          return false;
        }
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1000,
        })
        wx.setStorageSync('token', res.data);
        getUserInfos('openId')
        setTimeout(() => {
          _this.checkCodeStatus()
        }, 500)
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
    // 获取图形验证码
    getCode() {
      getCode().then(res => {
        this.setData({
          verifyData: res
        })
      })
    }
  }
})