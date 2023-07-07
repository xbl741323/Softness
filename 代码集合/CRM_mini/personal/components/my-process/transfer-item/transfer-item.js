// personal/components/my-process/transfer-item/transfer-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    processInfo: {
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
    toOrderDetail() {
      wx.navigateTo({
        url: `/personal/pages/my-process/detail/transfer-detail/transfer-detail?taskId=${this.data.processInfo.taskId}`,
      })
    },
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
  }
})
