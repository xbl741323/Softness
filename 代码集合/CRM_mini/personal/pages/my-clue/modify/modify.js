// personal/pages/my-clue/modify/modify.js
const app = getApp();
import {
  getFinanceInfo
} from "../../../../utils/api/clue"
import {
  returnArea,
  returnCategory,
  filterIndustry,
  filterUnitType,
  filterLastYearSale,
  filterClueLabel,
  filterEmployeesNum,
  filterArea,
} from "../../../../utils/clue/clue"
import {
  throttle
} from "../../../../utils/common/utils"
import {
  operateClue,
  getClueDetail,
  getConnectEmp
} from "../../../../utils/api/clue"
import Toast from '@vant/weapp/toast/toast';
import * as CodeMsg from "../../../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentYear: '',
    financeInfo: {},
    isCertified: false, // 是否已认证 true-是 false-否
    clueInfo: {}, // 线索对象
    userInfo: {},
    connectEmpinfo: {},
    isPerson: true,
    clueId: "", // 编辑时的线索id
    clueType: 2, // 线索类型 2-单位 1-个人
    operateType: 0, // 操作方式 0-创建 1-编辑
    cTabIndex: 0, // 控制组件显示索引
    category: [],
    area: [],
    transInfo: { // 缓存数据
      orgType: "",
      industry: "",
      clueLebel: "",
      area: "",
      lastYearSale: "",
      lastYearAssets: "",
      lastYearProfit: "",
      lastYearDevExpenses: "",
      unitEmployees: "",
    }
  },
  // 回到页面顶部
  toTop() {
    app.toTop()
  },
  // 修改线索类型
  changeCluetype(e) {
    this.setData({
      clueType: e.detail
    })
  },
  //合作商获取对接人信息
  getConnectEmpInfo() {
    let params = {
      partnerId: this.data.userInfo.partnerId
    }
    getConnectEmp(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        this.setData({
          connectEmpinfo: res.data
        })
      }
    })
  },
  // 按钮操作 参数num：0-创建 1-编辑 2-下一步/继续填写 3-上一步 4-调用基本信息创建 5-调用基本信息保存
  handelOperate(e) {
    let num = e.detail
    if (num == 0 || num == 1) {
      this.operateFinalClue()
    } else if (num == 4) {
      this.selectComponent("#basic").validateSubmit(0)
    } else if (num == 5) {
      this.selectComponent("#basic").validateSubmit(1)
    } else {
      this.toTop()
      this.showCurrentPage(num)
    }
  },
  // 线索参数赋值
  fixParams() {
    let clueType = this.data.clueType
    let operateType = this.data.operateType
    let basicInfo = this.selectComponent("#basic").properties.basicInfo
    let salesManInfo = this.data.userInfo.isPartner ? this.data.connectEmpinfo : this.selectComponent("#basic").properties.salesManInfo
    let params = {
      clueGradeId: basicInfo.clueMarkId, // 线索标签id
      companyName: basicInfo.unitName, // 单位名称
      orgType: basicInfo.unitTypeId, // 单位类型id
      industry: basicInfo.industryIdList.join(','), // 行业类型id集合
      orgAddress: basicInfo.areaIdList.join(','), // 所在地区id集合
      detailAddress: basicInfo.detailAddress, // 详细地址
      remark: "", // 备注
    }
    if (operateType == 0) {
      params.clueSalesmanEmpNo = this.data.userInfo.isPartner ? salesManInfo.connectEmpNo : salesManInfo.salesManNo // 业务员No
      params.clueSalesmanEmpId = this.data.userInfo.isPartner ? salesManInfo.connectEmpId : salesManInfo.salesManId // 业务员id
      params.clueSalesmanEmpName = this.data.userInfo.isPartner ? salesManInfo.connectEmpName : salesManInfo.salesManLabel // 业务员name
    } else {
      let clueId = this.data.clueId
      // 编辑时传线索id
      clueType == 2 ? params.clueCompanyId = clueId : params.cluePersonId = clueId
    }
    // 创建和编辑单位线索时才传
    if (clueType == 2) {
      params.organization = basicInfo.uscc // 信用代码
      params.clueCompanyUnit = this.fixCompanyUnitQuery() // 单位数据
      params.clueCompanyStaff = this.fixCompanyStaffQuery() // 员工数据
      params.clueCompanyContactList = this.fixcontactQuery() // 联系人列表
      params.clueCompanyInvoice = this.fixInvoiceQuery() // 开票信息 
    } else {
      // 创建和编辑个人线索时才传
      // params.sex = this.basicInfo.sex // 性别暂时不传
      params.mobile = basicInfo.contactMobile
      params.contactName = basicInfo.contactName
      params.jobName = basicInfo.contactJob
      params.cluePersonInvoice = this.fixInvoiceQuery() // 开票信息 
    }
    return params
  },
  // 创建线索/编辑线索
  operateFinalClue: throttle(function () {
    let that = this
    let clueType = this.data.clueType
    let operateType = this.data.operateType
    operateClue(this.fixParams(), operateType, clueType).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        wx.showToast({
          icon: "success",
          title: operateType == 0 ? "创建成功！" : "修改成功！",
        })
        wx.disableAlertBeforeUnload({
          success: (res) => {},
        })
        setTimeout(() => {
          that.skipOperate()
        }, 500)
      } else {
        Toast({
          context: this,
          message: res.msg
        });
      }
    })
  }, 2000),
  // 跳转操作
  skipOperate() {
    let operateType = this.data.operateType
    if (operateType == 0) {
      wx.redirectTo({
        url: '/personal/pages/my-clue/list/list',
      })
    } else {
      wx.navigateBack()
    }
  },
  // 返回单位数据
  fixCompanyUnitQuery() {
    let unitData = this.selectComponent("#unit").properties.unitData
    let object = {
      inventionNum: unitData.inventionPatentCount, // 发明专利数量
      practicalNum: unitData.usefulPatentCount, // 实用专利数量
      appearanceNum: unitData.facePtentCount, // 外观专利数量
      trademarkNum: unitData.trademarkCount, // 商标数量
      copyrightNum: unitData.copyrightCount, // 版权数量
      otherNum: unitData.otherPropertyCount, // 其他知产数量
      lastYearSale: unitData.lastYearSalesCount, // 上年度销售总额id
      lastYearSaleAmount: unitData.lastYearSalesCountDetail,
      lastYearAssets: unitData.lastYearCapitalCount, // 上年度资产总计id
      lastYearAssetsAmount: unitData.lastYearCapitalCountDetail,
      lastYearProfit: unitData.lastYearProfitCount, // 上年度利润总额id
      lastYearProfitAmount: unitData.lastYearProfitCountDetail,
      lastYearDevExpenses: unitData.lastYearDevelopCount, // 上年度研费总额id
      lastYearDevExpensesAmount: unitData.lastYearDevelopCountDetail,
      unitEmployees: unitData.unitPersonCount, // 单位人数id
      unitEmployeesNum: unitData.unitPersonCountDetail,
      mainBusiness: unitData.mainBusiness, // 主营业务
      nextPlanning: unitData.nextProjectPlan, // 规划
    }
    return object
  },
  // 返回人员数据
  fixCompanyStaffQuery() {
    let personInfo = this.selectComponent("#person").properties.personInfo
    let object = {
      legalName: personInfo.legalPerson, // 法人
      legalMobile: personInfo.legalPersonPhone,
      treasurerName: personInfo.treasurer, // 财务主管
      treasurerMobile: personInfo.treasurerPhone,
      technicalName: personInfo.technicalDirector, // 技术主管
      technicalMobile: personInfo.technicalDirectorPhone,
      marketingName: personInfo.marketingDirector, // 营销主管
      marketingMobile: personInfo.marketingDirectorPhone,
      administrativeName: personInfo.executiveDirector, // 人事主管
      administrativeMobile: personInfo.executiveDirectorPhone,
    }
    return object
  },
  // 返回开票数据
  fixInvoiceQuery() {
    let clueType = this.data.clueType
    let billingInfo = this.selectComponent("#invoice").properties.billingInfo
    let object = {
      registerAddress: billingInfo.registerAddress, // 注册地址
      registerMobile: billingInfo.registerPhone, // 注册电话
      bankName: billingInfo.depositBank, // 开户银行
      bankAccount: billingInfo.bankAccountNo, // 银行账号
    }
    // 创建和编辑个人线索时才传
    if (clueType == 1) {
      object.companyName = billingInfo.unitName // 单位名称
      object.organization = billingInfo.billingNumber // 发票税号
    }
    return object
  },
  // 返回联系人信息
  fixcontactQuery() {
    let basicInfo = this.selectComponent("#basic").properties.basicInfo
    let contactInfoList = this.selectComponent("#basic").properties.contactList
    let contactList = [{
      authStatus: "0", // 0-自定义 1-已注册 2-已授权
      isManager: 0, // 是否管理员账号1-是 0-否
      mobile: basicInfo.contactMobile,
      contactName: basicInfo.contactName,
      jobName: basicInfo.contactJob,
    }]
    if (contactInfoList.length > 0) {
      contactInfoList.forEach(item => {
        contactList.push({
          authStatus: "0", // 0-自定义 1-已注册 2-已授权
          isManager: 0,
          mobile: item.contactMobile,
          contactName: item.contactName,
          jobName: item.contactJob,
        })
      })
    }
    return contactList;
  },
  // 上一步/下一步修改展示组件
  showCurrentPage(num) {
    let cTabIndex = this.data.cTabIndex
    this.setData({
      cTabIndex: num == 2 ? cTabIndex + 1 : cTabIndex - 1
    })
  },
  // 离开页面提示
  confirmLeave() {
    let operateType = this.data.operateType
    if (wx.enableAlertBeforeUnload) {
      wx.enableAlertBeforeUnload({
        message: operateType == 0 ? '退出后该线索信息将无法保存，是否退出？' : '退出后将无法保存修改，是否退出？',
      })
    }
  },
  // 初始化赋值
  setOriginalValue() {
    this.setData({
      area: returnArea(),
      category: returnCategory()
    })
  },
  // 获取线索详情信息
  getClueInfo() {
    let clueId = this.data.clueId
    let isPerson = this.data.isPerson
    let clueType = this.data.clueType
    let params = clueType == 1 ? {
      cluePersonId: clueId
    } : {
      clueCompanyId: clueId
    }
    getFinanceInfo({clueId: this.data.clueId, year: this.data.currentYear}).then(res=>{
      if(res.data){
        res.data.lastYearSale = filterLastYearSale(res.data.lastYearSale)
        res.data.lastYearAssets = filterLastYearSale(res.data.lastYearAssets)
        res.data.lastYearProfit = filterLastYearSale(res.data.lastYearProfit)
        res.data.lastYearDevExpenses = filterLastYearSale(res.data.lastYearDevExpenses)
        res.data.unitEmployees = filterEmployeesNum(res.data.unitEmployees)
      }
      this.setData({
        financeInfo: res.data || {}
      })
    })
    getClueDetail(params, clueType, isPerson).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        this.setData({
          clueInfo: res.data
        })
        this.filterType()
        this.editReceive()
      }
    })
  },
  // 线索编辑时数据回显
  editReceive() {
    let clueType = this.data.clueType
    this.receiveBasicInfo()
    this.receiveBasicValidateInfo()
    this.receiveContactInfo()
    this.receiveInvoiceInfo()
    clueType == 2 ? this.receiveUnitInfo() : ""
  },
  // 回显联系人信息
  receiveContactInfo() {
    this.basic = this.selectComponent("#basic")
    let clueInfo = this.data.clueInfo
    let clueType = this.data.clueType
    let basicInfo = this.basic.properties.basicInfo
    if (clueInfo.clueCompanyContactList && clueInfo.clueCompanyContactList.length > 0) {
      let objectOne = clueInfo.clueCompanyContactList[0]
      // 回显联系人1信息
      basicInfo.contactName = objectOne.contactName
      basicInfo.contactJob = objectOne.jobName
      basicInfo.contactMobile = objectOne.mobile
      basicInfo.contactNameStatus = objectOne.authorizedLabel != 0 ? true : false
      basicInfo.contactMobileStatus = objectOne.authorizedLabel != 0 ? true : false
      this.basic.setData({
        basicInfo: basicInfo
      })
      if (clueType == 2 && clueInfo.clueCompanyContactList.length > 1) {
        let contactInfoList = []
        clueInfo.clueCompanyContactList.slice(1).forEach((item) => {
          contactInfoList.push({
            contactName: item.contactName,
            contactJob: item.jobName,
            contactMobile: item.mobile,
            // contactNameStatus: item.authStatus == 2 ? true : false,
            // contactMobileStatus: item.authStatus == 2 ? true : item.authStatus == 1 ? true : false
          })
        })
        this.basic.setData({
          contactList: contactInfoList
        })
      }
    }
  },
  // 回显单位信息 + 单位人员信息
  receiveUnitInfo() {
    this.unit = this.selectComponent("#unit")
    this.person = this.selectComponent("#person")
    let clueInfo = this.data.clueInfo
    let clueType = this.data.clueType
    let transInfo = this.data.transInfo
    let unitData = this.unit.properties.unitData
    let personInfo = this.person.properties.personInfo
    if (clueType == 2) {
      // 单位信息
      if (clueInfo.clueCompanyUnit) {
        let clueOrganization = clueInfo.clueCompanyUnit
        let financeInfo = this.data.financeInfo;
        unitData.inventionPatentCount = clueOrganization.inventionList == null ? null : clueOrganization.inventionList.length // 发明专利数量
        unitData.usefulPatentCount = clueOrganization.practicalList == null ? null : clueOrganization.practicalList.length // 实用专利数量
        unitData.facePtentCount = clueOrganization.appearanceList == null ? null : clueOrganization.appearanceList.length // 外观专利数量
        unitData.trademarkCount = clueOrganization.trademarkList == null ? null : clueOrganization.trademarkList.length // 商标数量
        unitData.copyrightCount = clueOrganization.copyrightList == null ? null : clueOrganization.copyrightList.length // 版权数量
        unitData.otherPropertyCount = clueOrganization.otherList == null ? null : clueOrganization.otherList.length // 其他知产数量
        unitData.lastYearSalesCount = Number(financeInfo.lastYearSale) == 0 ? '' : Number(financeInfo.lastYearSale) // 上年度销售总额id
        unitData.lastYearSalesName = financeInfo.lastYearSale // 上年度销售总额名称
        unitData.lastYearSalesCountDetail = financeInfo.lastYearSaleAmount
        unitData.lastYearCapitalCount = Number(financeInfo.lastYearAssets) == 0 ? '' : Number(financeInfo.lastYearAssets) // 上年度资产总计id
        unitData.lastYearCapitalName = financeInfo.lastYearAssets // 上年度资产总计名称
        unitData.lastYearCapitalCountDetail = financeInfo.lastYearAssetsAmount
        unitData.lastYearProfitCount = Number(financeInfo.lastYearProfit) == 0 ? '' : Number(financeInfo.lastYearProfit) // 上年度利润总额id
        unitData.lastYearProfitName = financeInfo.lastYearProfit // 上年度利润总额名称
        unitData.lastYearProfitCountDetail = financeInfo.lastYearProfitAmount
        unitData.lastYearDevelopCount = Number(financeInfo.lastYearDevExpenses) == 0 ? '' : Number(financeInfo.lastYearDevExpenses) // 上年度研费总额id
        unitData.lastYearDevelopName = financeInfo.lastYearDevExpenses // 上年度研费总额名称
        unitData.lastYearDevelopCountDetail = financeInfo.lastYearDevExpensesAmount
        unitData.unitPersonCount = Number(financeInfo.unitEmployees) == 0 ? '' : Number(financeInfo.unitEmployees) // 单位人数
        unitData.unitPersonName = financeInfo.unitEmployees // 单位人数名称
        unitData.unitPersonCountDetail = financeInfo.unitEmployeesNum
        unitData.mainBusiness = financeInfo.mainBusiness // 主营业务
        unitData.nextProjectPlan = financeInfo.nextPlanning // 规划        
      }
      // 人员信息
      if (clueInfo.clueCompanyStaff) {
        let clueCompanyStaff = clueInfo.clueCompanyStaff
        personInfo.legalPerson = clueCompanyStaff.legalName
        personInfo.legalPersonPhone = clueCompanyStaff.legalMobile
        personInfo.treasurer = clueCompanyStaff.treasurerName
        personInfo.treasurerPhone = clueCompanyStaff.treasurerMobile
        personInfo.technicalDirector = clueCompanyStaff.technicalName
        personInfo.technicalDirectorPhone = clueCompanyStaff.technicalMobile
        personInfo.marketingDirector = clueCompanyStaff.marketingName
        personInfo.marketingDirectorPhone = clueCompanyStaff.marketingMobile
        personInfo.executiveDirector = clueCompanyStaff.administrativeName
        personInfo.executiveDirectorPhone = clueCompanyStaff.administrativeMobile
      }
      this.unit.setData({
        unitData: unitData
      })
      this.person.setData({
        personInfo: personInfo
      })
    }
  },
  // 回显开票信息
  receiveInvoiceInfo() {
    this.invoice = this.selectComponent("#invoice")
    let clueInfo = this.data.clueInfo
    let clueType = this.data.clueType
    let billingInfo = this.invoice.properties.billingInfo
    if (clueInfo.clueCompanyInvoice && clueType == 2) {
      let clueInvoice = clueInfo.clueCompanyInvoice
      billingInfo.unitName = clueInvoice.companyName
      billingInfo.billingNumber = clueInvoice.organization
      billingInfo.registerAddress = clueInvoice.registerAddress
      billingInfo.registerPhone = clueInvoice.registerMobile
      billingInfo.depositBank = clueInvoice.bankName
      billingInfo.bankAccountNo = clueInvoice.bankAccount
    }
    if (clueInfo.cluePersonInvoice && clueType == 1) {
      let clueInvoice = clueInfo.cluePersonInvoice
      billingInfo.unitName = clueInvoice.companyName
      billingInfo.billingNumber = clueInvoice.organization
      billingInfo.registerAddress = clueInvoice.registerAddress
      billingInfo.registerPhone = clueInvoice.registerMobile
      billingInfo.depositBank = clueInvoice.bankName
      billingInfo.bankAccountNo = clueInvoice.bankAccount
    }
    this.invoice.setData({
      billingInfo: billingInfo
    })
  },
  // 回显基本信息
  receiveBasicInfo() {
    this.basic = this.selectComponent("#basic")
    let clueInfo = this.data.clueInfo
    let clueType = this.data.clueType
    let transInfo = this.data.transInfo
    let basicInfo = this.basic.properties.basicInfo
    basicInfo.clueMark = transInfo.clueLebel // 回显信用代码
    basicInfo.clueMarkId = clueInfo.clueGradeId // 回显信用代码
    basicInfo.unitName = clueInfo.companyName // 回显单位名称
    basicInfo.uscc = clueInfo.organization == null ? "" : clueInfo.organization // 回显信用代码
    basicInfo.unitType = transInfo.orgType // 回显单位类型
    basicInfo.unitTypeId = clueInfo.orgType // 回显单位类型id
    basicInfo.industry = transInfo.industry // 回显行业类型
    basicInfo.industryIdList = clueInfo.industry.split(',') // 回显行业类型id集合
    basicInfo.area = transInfo.area // 回显所在地区
    basicInfo.areaIdList = clueInfo.orgAddress.split(',') // 回显地区id集合
    basicInfo.detailAddress = clueInfo.detailAddress // 回显详细地址
    // 个人线索信息回显
    if (clueType == 1) {
      basicInfo.contactName = clueInfo.contactName
      basicInfo.contactJob = clueInfo.jobName
      basicInfo.contactMobile = clueInfo.mobile
      basicInfo.contactNameStatus = clueInfo.isAutoConversion == true ? true : false
      basicInfo.contactMobileStatus = clueInfo.isAutoConversion == true ? true : false
    }
    this.basic.setData({
      basicInfo: basicInfo
    })
    // 认证状态赋值
    if (clueType == 2) {
      this.setData({
        isCertified: clueInfo.certifiedType != 0 ? true : false
      })
    } else {
      this.setData({
        isCertified: clueInfo.isAutoConversion
      })
    }
  },
  // 回显基本信息校验值
  receiveBasicValidateInfo() {
    this.basic = this.selectComponent("#basic")
    let validateInfo = this.basic.properties.validateInfo
    validateInfo.clueMarkError = true
    validateInfo.salesManError = true
    validateInfo.unitNameError = true
    validateInfo.usccError = true
    validateInfo.unitTypeError = true
    validateInfo.industryError = true
    validateInfo.areaError = true
    validateInfo.contactNameError = true
    validateInfo.contactJobError = true
    validateInfo.contactMobleError = true
    this.basic.setData({
      validateInfo: validateInfo
    })
  },
  // key值转换
  filterType() {
    let clueInfo = this.data.clueInfo
    let transInfo = this.data.transInfo
    let clueType = this.data.clueType
    transInfo.industry = filterIndustry(clueInfo.industry)
    transInfo.orgType = filterUnitType(clueInfo.orgType)
    transInfo.area = filterArea(clueInfo.orgAddress)
    transInfo.clueLebel = filterClueLabel(clueInfo.clueGradeId)
    if (clueType == 2) {
      let clueCompanyUnit = clueInfo.clueCompanyUnit
      transInfo.lastYearSale = filterLastYearSale(clueCompanyUnit.lastYearSale)
      transInfo.lastYearAssets = filterLastYearSale(clueCompanyUnit.lastYearAssets)
      transInfo.lastYearProfit = filterLastYearSale(clueCompanyUnit.lastYearProfit)
      transInfo.lastYearDevExpenses = filterLastYearSale(clueCompanyUnit.lastYearDevExpenses)
      transInfo.unitEmployees = filterEmployeesNum(clueCompanyUnit.unitEmployees)
    }
    this.setData({
      transInfo: transInfo
    })
  },
  // 设置线索信息
  setClueInfo(options) {
    if (options.data) {
      let data = JSON.parse(options.data)
      this.setData({
        clueId: data.clueId,
        clueType: data.clueType,
        operateType: 1
      })
      this.getClueInfo()
    }
    wx.setNavigationBarTitle({
      title: this.data.operateType == 0 ? '创建线索' : '编辑线索',
    })
    this.confirmLeave()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.setData({
      currentYear: JSON.parse(options.data).currentYear
    })
    if (options && options.clueType) {
      this.setData({
        clueType: Number(options.clueType)
      })
    }
    this.setOriginalValue()
    this.setClueInfo(options)
    if (this.data.userInfo.isPartner) {
      this.getConnectEmpInfo()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */

})