// components/classify/otherItem/otherItem.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    projectInfo: {
      type: Object,
      value: {}
    },
    index: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageUrl: app.globalData.imageURL,
    videoControl: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转重构新产品详情
    toDetail() {
      if (wx.getStorageSync('userInfo')) {
        let id = this.data.projectInfo.id;
        let type = this.data.index
        let params = {
          id: id,
          type: type
        }
        let data = JSON.stringify(params)
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
  lifetimes:{
    attached: function () {
      // console.log(this.data.projectInfo.spuMinAmount/1,'-----'); 
    }
  }
})