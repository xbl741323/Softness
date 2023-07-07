// pages/login/login.js
const app = getApp();
import {
  getUserInfos
} from "../../../utils/common/userDeal"
import {
  wxLogin,
  getAccountList,
  wxBindLogin,
  chooseAccount
} from "../../../utils/api/user"
import {
  hexMD5
} from "../../../utils/md5";
import {
  getUncertifiedOrder
} from "../../../utils/api/order.js"
Page({
  data: {
    linkId: "",
    wxInfo: {},
    canIUseGetUserProfile: false,
    tipStatus: false,
    code: "",
    mask: true,
    password: '',
    account: '',
    imageUrl: app.globalData.imageURL,
    wordError: false,
    accountError: false,
    already: false,
    loginTemp: '',
    error: [
      "请输入账号名",
      '请输入密码'
    ],
    accountList: [],
    step: '', //choose-mobile绑定选择手机号步骤，choose-account已绑定选择账号，bind-account绑定账号input填写
    userIndex: null,
    unionId: '',
    bindStatus: false // 绑定状态 true-当前微信未绑定
  },
  closeMask() {
    this.setData({
      mask: true,
    })
  },
  onShareTimeline() {},
  // 取消弹窗
  cancel() {
    this.setData({
      tipStatus: false
    })
    wx.navigateBack({
      delta: 1
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
  // radio选择
  chooseOne(e) {
    let index = e.currentTarget.dataset.index;
    if (this.data.accountList[index].wxBindFlag && this.data.step == 'choose-mobile') return wx.showToast({
      title: '此号码已绑定微信!',
      icon: 'none',
      duration: 2000
    });
    if(this.data.accountList[index].isDisabled==1) return app.toastBox('该账号已禁用','error',1500);
    this.setData({
      userIndex: index
    })
  },
  phoneLogin(){
    app.toGoalUrl('/personal/pages/phoneLogin/phoneLogin')
  },
  // 确定按钮
  confirmBtn() {
    let index = this.data.userIndex
    // if (this.data.step == 'choose-account') return this.accountLogin()
    if (this.data.step == 'choose-mobile') return this.bindLogin()
  },
  bindLogin() {
    let list = this.data.accountList;
    let para = {
      accountId: list[this.data.userIndex].accountId,
      unionId: this.data.unionId
    }
    let _this = this
    wxBindLogin(para).then(res => {
      if (res.code == 0) {
        getUserInfos('openId');        
        wx.showToast({
          title: '登录成功！',
          icon: 'success',
          duration: 1500
        });
        this.setData({
          mask: true,
        })
        setTimeout(() => {
          _this.checkCodeStatus()
        }, 500)
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'error',
          duration: 2000
        })
      }
    })
  },
  toLogin(data) {
    if(this.data.userIndex == -1 || this.data.userIndex == null) return app.toastBox('请选择有效账号', 'none', 1500);
    let index = data && typeof (data) == 'number' ? data : this.data.userIndex;
    let list = this.data.accountList;
    let para = {
      accountId: list[index].accountId,
      loginTemp: this.data.loginTemp,
    };
    let that = this
    chooseAccount(para).then(res => {
      if (res.code == 0) {
        wx.setStorageSync('token', res.data);
        this.setData({
          mask: true,
        })
        getUserInfos('openId', function (res) {
          if (!res.username) {
            let para = {
              from: 'no-username',
              mobile: res.phone,
            }
            that.toReg(para)
          } else {
            setTimeout(() => {
              that.checkCodeStatus()
            }, 500)
          }
        })        
      } else {
        app.toastBox(res.msg)
      }
    })
  },
  toReg(para) {
    let data = JSON.stringify(para)
    app.toGoalUrl(`/personal/pages/regist/regist?data=${data}`)
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
  // 切换登录方式{
  switchLogin() {
    this.setData({
      mask: true
    })
  },
  switchRegist() {
    app.toGoalUrl('/personal/pages/regist/regist')
  },
  nextHandle() {
    this.checkAccount();
    this.checkPassword();
    if (this.data.accountError || this.data.wordError) return;
    let para = {
      username: this.data.account,
      password: hexMD5(this.data.password),
    }
    getAccountList(para).then(res => {
      if (res.code == 0) {
        this.setData({
          step: 'choose-mobile',
          accountList: res.data
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500
        })
      }
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
  //校验账号
  checkAccount() {
    this.setData({
      accountError: this.data.account == '' ? true : false,
    })
  },
  //校验密码
  checkPassword() {
    this.setData({
      wordError: this.data.password == '' ? true : false,
    })
  },
  // 检查绑定状态
  checkBindStatus(e) {
    let that = this
    let wxInfo = this.data.wxInfo;
    wx.login({
      success: function (res) {
        let params = {
          code: res.code,
          nickname: wxInfo.nickName,
          avatar: wxInfo.avatarUrl
        }
        wxLogin(params).then(res => {
          that.setData({
            unionId: res.data.unionId,
          })
          if (res.data.status == '2') {
            that.setData({
              bindStatus: true,
            })
          } else if (res.code == 0) {
            that.setData({
              accountList: res.data.accountList,
              loginTemp: res.data.loginTemp
            })
            let list = res.data.accountList
            let ableIndex = list.findIndex(item => item.isDisabled==0);
            that.setData({
              userIndex: ableIndex,
            })
            if (list.length <= 1 && list[0].isDisabled==0 ) return that.toLogin(0);
            that.setData({
              mask: false,
              step: 'choose-account',
            })
          } 
        })
      }
    })
  },
  // 关闭提示弹窗
  closeTip() {
    this.setData({
      bindStatus: false
    })
  },
  // 获取微信头像昵称信息
  getUserProfile(e) {
    // 推荐使用 wx.getUserProfile 获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于获取账号名和头像', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res);
        wx.setStorageSync('wxInfo', res.data);
        this.setData({
          wxInfo: res.userInfo,
        })
        if (res.errMsg == "getUserProfile:ok") {
          this.checkBindStatus();
        } else {
          wx.showToast({
            title: '请允许操作，保证正常登录！',
            icon: 'none',
            duration: 1500,
          })
        }
      }
    })
  },
  // 获取微信头像昵称
  getUserInfo(e) {
    // 用户同意授权
    var that = this;
    if (e.detail.errMsg == 'getUserInfo:ok') {
      // 3.请求自己的服务器，解密用户信息 获取unionId等加密信息(返回是否登录)
      that.checkBindStatus();
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
  // 去绑定
  toBind() {
    this.closeTip();
    this.setData({
      mask: false,
      step: 'bind-account'
    })
  },
  getCode() {
    var that = this
    wx.login({
      success: function (res) {
        var code = res.code; // 登录凭证
        if (code) {
          that.setData({
            code: code
          })
        }
      }
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    };
    if (wx.getStorageSync('linkId')) {
      this.setData({
        linkId: wx.getStorageSync('linkId')
      })
    }
    var that = this;
    this.getCode()
    setInterval(function () {
      that.getCode()
    }, 240000)
  },
})