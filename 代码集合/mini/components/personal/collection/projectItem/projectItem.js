// components/project/projectItem/projectItem.js
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
    manageStatus: {
      type: Boolean,
      value: false
    },
    priceType: {
      type: Number,
      // 0:只显示定金 // 1:只显示面议 // 2:只显示原价 // 3:只显示现价
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
  methods: {}
})