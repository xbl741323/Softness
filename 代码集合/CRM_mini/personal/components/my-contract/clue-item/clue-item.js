// personal/components/my-clue/clue-item/clue-item.js

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    clueInfo: {
      type: Object
    },
    clueType: {
      type: Number,
      value: 2
    },
    isPerson: { // 引用来源 true-录入合同
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 打电话
    phoneCall(e) {
      let phone = e.currentTarget.dataset.phone
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    },
  },
  lifetimes: {
    attached: function () {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    },
  },
})