const app = getApp();
const testCode = require('../../../utils/api.js').testCode;
import {
  getUserInfos
} from "../../../utils/common/userDeal"
import {
  loginBySMS,
  chooseAccount
} from "../../../utils/api/user"
import {
  getUncertifiedOrder
} from "../../../utils/api/order.js"
Page({
  options: {
    addGlobalClass: true,  //采用全局样式
  },
  data: {
    linkId: "",
    tipStatus: false,
    phoneNumber: "",
    currentTab: 0,
    error: [
      "请输入正确的手机号码",
      "请输入验证码",
    ],
    phoneError: false,
    codeError: false,
    btnDisabled: false,
    btnText: "获取验证码",
    codeTime: 0,
    loginDisabled: true,
    code: "",
    embedToken: "",
    mask: true,
    imageUrl: app.globalData.imageURL,
    accountList: [],
    userIndex: null,
    loginTemp: '',
    pageFrom: {}
  },
  preventTouchMove(e) {},
  closeMask() {
    this.setData({
      mask: true,
    })
  },
  chooseOne(e) {
    let index = e.currentTarget.dataset.index;
    if(this.data.accountList[index].isDisabled==1) return app.toastBox('该账号已禁用','error',1500)
    this.setData({
      userIndex: index
    })
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
  //协议勾选
  checkboxChange(e) {
    console.log(e);
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
  //验证码非空校验
  checkCode() {
    this.setData({
      codeError: this.data.code ? false : true,
    })
  },
  //获取验证码
  sendMsg() {
    // wx.showModal({
    //   title: "提示",
    //   content: "该手机号码在卧涛网不存在账户信息，请先注册账户信息",
    //   confirmText: "去注册",
    //   showCancel: false,
    //   success(res) {
    //     if (res.confirm) {
    //       wx.navigateTo({
    //         url: '/personal/pages/regist/regist',
    //       })
    //     }
    //   },
    // });
    let that = this;
    let mobile = that.data.pageFrom.mobile ? that.data.pageFrom.mobile : that.data.phoneNumber
    testCode(mobile).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: "验证码已发送",
          icon: 'success',
          duration: 1000
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
          duration: 1000
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
  phoneLogin() {
    var that = this;
    if (this.data.loginDisabled) return app.toastBox('请勾选协议！', 'none', 1500);
    let linkId = that.data.linkId
    if (!this.data.codeError && !this.data.phoneError) {
      wx.login({
        success: function (result) {
          let data = {
            mobile: that.data.pageFrom.mobile ? that.data.pageFrom.mobile : that.data.phoneNumber,
            authcode: that.data.code,
            // lastLoginWayType: 1 //标记上次登录的方式用于初始化回显：0-微信登录，1-手机号登录
          };
          if (linkId !== "") {
            data.inviteCode = linkId
          }
          loginBySMS(data).then(res => {
            if (res.code == 0) {
              let list = res.data.list;
              let ableIndex = list.findIndex(item => item.isDisabled==0);
              that.setData({
                userIndex: ableIndex,
                accountList: list,
                loginTemp: res.data.loginTemp
              })
              if (list.length > 1 && !that.data.pageFrom.accountId) {
                if (that.data.pageFrom.mobile) return that.filterAccount(list);
                that.setData({
                  mask: false,
                })
              } else {
                that.submitLogin();
              }
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 3000
              })
            }
          })
        }
      })
    }
  },
  filterAccount(val) {
    let that = this;
    let listFilter = val.filter((item) => {
      return item.authStatus == '0'
    });
    if (listFilter.length == 0) return wx.showModal({
      title: '操作提示',
      content: '当前手机号无关联未认证账号，请再去注册一个吧~',
      confirmText: '现在就去',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          let para = {
            from: 'launch-order',
            mobile: that.data.pageFrom.mobile,
          }
          that.toReg(para)
        } else if (res.cancel) {
          that.triggerEvent('close-dialog', true)
        }
      }
    });
    this.setData({
      accountList: listFilter,
      mask: false,
    })
  },
  toReg(para) {
    let data = JSON.stringify(para)
    app.toGoalUrl(`/personal/pages/regist/regist?data=${data}`)
  },
  // 选择账号登录
  submitLogin() {
    console.log(this.data.userIndex);
    if(this.data.userIndex == -1) return app.modalBox(null,'账号异常，检查账号信息或联系客服处理！',false);
    let that = this;
    let list = this.data.accountList;
    let index = list.length == 1 ? 0 : this.data.userIndex;
    let para = {
      accountId: this.data.pageFrom.accountId ? this.data.pageFrom.accountId : list[index].accountId,
      loginTemp: this.data.loginTemp,
    };
    chooseAccount(para).then(res => {
      if (res.code == 0) {
        wx.setStorageSync('token', res.data);
        this.setData({
          mask: true,
        });
        getUserInfos('openId', function (res) {
          console.log(res.username);
          if (res.username) {
            if (that.data.pageFrom.mobile && wx.getStorageSync('launchUser').mobileStatus == '授权中') return app.toGoalUrl('/personal/pages/authentication/authentication')
            if (that.data.pageFrom.mobile) return app.toGoalUrl('/order/pages/launch/launch?from=regLog')
            setTimeout(() => {
              that.checkCodeStatus()
            }, 500)
          } else {
            console.log(2);
            let para = {
              from: 'no-username',
              mobile: that.data.phoneNumber,
            }
            that.toReg(para)
          }
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

  // 切换标签页
  switchTab(e) {
    console.log(e)
    this.setData({
      currentTab: e.currentTarget.dataset.current
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.data) {
      this.setData({
        pageFrom: JSON.parse(options.data),
      })
    };
    if (wx.getStorageSync('linkId')) {
      this.setData({
        linkId: wx.getStorageSync('linkId')
      })
      console.log(this.data.linkId + "-linkId")
    }
  },
})