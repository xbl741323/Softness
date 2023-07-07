// components/personal/submitOrder/propertyInfo/propertyInfo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    productCount: 2,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setCount(e) {
      let status = e.currentTarget.dataset.status
      this.triggerEvent('setCount', status)
    },
  }
})