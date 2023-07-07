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
      value: 2
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
    // 跳转产品详情
    toDetail() {
      let id = this.data.projectInfo.id;
      let type = this.data.index
      wx.navigateTo({
        url: `/product/pages/detail/detail?id=${id}&type=${type}`
      })
    },
  }
})