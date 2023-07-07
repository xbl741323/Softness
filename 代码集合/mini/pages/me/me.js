// pages/me/me.js
const app = getApp()
import {
  updataUserInfo
} from "../../utils/common/utils.js";
import { getUserInfos } from "../../utils/common/userDeal"
import {
  pageStudyCourse
} from "../../utils/api/wtClass"
const layout = require("../../utils/api.js").layout;
import {
  getMyAccountInfo
} from "../../utils/api/user"
import { statisticsProductOrderNum } from "../../utils/api/orders.js"
Page({
  data: {
    tipStatus: false,
    isLogin: false,
    navigationBarAndStatusBarHeight: wx.getStorageSync('statusBarHeight') + wx.getStorageSync('navigationBarHeight') + 4 + 'px',
    navigationBarHeight: wx.getStorageSync('navigationBarHeight') + 'px',
    statusBarHeight: wx.getStorageSync('statusBarHeight') + 'px',
    iswxLogin: wx.getStorageSync('iswxLogin'),
    userInfo: {},
    viewHight: "",
    choosedType: 1,
    isShowNavbar: false,
    isShowSearchbar: false,
    showTop: false,
    imageUrl: app.globalData.imageURL,
    orderList: [{
        url: "/image/orders/order-four.png",
        title: "全部订单",
        value: 0
      },{
        url: "/image/orders/order-sign.png",
        title: "待签约",
        count: 0,
        value: 1
      },{
        url: "/image/orders/order-one.png",
        title: "待付款",
        count: 0,
        value: 2
      },{
        url: "/image/orders/order-two.png",
        title: "服务中",
        count: 0,
        value: 3
      },{
        url: "/image/orders/order-three.png",
        title: "退款/售后",
        count: 0,
        value: 4
      }
    ],
    bannerList: [{
      type: 1,
      name: "知产收藏",
      url: "/image/me/icon_zhichan_collect@2x.png"
    }, {
      type: 2,
      name: "项目收藏",
      url: "/image/me/icon_xiangmu_collect@2x.png"
    }, {
      type: 3,
      name: "浏览足迹",
      url: "/image/me/icon_browse_center@2x.png"
    }],
    nowTime: new Date().getTime(),
    titleList: [{
      type: 4,
      name: "身份认证",
      url: "/image/center/certify.png"
    }, {
      type: 7,
      name: "课堂会员",
      url: "/image/center/icon_member@2x.png"
    }, {
      type: 2,
      name: "我的收藏",
      url: "/image/center/icon_collect@2x.png"
    }, {
      type: 3,
      name: "我的足迹",
      url: "/image/center/icon_footprint@2x.png"
    }, {
      type: 0,
      name: "我的客服",
      url: "/image/center/icon_service@2x.png"
    }, {
      type: 1,
      name: "设置",
      url: "/image/center/icon_set@2x.png"
    }, {
      type: 8,
      name: "我的提问",
      url: "/image/center/icon-my-question@2x.png"
    }],
    classList: [],
  },
  toOrder(e) {
    let type = e.currentTarget.dataset.value
    wx.navigateTo({
      url: `/personal/pages/orderIndex/order?type=${type}`,
    })
  },
  toInfo() {
    app.toReUrl('/personal/pages/Settings/Settings');
    // app.toReUrl("/personal/pages/primary/primary/primary")
    // app.toReUrl('/personal/pages/primary/primary/primary');
  },
  linkTo(e) {
    console.log(wx.getStorageSync('token'), "wx.getStorageSync('token')")
    if (wx.getStorageSync('token')) {
      if (e.currentTarget.dataset.type == 3) {
        wx.navigateTo({
          url: '/personal/pages/footmark/footmark',
        })
      } else if (e.currentTarget.dataset.type == 2) {
        wx.navigateTo({
          url: '/personal/pages/collection/collection',
        })
      } else if (e.currentTarget.dataset.type == 4) {
        wx.navigateTo({
          url: '/personal/pages/authentication/authentication?accountType=' + this.data.userInfo.accountType + '&status=' + this.data.userInfo.accountType,
        })
      } else if (e.currentTarget.dataset.type == 5) {
        wx.navigateTo({
          url: '/personal/pages/address/address'
        })
      } else if (e.currentTarget.dataset.type == 7) {
        wx.navigateTo({
          url: '/personal/pages/class/member'
        })
      } else if (e.currentTarget.dataset.type == 8) {
        wx.navigateTo({
          url: '/personal/pages/questionsAnswer/questions/questions'
        })
      } else {
        wx.navigateTo({
          url: '/personal/pages/accountSet/accountSet',
        })
      }
    } else {
      wx.navigateTo({
        url: "/personal/pages/wxLogin/wxLogin"
      })
    }

  },
  //监听页面滑动
  onPageScroll(e) {
    // var that = this;
    // getScroll(e)
    // wx.createSelectorQuery().select('#banner').boundingClientRect(function (rect) {
    //   if (rect.top <= that.data.viewHight) {
    //     that.setData({
    //       isShowNavbar: true
    //     })
    //   } else {
    //     that.setData({
    //       isShowNavbar: false
    //     })
    //   }
    // }).exec()
  },
  // 回到页面顶部
  toTop() {
    app.toTop()
  },
  // banner切换
  bindChange(e) {
    if (e.currentTarget.dataset.type == 3) {
      wx.navigateTo({
        url: '/personal/pages/footmark/footmark',
      })
    } else if (e.currentTarget.dataset.type != this.data.choosedType) {
      this.setData({
        choosedType: e.currentTarget.dataset.type
      })
    }
  },
  // 获取订单统计数据
  getCount() {
    statisticsProductOrderNum().then(res => {
      if (res.code == 0) {
        let count = res.data;
        this.data.orderList[2].count = count.waitPay;
        this.data.orderList[1].count = count.waitSignCount;
        this.data.orderList[3].count = count.service;
        this.data.orderList[4].count = count.inRefundCount;
        this.setData({
          orderList: this.data.orderList
        })
      }
    });
  },
  // 修改tabbar login
  tabbarLogin() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        isLogin: this.data.isLogin
      })
    }
  },
  // 获取用户信息
  getInfo(res) {
    if (res) {
      this.setData({
        userInfo: res,
        isLogin: true,
      })
      this.getCount();
      this.getClassData();
      if (this.selectComponent("#wx")) {
        this.selectComponent("#wx").getUserData()
      };
    } else {
      app.toGoalUrl('/personal/pages/wxLogin/wxLogin')
    }
    setTimeout(() => {
      this.tabbarLogin();
    }, 300)
  },
  getClassData() {
    let para = {
      pageSize: 10,
      pageNo: 1,
    }
    pageStudyCourse(para).then(res => {
      if (res.code == 0) {
        this.setData({
          classList: res.data.records
        })
      }
    })
  },
  // 取消弹窗
  cancel() {
    this.setData({
      tipStatus: false
    })
  },
  // 修改tabbar index
  changeTabbar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.log('监听页面加载me')
    this.changeTabbar();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // app.checkLogin() //调用公共方法检查登录状态
    let that = this;
    getUserInfos(false, function (res) {
      that.getInfo(res);
    });
  },
  onHide: function () {
    console.log('隐藏页面了me')
    wx.removeStorageSync('tip');
  }
})