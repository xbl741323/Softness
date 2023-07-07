// personal/pages/authentication/authentication.js
const app = getApp();
import {
  getAutStatus,
  getAuthUrl,
  getMyAccountAndVipInfo,
  // getMyAccountAndVipInfo
} from "../../../utils/api/user"
Page({
  data: {
    loading: false,
    hasAuth: null,
    statustype: null,
    isManager: null,
    userType: null,
    accountType: "",
    fddUrl: '',
    isAgain: false,
    userInfo: {},
    comfirmType: null, //用户选择的认证类型：0-个人，1-单位
    isShow: false,
    authenticationStatus: 100, //认证状态
    authInfo: '', //认证信息
    needCheck: true,
    list: [{
        type: 1,
        imgurl: "/personal/image/center/qiye_icon@2x.png",
        title: "单位实名认证",
        desc: "适用于企业、机构、政府、校园等"
      },
      {
        type: 2,
        imgurl: "/personal/image/center/geren_icon@2x.png",
        title: "个人实名认证",
        desc: "适用于个人的真实身份确认"
      },
    ],
    updateAuthedUrl: null,
  },
  toComfirm(e) {
    this.setData({
      comfirmType: e.currentTarget.dataset.type
    })
    return this.toComfirmNext();
    if (e.currentTarget.dataset.type == this.data.accountType) {
      this.toComfirmNext();
    } else {
      this.setData({
        isShow: true
      })
    }
    // this.setData({
    //   needCheck:true
    // })
  },
  changeStatus() {
    this.setData({
      statustype:false,
      authenticationStatus: null,
      needCheck: false,
      isAgain: true
    })
    wx.navigateTo({
      url: `/personal/pages/orgAuthentication/orgAuthentication?data=${this.data.authInfo}`,
    })
    wx.setStorageSync('isAgain', true)
  },
  showFalse() {
    this.setData({
      isShow: false
    })
  },
  toComfirmNext() {
    getAutStatus().then(res => {
      this.setData({
        statustype: Number(res.data.authStatus) > 0 ? true : false
      })
    })
    this.setData({
      isShow: false
    })
    if (this.data.comfirmType == 1) {
      // 单位认证
      wx.navigateTo({
        url: `/personal/pages/orgAuthentication/orgAuthentication?again=${this.data.isAgain}&type=1`,
      })
    } else {
      // 个人认证
      wx.navigateTo({
        url: `/personal/pages/perAuthentication/operatePage/operatePage?type=${0}&again=${this.data.isAgain}`,
      })
    }
  },
  goToapprove() {
    if (this.data.authInfo.autType == '2') {
      // 单位认证
      wx.navigateTo({
        url: `/personal/pages/orgAuthentication/orgAuthentication?newapprove=newapprove`,
      })
    } else {
      // 个人认证
      wx.navigateTo({
        url: '/personal/pages/perAuthentication/operatePage/operatePage?newapprove=newapprove',
      })
    }
  },
  updateApprove() {
    if (this.data.authInfo.autType == '2') {
      // 单位认证
      wx.navigateTo({
        url: `/personal/pages/orgAuthentication/orgAuthentication?model=update&again=${this.data.isAgain}`,
      })
    } else {
      // 个人认证
      wx.navigateTo({
        url: '/personal/pages/perAuthentication/operatePage/operatePage?model=update',
      })
    }
  },
  continueApprove() {
    if (this.data.authenticationStatus == '6') return wx.navigateTo({
      url: `/pagesFace/pages/webview/webview?root=user`
    })
    getAuthUrl().then(res => {
      if (res.code == 0) {
        this.setData({
          fddUrl: res.data
        })
        wx.setStorageSync('reloadUrl', res.data);
        wx.navigateTo({
          url: `/pagesFace/pages/webview/webview?root=user`
        })
        // 进行下一步，调用认证接口
        // this.toFdd()
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  toFdd() {
    wx.navigateToMiniProgram({
      appId: 'wxa1439f77c6d06a15',
      path: 'pages/result-loading/result-loading?verifyUrl=' + this.data.fddUrl,
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
  getData() {
    wx.showLoading({
      title: '加载中',
    });
    getAutStatus().then(res => {
      console.log(res);
      if (res.code == 0) {
        wx.hideLoading()
        console.log(res.data);
        this.setData({
          authenticationStatus: res.data.status,
          authInfo: res.data,
          hasAuth: Number(res.data.authStatus) > 0 ? true : false,
          statustype: (Number(res.data.status) > 0 || res.data.authorizedType) ? true : false
        })
        console.log(this.data.hasAuth);
        if (res.data.status == '6') {
          wx.setStorageSync('reloadUrl', res.data.updateAuthedUrl);
        }
        if (this.data.authenticationStatus === null || this.data.authenticationStatus === '0') {
          wx.setNavigationBarTitle({
            title: "选择实名认证"
          })
        } else {
          if (this.data.authInfo.autType == '2') {
            wx.setNavigationBarTitle({
              title: "单位实名认证"
            })
          } else {
            wx.setNavigationBarTitle({
              title: "个人实名认证"
            })
          }
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  getMyAccountAndVip() {
    getMyAccountAndVipInfo().then(res => {
      console.log(res.data.accountInfo);
      if (res.code == 0) {
        this.setData({
          userinfoObj:res.data.accountInfo,
          isManager: res.data.accountInfo.isManager,
          userNum: res.data.accountInfo.certifiedType,
          userType: res.data.accountInfo.certifiedType == 1 ? "初级" : '高级'
        })
        console.log(res);
      }
    })
  },
  onShow: function () {
    let info = app.checkLogin(true);
    console.log(info, '-----');
    this.setData({
      userInfo: info,
      accountType: info.accountType
    })
    this.getMyAccountAndVip()
    this.getData();
    if (this.selectComponent("#wx")) {
      this.selectComponent("#wx").getUserData()
    }
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
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("监听页面卸载")
    wx.switchTab({
      url: '/pages/me/me'
    })
  },

})