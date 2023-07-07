// classRoom/components/class-study/record-item/record-item.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    recordInfo: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageUrl: app.globalData.imageURL,
    temUrl: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1114%2F0G020114924%2F200G0114924-15-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658472328&t=ff53d2c83483d0af1513b5ebfc666af1"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toCourseDetail() {
      let id = this.data.recordInfo.id
      wx.navigateTo({
        url: `/classRoom/pages/detail/course/course?id=${id}`,
      })
    }
  }
})