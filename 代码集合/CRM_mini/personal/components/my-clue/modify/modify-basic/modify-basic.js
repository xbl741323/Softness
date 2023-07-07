// personal/components/my-clue/modify/modify-basic/modify-basic.js
import {
  getArea
} from "../../../../../utils/api/category"
import * as CodeMsg from "../../../../../utils/common/codeMsg";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    category: {
      type: Array
    },
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
    clueNo: {
      type: String
    },
    connectEmpinfo: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    validStatus: false, // 是否开启必填项校验
    signManInfo: "",
    userInfo: {},
    industryList: [],
    showPanel: true,
    cAreaInedx: 0, // 第一层索引下标
    areaList: [],
    areaRange: [
      [],
      [],
      []
    ],
    areaIndex: [0, 0, 0],
    // 分配业务员信息
    salesManInfo: {
      salesManNo: "", // 业务员No
      salesManId: "", // 业务员id
      salesManLabel: "" // 业务员name
    },
    // 必填项校验 fasle-未通过 true-通过
    validateInfo: {
      clueMarkError: false,
      salesManError: false,
      unitNameError: false,
      usccError: false,
      unitTypeError: false,
      industryError: false,
      areaError: false,
      contactNameError: false,
      contactJobError: false,
      contactMobleError: false
    },
    basicInfo: {
      contactName: "", // 联系人名称
      contactJob: "", // 联系人职位
      contactMobile: "", // 联系人手机号
      contactNameStatus: false, // 能否编辑 false-能 true-不能
      contactMobileStatus: false,
      clueMark: "", // 线索标签
      clueMarkId: "", // 线索id
      unitName: "", // 单位名称
      uscc: "", // 统一社会信用代码
      unitType: "", // 单位类型
      unitTypeId: "", // 单位类型id
      industry: "", // 行业类型
      industryIdList: [], // 行业类型id集合
      area: "", // 所在地区
      areaIdList: [], // 所在地区id集合
      detailAddress: "" // 详细地址
    },
    // 单位联系人信息
    contactList: [],
    clueTypeArray: [{
        title: "单位",
        value: 2
      },
      {
        title: "个人",
        value: 1
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 修改联系人信息
    bindContactInfo(e) {
      let type = Number(e.currentTarget.dataset.type)
      let index = Number(e.currentTarget.dataset.index)
      let val = e.detail.value.trim()
      let contactList = this.data.contactList
      type == 0 ? contactList[index].contactName = val : ""
      type == 1 ? contactList[index].contactJob = val : ""
      type == 2 ? contactList[index].contactMobile = val : ""
      this.setData({
        contactList: contactList
      })
      console.log(this.data.contactList)
    },
    confirmDel(e) {
      let that = this
      wx.showModal({
        content: "确定删除？",
        cancelColor: "#999999",
        cancelText: "取消",
        confirmColor: "#36A6FE",
        confirmText: "确定",
        success(res) {
          if (res.confirm) {
            that.delContact(e)
          } else if (res.cancel) {}
        }
      })
    },
    // 删除联系人
    delContact(e) {
      let index = Number(e.currentTarget.dataset.index)
      let contactList = this.data.contactList
      contactList.splice(index, 1)
      this.setData({
        contactList: contactList
      })
    },
    // 添加联系人
    addContact() {
      let object = {
        contactName: "",
        contactJob: "",
        contactMobile: "",
        contactNameStatus: false,
        contactMobileStatus: false,
      }
      let contactList = this.data.contactList
      contactList.push(object)
      this.setData({
        contactList: contactList
      })
    },
    // 回显行业类型值
    getIndustryValue() {
      let basicInfo = this.data.basicInfo
      let industryList = this.data.industryList
      let validateInfo = this.data.validateInfo
      let nameList = []
      basicInfo.industryIdList = []
      industryList.forEach(item => {
        if (item.checked) {
          basicInfo.industryIdList.push(item.id)
          nameList.push(item.name)
        }
      })
      basicInfo.industry = nameList.join(",")
      validateInfo.industryError = nameList.length > 0 ? true : false
      this.setData({
        basicInfo: basicInfo,
        validateInfo: validateInfo,
        showPanel: true
      })
    },
    // 修改行业类型
    checkboxIndustryChange(e) {
      let checkedList = e.detail.value
      let industryList = this.data.industryList
      industryList.forEach(item => {
        item.disabled = checkedList.length >= 3 ? true : false
        item.checked = false
        if (checkedList.indexOf(String(item.id)) != -1 || checkedList.indexOf(item.id) != -1) {
          item.checked = true
          item.disabled = false
        }
      })
      this.setData({
        industryList: industryList
      })
    },
    // 展示行业类型action弹窗
    showIndustryPanel() {
      let industryList = this.data.industryList
      let industryIdList = this.data.basicInfo.industryIdList
      let cList = this.data.category[4].optionList
      console.log(industryIdList, "industryIdList")
      if (industryList.length == 0) {
        cList.forEach(item => {
          item.disabled = industryIdList.length >= 3 ? true : false
          item.checked = false
          if (industryIdList.indexOf(item.id) != -1 || industryIdList.indexOf(String(item.id)) != -1) {
            item.checked = true
            item.disabled = false
          }
        })
      }
      this.setData({
        industryList: industryList.length == 0 ? cList : industryList,
        showPanel: false
      })
    },
    // 关闭行业类型action弹窗
    closeIndustryPanel() {
      this.setData({
        showPanel: true
      })
    },
    getAreaData() {
      let areaRange = this.data.areaRange
      getArea().then((res) => {
        if (res.code == CodeMsg.CODE_0) {
          res.data.forEach(item => {
            areaRange[0].push({
              id: item.id,
              name: item.areaName
            })
          })
          this.setData({
            areaList: res.data,
            areaRange: areaRange
          })
          this.getAreaRange(0, 0)
        }
      })
    },
    // 修改线索类型
    changeClueType(e) {
      let val = e.detail.value == 0 ? 2 : 1
      this.triggerEvent('changeCluetype', val)
    },
    // 修改线索标签
    changeClueMark(e) {
      let index = Number(e.detail.value)
      let basicInfo = this.data.basicInfo
      let optionList = this.data.category[8].optionList
      let validateInfo = this.data.validateInfo
      validateInfo.clueMarkError = true
      basicInfo.clueMark = optionList[index].name
      basicInfo.clueMarkId = optionList[index].id
      this.setData({
        basicInfo: basicInfo,
        validateInfo: validateInfo
      })
    },
    // 修改单位名称
    changeUnitName(e) {
      let basicInfo = this.data.basicInfo
      let val = e.detail.value.trim()
      let validateInfo = this.data.validateInfo
      validateInfo.unitNameError = val == '' ? false : true
      basicInfo.unitName = val
      this.setData({
        basicInfo: basicInfo,
        validateInfo: validateInfo
      })
    },
    // 修改信用代码
    changeUscc(e) {
      console.log(e)
      let basicInfo = this.data.basicInfo
      let val = e.detail.value.trim()
      let validateInfo = this.data.validateInfo
      let newVal = val.slice(0, 18).replace(/[^\w\.\/]/ig, '')
      validateInfo.usccError = newVal == '' ? false : true
      basicInfo.uscc = newVal
      this.setData({
        basicInfo: basicInfo,
        validateInfo: validateInfo
      })
    },
    // 修改单位类型
    changeUnitType(e) {
      let index = Number(e.detail.value)
      let basicInfo = this.data.basicInfo
      let optionList = this.data.category[5].optionList
      let validateInfo = this.data.validateInfo
      validateInfo.unitTypeError = true
      basicInfo.unitType = optionList[index].name
      basicInfo.unitTypeId = optionList[index].id
      this.setData({
        basicInfo: basicInfo,
        validateInfo: validateInfo
      })
    },
    // 封装地区回显name方法
    getAreaValue(list) {
      let areaNameList = []
      let areaIdList = []
      let areaRange = this.data.areaRange
      let basicInfo = this.data.basicInfo
      let validateInfo = this.data.validateInfo
      areaRange.forEach((item, index) => {
        if (item.length > 0) {
          areaNameList.push(item[list[index]].name)
          areaIdList.push(item[list[index]].id)
        }
      })
      basicInfo.area = areaNameList.join(',')
      basicInfo.areaIdList = areaIdList
      validateInfo.areaError = areaIdList.length > 0 ? true : false
      this.setData({
        basicInfo: basicInfo,
        validateInfo: validateInfo
      })
    },
    // 封装地区设置areaRange方法
    getAreaRange(column, value) {
      let areaList = this.data.areaList
      let areaRange = this.data.areaRange
      let cAreaInedx = this.data.cAreaInedx
      // 改变第一层数据时
      if (column == 0) {
        areaRange[1] = []
        areaRange[2] = []
        areaList[value].children.forEach((item) => {
          areaRange[1].push({
            id: item.id,
            name: item.areaName
          })
        })
        areaList[value].children[0].children.forEach((item) => {
          areaRange[2].push({
            id: item.id,
            name: item.areaName
          })
        })
        this.setData({
          cAreaInedx: value,
          areaIndex: [value, 0, 0],
          areaRange: areaRange,
        })
      }
      // 改变第二层数据时
      if (column == 1) {
        areaRange[2] = []
        if (areaList[cAreaInedx].children[value].children.length > 0) {
          areaList[cAreaInedx].children[value].children.forEach(item => {
            areaRange[2].push({
              id: item.id,
              name: item.areaName
            })
          })
        }
        this.setData({
          areaIndex: [cAreaInedx, value, 0],
          areaRange: areaRange,
        })
      }
    },
    // 修改地区
    changeArea(e) {
      this.getAreaValue(e.detail.value)
    },
    // 修改地区-column
    changeColumnArea(e) {
      this.getAreaRange(e.detail.column, e.detail.value)
    },
    // 显示员工选择框
    showEmpSheet() {
      this.selectComponent('#query-emp').show()
    },
    // 选择签约人
    selectEmp(e) {
      let result = e.detail
      let salesManInfo = this.data.salesManInfo
      let validateInfo = this.data.validateInfo
      validateInfo.salesManError = true
      salesManInfo.salesManNo = result.number
      salesManInfo.salesManId = result.userId
      salesManInfo.salesManLabel = result.name
      this.setData({
        salesManInfo: salesManInfo,
        validateInfo: validateInfo
      })
    },
    // 修改详细地址
    changeDetailAddress(e) {
      let val = e.detail.value.trim()
      let basicInfo = this.data.basicInfo
      basicInfo.detailAddress = val
      this.setData({
        basicInfo: basicInfo
      })
    },
    // 修改联系人信息 type: 0-姓名 1-职位 2-手机号
    changeContactInfo(e) {
      let type = e.currentTarget.dataset.type
      let val = e.detail.value.trim()
      let basicInfo = this.data.basicInfo
      let validateInfo = this.data.validateInfo
      type == 0 ? basicInfo.contactName = val : ''
      type == 1 ? basicInfo.contactJob = val : ''
      type == 2 ? basicInfo.contactMobile = val : ''
      this.setData({
        basicInfo: basicInfo
      })
      validateInfo.contactNameError = basicInfo.contactName != '' ? true : false
      validateInfo.contactJobError = basicInfo.contactJob != '' ? true : false
      validateInfo.contactMobleError = basicInfo.contactMobile != '' ? true : false
      this.setData({
        validateInfo: validateInfo
      })
    },
    // 按钮操作 参数num：0-创建 1-编辑 2-下一步/继续填写 3-上一步
    handelOperate(e) {
      let num = e.currentTarget.dataset.num
      if (num == 0 || num == 1) {
        this.validateSubmit(num)
      } else {
        this.triggerEvent('handelOperate', num)
      }
    },
    // 判断联系人是否为空
    validateContact(num) {
      let contactList = this.data.contactList
      let result = contactList.filter(item => {
        return (item.contactName == '' || item.contactJob == '' || item.contactMobile == '')
      })
      let resultNull = contactList.filter(item => {
        return (item.contactName == '' && item.contactJob == '' && item.contactMobile == '')
      })
      if ((result.length > 0 && resultNull.length == 0)) {
        wx.showToast({
          icon: "none",
          title: '请将联系人信息补充完整！',
        })
      } else {
        this.triggerEvent('handelOperate', num)
      }
    },
    // 验证信用代码
    validateUscc(num) {
      let basicInfo = this.data.basicInfo
      if (basicInfo.uscc.length != 18) {
        wx.showToast({
          icon: "none",
          title: '请输入18位信用代码！',
        })
      } else {
        this.validateContact(num)
      }
    },
    // 必填项校验
    validateSubmit(num) {
      let clueType = this.data.clueType
      let validateInfo = this.data.validateInfo
      if (this.data.userInfo.isPartner) {
        validateInfo.salesManError = true
      }
      let unitValid = validateInfo.clueMarkError && validateInfo.salesManError && validateInfo.unitNameError && validateInfo.usccError && validateInfo.unitTypeError && validateInfo.industryError && validateInfo.areaError && validateInfo.contactNameError && validateInfo.contactJobError && validateInfo.contactMobleError
      let soloValid = validateInfo.clueMarkError && validateInfo.salesManError && validateInfo.contactNameError && validateInfo.contactJobError && validateInfo.contactMobleError
      let valid = clueType == 2 ? unitValid : soloValid
      this.setData({
        validStatus: !valid
      })
      if (valid) {
        clueType == 2 ? this.validateUscc(num) : this.triggerEvent('handelOperate', num)
      } else {
        wx.showToast({
          icon: "none",
          title: '请核验表单信息再进行提交！',
        })
      }
    },
  },
  lifetimes: {
    attached() {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
      })
      this.getAreaData()
    }
  }
})