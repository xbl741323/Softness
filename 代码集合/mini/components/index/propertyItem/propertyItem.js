// components/index/propertyItem/propertyItem.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    wtBaseUrl: "https://static.wotao.com/",
    imageUrl: app.globalData.imageURL,
    isLogin: false,
    imgList: [{
        title: "专利",
        url: "icon/head/eadc03a452804b90a487ce191629b702.png"
      },
      {
        title: "商标",
        url: "icon/head/b06f5508ed9d4d22968102597125c9d4.png"
      },
      {
        title: "版权",
        url: "icon/head/8542199ff73a40238737cc21315ed046.png"
      },
      {
        title: "其他",
        url: "icon/head/90981a5babdd42d89dd25c7e9e56afa0.png"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkLogin() {
      if (!wx.getStorageSync('userInfo')) {
        wx.showToast({
          title: '您还未登录,请先登录吧~',
          icon: 'none',
          duration: 1000
        })
        setTimeout(function () {
          wx.navigateTo({
            url: "/personal/pages/wxLogin/wxLogin"
          })
        }, 1000)
      }
    },
    // 跳转知产详情
    toDetail() {
      if (wx.getStorageSync('userInfo')) {
        let id = this.data.item.id;
        wx.navigateTo({
          url: "/search/pages/propertyDetail/propertyDetail?propertyId=" + id
        })
      } else {
        wx.showToast({
          title: '您还未登录,请先登录吧~',
          icon: 'none',
          duration: 1000
        })
        setTimeout(function () {
          wx.navigateTo({
            url: "/personal/pages/wxLogin/wxLogin"
          })
        }, 1000)
      }
    },
  },
  /**
   * 组件生命周期
   */
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      if (wx.getStorageSync('userInfo')) {
        this.setData({
          isLogin: true
        })
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})