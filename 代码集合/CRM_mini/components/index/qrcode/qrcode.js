// components/index/qrcode/qrcode.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: { 
      type: Boolean,
      value: false
    },
    url: { 
      type: String,
      value: ''
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
    closePop() {
      wx.setStorageSync('close', true)
      this.setData({ show: false });
    },
  }
})
