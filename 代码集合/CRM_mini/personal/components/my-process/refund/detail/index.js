// personal/components/my-process/refund/detail/index.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    processData: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    index: 0,
    morePop: false,
    imageUrl: app.globalData.imageURL,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindchange(e) {
      let index = e.detail.current
      this.setData({
        index: index
      })
    },
    viewMore(e){
      let info = e.currentTarget.dataset.info;
      this.setData({
        morePop: true
      })
    },
    closePop(){
      this.setData({
        morePop: false
      })
    },
    //查看截图
    previewImg() {
      wx.previewImage({
        urls: [this.data.imageUrl+this.data.processData.refundPicUrl],
      })
    },
  }
})
