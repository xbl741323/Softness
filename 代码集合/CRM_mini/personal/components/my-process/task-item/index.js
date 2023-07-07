// personal/components/my-process/contract-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    taskInfo: {
      type: Object
    }
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

    // 复制链接
    copyText(e) {
      let text = e.currentTarget.dataset.text
      wx.setClipboardData({
        data: text,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              wx.showToast({
                title: '复制成功'
              })
            }
          })
        }
      })
    },

    viewDetail() {
      wx.navigateTo({
        url: '/personal/pages/my-process/detail/taskInfo-detail/index?id=' + this.data.taskInfo.id + '&taskNo=' + this.data.taskInfo.flowNo + '&orderId=' + this.data.taskInfo.orderId,
      })
    },
  }
})