// classRoom/components/class-study/browse-item/browse-item.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    courseInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageUrl: app.globalData.imageURL,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转课程详情
    toCourseDetail(e) {
      let id = this.data.courseInfo.id
      wx.navigateTo({
        url: `/classRoom/pages/detail/course/course?id=${id}`,
      })
    },
  }
})