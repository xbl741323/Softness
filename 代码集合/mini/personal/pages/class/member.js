// personal/pages/class/member.js
const app = getApp();
import {
  getVipInfo
} from "../../../utils/api/vip"
import { getUserInfos } from "../../../utils/common/userDeal"
import { layout } from "../../../utils/api"
import {
  getClassList
} from "../../../utils/api/wtClass"
Page({
  data: {
    buyed: false,
    vipInfo: {},
    accountNo: '',
    imageURL: app.globalData.imageURL,
    goodsList: [],
    headPortrait: '',
    pageNo: 1,
    pageSize: 20,
    count: 0,
    showTop: false,
    dataStatus:true,
  },
  // 购买vip
  buyVip() {
    wx.navigateTo({
      url: '/personal/pages/openVip/openVip'
    })
  },
  // 购买记录
  toRecord() {
    wx.navigateTo({
      url: '/personal/pages/buyRecord/record'
    })
  },
  // 跳转课程详情
  toGoods(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/classRoom/pages/detail/course/course?id=${id}`,
    })
  },
  //获取用户vip信息
  getInfo() {
    getVipInfo().then(res => {
      if (res.code==0 && res.data) {
        this.setData({
          vipInfo: res.data,
        });
        let end = new Date(res.data.vipExpireDate);
        wx.setStorageSync('vipExpireDate', res.data.vipExpireDate);
        if (new Date() <= end.getTime() + 24 * 60 * 60 * 1000 - 1) {
          this.setData({
            buyed: true
          })
        }
      };
      // if(res.code == 1){
        // this.layoutAccount();
      // }
    });
  },
  //底部商品列表
  getGoods() {
    this.setData({
      dataStatus: false
    })
    let params = {
      pageSize: this.data.pageSize,
      pageNo: this.data.pageNo,
      baseShowState: 1,
      getTrySeeSectionNumber: true,
      tradingChargeType: 2, // 1-完全免费 2-vip免费 3-单独收费
    }
    getClassList(params).then(res => {
      if (res.code == 0) {
        this.setData({
          goodsList: [...this.data.goodsList, ...res.data.data.records],
          count: res.data.data.total
        })
      }
      setTimeout(()=>{
        this.setData({
          dataStatus: true
        },500)
      })
    })
  },
  layoutAccount() {
    console.log('获取用户信息时登录异常强制退出-----');    
    wx.showToast({
      title: '账号登录异常，请重新登录！',
      icon: "error",     
      duration: 1000, 
    })
    setTimeout(()=>{
      wx.login({
        success: function (res) {
          layout({ code: res.code }).then(res => {
            if (res.code == 0) {
              // 清除所有storageSync
              wx.clearStorageSync()
              wx.setStorageSync('hasLogo', false);
              wx.redirectTo({
                url: "/personal/pages/wxLogin/wxLogin"
              })
            }
          })
        }
      })
    },1500)    
  },
  // 回到页面顶部
  toTop() {
    app.toTop()
  },
  //监听页面滑动
  onPageScroll(e) {
    this.setData({
      showTop: e.scrollTop > 200 ? true : false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.buy) {
      console.log('qqqqq');
      getUserInfos();
      console.log(wx.getStorageSync('vipInfo'),'购买会员后信息');
    };    
    if (wx.getStorageSync('userInfo')) {
      this.getGoods();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (wx.getStorageSync('userInfo')) {
      this.getInfo();
      let info = wx.getStorageSync('userInfo');
      this.setData({
        accountNo: info.username,
        headPortrait: info.diyLogoUrl
      })
      if (this.data.goodsList.length==0 && this.data.dataStatus) return this.getGoods()
    } else {
      wx.navigateTo({
        url: '/personal/pages/wxLogin/wxLogin',
      })
    }
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
    if (this.data.pageNo * this.data.pageSize >= this.data.count) return;
    this.setData({
      pageNo: this.data.pageNo + 1,
    });
    this.getGoods();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})