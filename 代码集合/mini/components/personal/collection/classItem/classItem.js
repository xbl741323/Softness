// components/personal/collection/classItem/classItem.js
const app = getApp();
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
    imageUrl: app.globalData.imageURL,
    videoControl: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetail() {
      let id = this.data.productInfo.id;
      wx.navigateTo({
        url: `/classRoom/pages/detail/course/course?id=${id}`,
      })
    },
  }
})