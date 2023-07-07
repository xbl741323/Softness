// components/index/projectItem/projectItem.js
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
    imageUrl: app.globalData.imageURL,
    isLogin: false,
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
    // 跳转项目申报详情
    toDeatil() {
      if (wx.getStorageSync('userInfo')) {
        let number = this.data.item.number;
        wx.navigateTo({
          url: "/search/pages/projectDetail/projectDetail?number=" + number
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
      console.log("进入了！")
      if (wx.getStorageSync('userInfo')) {
        this.setData({
          isLogin: true
        })
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      console.log("移除了！")
    },
  },
})