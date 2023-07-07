// components/index/otherItem/otherItem.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  options: {
    addGlobalClass: true, //采用全局样式
  },
  properties: {
    item: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: 1
    },
    hot:{
      type:Boolean,
      value:null
    },
    categoryId:{
      type: Number,
      value: null
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
    // 跳转五大新产品详情
    toDetail() {
      if (wx.getStorageSync('userInfo')) {
        let id = this.data.item.id;
        let type = this.data.index
        let params = {
          id: id,
          // type: type
        }
        // let data = JSON.stringify(params)
        wx.navigateTo({
          url: `/search/pages/productdetails/productdetails?id=${id}&type=${type}`
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