// personal/components/my-process/primary-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    primaryInfo: {
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
      let obj = {}
      if (this.data.primaryInfo.type == 1) {
        obj = {
          mobile: this.data.primaryInfo.contactMobile,
          userId: this.data.primaryInfo.userId,
        };
      } else {
        obj = {
          organization: this.data.primaryInfo.organization,
        };
      }
      let params = JSON.stringify(obj)
      wx.navigateTo({
        url: '/personal/pages/my-process/detail/primary-detail/primary-detail?id=' + this.data.primaryInfo.id + '&auditType=' + this.data.primaryInfo.flowStatus + '&taskNo=' + this.data.primaryInfo.flowNo + "&params=" + params + "&clueType=" + this.data.primaryInfo.clueType,
      })
    },
  }
})