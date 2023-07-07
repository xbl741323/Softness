// personal/components/my-clue/modify/modify-person/modify-person.js
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
    },
    isCertified: { // 是否已认证 true-是 false-否
      type: Boolean
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    personInfo: {
      legalPerson: "", // 法人
      legalPersonPhone: "",
      treasurer: "", // 财务主管
      treasurerPhone: "",
      technicalDirector: "", // 技术主管
      technicalDirectorPhone: "",
      marketingDirector: "", // 营销主管
      marketingDirectorPhone: "",
      executiveDirector: "", // 人事主管
      executiveDirectorPhone: "",
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 判断赋值
    switchValue(num, val) {
      let object = this.data.personInfo
      switch (num) {
        case 0:
          object.legalPerson = val
          break
        case 1:
          object.legalPersonPhone = val
          break
        case 2:
          object.treasurer = val
          break
        case 3:
          object.treasurerPhone = val
          break
        case 4:
          object.technicalDirector = val
          break
        case 5:
          object.technicalDirectorPhone = val
          break
        case 6:
          object.marketingDirector = val
          break
        case 7:
          object.marketingDirectorPhone = val
          break
        case 8:
          object.executiveDirector = val
          break
        case 9:
          object.executiveDirectorPhone = val
          break
      }
      this.setData({
        personInfo: object
      })
    },
    // 修改单位人员信息
    changeInput(e) {
      let type = Number(e.currentTarget.dataset.type)
      let val = e.detail.value.trim()
      this.switchValue(type, val)
      console.log(this.data.personInfo)
    },
    // 按钮操作 参数num：0-创建 1-编辑 2-下一步/继续填写 3-上一步
    handelOperate(e) {
      let num = e.currentTarget.dataset.num
      this.triggerEvent('handelOperate', num)
    }
  }
})