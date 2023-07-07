// personal/components/my-clue/modify/modify-invoice/modify-invoice.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showStatus: {
      type: Boolean
    },
    clueType: { // 线索类型 2-单位 1-个人
      type: Number,
      value: 2
    },
    operateType: { // 操作方式 0-创建 1-编辑
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    billingInfo: {
      unitName: "",
      billingNumber: "",
      registerAddress: "",
      registerPhone: "",
      depositBank: "",
      bankAccountNo: "",
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 判断赋值
    switchValue(num, val) {
      let backVal = val.replace(/[^\d-+]/g, "")
      let billingVal = val.replace(/[^\w\.\/]/ig, '')
      let object = this.data.billingInfo
      switch (num) {
        case 0:
          object.unitName = val
          break
        case 1:
          object.billingNumber = billingVal
          break
        case 2:
          object.registerAddress = val
          break
        case 3:
          object.registerPhone = val
          break
        case 4:
          object.depositBank = val
          break
        case 5:
          object.bankAccountNo = backVal
          break
      }
      this.setData({
        billingInfo: object
      })
    },
    // 修改开票信息
    changeInput(e) {
      console.log(e)
      let type = Number(e.currentTarget.dataset.type)
      let val = e.detail.value.trim()
      this.switchValue(type, val)
      console.log(this.data.billingInfo)
    },
    // 按钮操作 参数num：0-创建 1-编辑 2-下一步/继续填写 3-上一步 4-调用基本信息创建验证 5-调用基本信息保存
    handelOperate(e) {
      let num = e.currentTarget.dataset.num
      this.triggerEvent('handelOperate', num)
    },
  }
})