// components/address-item/address-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    addressInfo: {
      type: Object,
      value: {
        existDfault: false
      }
    },
    pageForm: {
      type: Number,
      value: 0 // 0-提交订单页 1-订单详情页
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},
  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转到添加收件地址页面
    toSetAddress(e) {
      let type = e.currentTarget.dataset.type
      if (type == 1) {
        wx.navigateTo({
          url: `/personal/pages/setAddress/setAddress?type=${type}`,
        })
      } else {
        wx.navigateTo({
          url: `/personal/pages/address/address?type=${0}`,
        })
      }
    },
  },
})