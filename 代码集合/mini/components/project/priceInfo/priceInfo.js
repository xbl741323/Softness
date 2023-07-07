// components/project/priceInfo/priceInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    projectInfo:{
      type:Object,
      value:{}
    },
    categories: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 0:全显示 1:只显示面议 2:只显示定金 3:只显示现价（现尾款）原价（原尾款）
    showType: 3,
    previousFee: 200000,
    nowFee: 1000000,
    dingFee: 200000,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})