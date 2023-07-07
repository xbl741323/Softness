// components/personal/myClass/myClass.js
const app = getApp();
import {
  pageStudyCourse
} from "../../../utils/api/wtClass"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type: Array,
      value: [],
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
    toClassDetail(e) {
      let id = e.currentTarget.dataset.item.id
      wx.navigateTo({
        url: `/classRoom/pages/detail/course/course?id=${id}`,
      })
    },
    // 跳转课堂学习页面
    toMore() {
      wx.navigateTo({
        url: '/classRoom/pages/class-study/class-study',
      })
    },
  }
})