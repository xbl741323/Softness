// personal/components/my-order/generate-order/product-info/product-info.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    productInfo: {
      type: Object
    },
    pageForm: { // 0-生成订单页 1-编辑草稿订单页
      type: Number,
      val: 0
    },
    orderRemark: {
      type: String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    payWayList: [{
        title: "定金+尾款",
        value: 0
      },
      {
        title: "一次性付款",
        value: 1
      }
    ],
    footStatusList: [{
        title: "尾款正常",
        value: 0
      },
      {
        title: "尾款待定",
        value: 1
      },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 改变产品数量
    changeNum(e) {
      this.triggerEvent('changeProInfo', {
        id: this.data.productInfo.id,
        type: 0,
        val: Number(e.detail),
      })
    },
    // 改变规格属性
    changeAttribute(e) {
      this.triggerEvent('changeProInfo', {
        id: this.data.productInfo.id,
        type: 1,
        val: Number(e.detail.value),
      })
    },
    // 改变订单备注
    changeRemark(e) {
      this.triggerEvent('changeProInfo', {
        id: this.data.productInfo.id,
        type: 2,
        val: e.detail.value,
      })
    },
    // 修改价格
    changePrice(e) {
      let type = Number(e.currentTarget.dataset.type)
      this.triggerEvent('changeProInfo', {
        id: this.data.productInfo.id,
        type: 3,
        val: {
          value: Number(e.detail.value),
          type: type
        },
      })
    },
    // 修改支付方式
    changePayWay(e) {
      this.triggerEvent('changeProInfo', {
        id: this.data.productInfo.id,
        type: 4,
        val: Number(e.detail.value),
      })
    },
    // 修改尾款状态
    changeFootStatus(e) {
      this.triggerEvent('changeProInfo', {
        id: this.data.productInfo.id,
        type: 5,
        val: Number(e.detail.value),
      })
    },
  }
})