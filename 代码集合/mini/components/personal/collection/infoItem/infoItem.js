// components/personal/collection/infoItem/infoItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    productInfo: {
      type: Object,
      value: {}
    },
    manageStatus: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    productInfo: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetail() { 
      if (this.data.productInfo.state == 0) {
        wx.navigateTo({
          url: "/personal/pages/infoEmpty/empty",
        })
      } else {
        let productInfo = this.data.productInfo
        if (productInfo.type == 3) {
          wx.navigateTo({
            url: `/personal/pages/wtFile/fileDetail/fileDetail?fileId=${productInfo.infoId}`,
          })
        } else {
          wx.navigateTo({
            url: `/classRoom/pages/detail/info/info?number=${productInfo.infoNo}&id=${productInfo.infoId}&index=${productInfo.type == 1 ? 0 : 1}&sort=`,
          })
        }
      }
    }
  }
})
