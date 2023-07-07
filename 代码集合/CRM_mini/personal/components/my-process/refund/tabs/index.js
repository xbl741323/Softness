// personal/components/my-process/refund/tabs/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    refundFeeData: {
      type: Array
    },
    taskData: {
      type: Array
    },
    logList:{
      type: Array
    },
    processData: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tabList: [ '订单信息及退款信息', '任务信息', '审核记录' ],
    cTabIndex: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeTab(e) {
      this.setData({
        cTabIndex: e.detail.name
      })
    },
  },
  lifetimes:{
    attached: function () {
      console.log(this.data.refundFeeData,'0001');
    }
  }
})

