// personal/components/my-clue/modify/modify-unit/modify-unit.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showStatus: {
      type: Boolean
    },
    category: {
      type: Array
    },
    clueType: { // 线索类型 2-单位 1-个人
      type: Number,
      value: 2
    },
    operateType: { // 操作方式 0-创建 1-编辑
      type: Number
    },
    currentYear: {//当前选中的年份
      type: Number,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    unitData: {
      inventionPatentCount: "", // 发明专利数量
      usefulPatentCount: "", // 实用专利数量
      facePtentCount: "", // 外观专利数量
      trademarkCount: "", // 商标数量
      copyrightCount: "", // 版权数量
      otherPropertyCount: "", // 其他知产数量
      lastYearSalesCount: "", // 上年度销售总额id
      lastYearSalesName: "", // 上年度销售总额名称
      lastYearSalesCountDetail: "",
      lastYearCapitalCount: "", // 上年度资产总计id
      lastYearCapitalName: "", // 上年度资产总计名称
      lastYearCapitalCountDetail: "",
      lastYearProfitCount: "", // 上年度利润总额id
      lastYearProfitName: "", // 上年度利润总额名称
      lastYearProfitCountDetail: "",
      lastYearDevelopCount: "", // 上年度研费总额id
      lastYearDevelopName: "", // 上年度研费总额名称
      lastYearDevelopCountDetail: "",
      unitPersonCount: "", // 单位人数id
      unitPersonName: "", // 单位人数名称
      unitPersonCountDetail: "",
      mainBusiness: "", // 主营业务
      nextProjectPlan: "", // 规划
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 判断赋值
    switchValue(num, val) {
      let object = this.data.unitData
      switch (num) {
        case 0:
          object.inventionPatentCount = val
          break
        case 1:
          object.trademarkCount = val
          break
        case 2:
          object.usefulPatentCount = val
          break
        case 3:
          object.copyrightCount = val
          break
        case 4:
          object.facePtentCount = val
          break
        case 5:
          object.otherPropertyCount = val
          break
        case 6:
          object.lastYearSalesCountDetail = val
          break
        case 7:
          object.lastYearCapitalCountDetail = val
          break
        case 8:
          object.lastYearProfitCountDetail = val
          break
        case 9:
          object.lastYearDevelopCountDetail = val
          break
        case 10:
          object.unitPersonCountDetail = val
          break
        case 11:
          object.mainBusiness = val
          break
        case 12:
          object.nextProjectPlan = val
          break
      }
      this.setData({
        unitData: object
      })
    },
    // picker判断赋值
    switchPickerValue(type, index) {
      let optionList = this.data.category[6].optionList
      let unitData = this.data.unitData
      switch (type) {
        case 1:
          unitData.lastYearSalesName = optionList[index].name
          unitData.lastYearSalesCount = optionList[index].id
          break
        case 2:
          unitData.lastYearCapitalName = optionList[index].name
          unitData.lastYearCapitalCount = optionList[index].id
          break
        case 3:
          unitData.lastYearProfitName = optionList[index].name
          unitData.lastYearProfitCount = optionList[index].id
          break
        case 4:
          unitData.lastYearDevelopName = optionList[index].name
          unitData.lastYearDevelopCount = optionList[index].id
          break
      }
      this.setData({
        unitData: unitData
      })
    },
    // 修改输入框信息
    changeInput(e) {
      let type = Number(e.currentTarget.dataset.type)
      let val = e.detail.value.trim()
      this.switchValue(type, val)
      console.log(this.data.unitData)
    },
    // 修改销售额（上年度系列）
    bindSaleChange(e) {
      let type = Number(e.currentTarget.dataset.type)
      let index = Number(e.detail.value)
      this.switchPickerValue(type, index)
      console.log(this.data.unitData)
    },
    // 修改单位数量
    bindPersonChange(e) {
      let index = Number(e.detail.value)
      let optionList = this.data.category[7].optionList
      let unitData = this.data.unitData
      unitData.unitPersonName = optionList[index].name
      unitData.unitPersonCount = optionList[index].id
      this.setData({
        unitData: unitData
      })
      console.log(this.data.unitData)
    },

    // 按钮操作 参数num：0-创建 1-编辑 2-下一步/继续填写 3-上一步
    handelOperate(e) {
      let num = e.currentTarget.dataset.num
      this.triggerEvent('handelOperate', num)
    }
  }
})