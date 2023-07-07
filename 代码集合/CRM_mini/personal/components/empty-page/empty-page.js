// personal/components/empty-page/empty-page.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageForm: { // 引用页面 0-线索列表 1-订单列表 2-录入合同选择订单列表
      type: Number,
      value: 0
    },
    addPermissions: { 
      type: Boolean,
    },
    clueType:{
      type:Number,
      value:2
    }
    // 线索类型 1-个人 2-单位
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toClueDetail() {
      wx.navigateTo({
        url: `/personal/pages/my-clue/modify/modify?clueType=${this.properties.clueType}`,
      })
    },
  }
})