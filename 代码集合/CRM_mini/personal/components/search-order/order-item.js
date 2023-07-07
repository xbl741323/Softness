// personal/components/search-order/order-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderInfo: {
      type: Object
    },
    type: {
      type: String
    },
    proTypeList: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    professionIds: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //复制
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
    //专业类型
    filterProfession() {
      let arr = [];
      this.data.proTypeList.forEach(item => {
        if (this.data.orderInfo.professionIds.includes(item.id)) {
          arr.push(item.categoryName)
        }
      })
      this.setData({
        professionIds: arr.join(',')
      })
    },
  },

  lifetimes: {
    attached() {
      if (this.data.type == 1) {
        this.filterProfession()
      }
    }
  }
})