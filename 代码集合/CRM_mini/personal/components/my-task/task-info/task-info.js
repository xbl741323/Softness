// personal/components/my-clue/clue-item/clue-item.js
const app = getApp();
import {
  receive,
  getFinanceInfo
} from "../../../../utils/api/clue"
import {
  filterIndustry,
  filterUnitType,
  filterLastYearSale,
  filterClueLabel,
  filterEmployeesNum,
  filterArea,
} from "../../../../utils/clue/clue"
import {
  getTaskDetail,
  modClueCompanyOfMy,
  getCustomerInfo,
  updateLicense,
} from "../../../../utils/api/mytask"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    taskobj: {
      type: Object
    },
    taskInfo: {
      type: Object
    },
    clueId: {
      type: Number
    },
    category: {
      type: Array
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    financeInfo: {},
    yearsList: [],
    currentYear: '',
    licenseFile: {},//执照信息
    accessInfo: {},//token信息
    setTime: null, //定时器
    taskMyInfo: {},
    taskListdata: {},
    clueType: null,
    showStartTime: false,
    obj: {
      arr: {
        bij: null
      }
    },
    monad: false,
    userInfo: {},
    btnIndex: 0,
    personInfo: {
      legalName: "", // 法人
      legalMobile: "",
      treasurerName: "", // 财务主管
      treasurerMobile: "",
      technicalName: "", // 技术主管
      technicalMobile: "",
      marketingName: "", // 营销主管
      marketingDlMobile: "",
      administrativeName: "", // 人事主管
      marketingMobile: "",
    },
    unitData: {
      inventionNum: "", // 发明专利数量
      practicalNum: "", // 实用专利数量
      appearanceNum: "", // 外观专利数量
      trademarkNum: "", // 商标数量
      copyrightNum: "", // 版权数量
      otherNum: "", // 其他知产数量
      lastYearSalesCount: "", // 上年度销售总额id
      lastYearSalesName: "", // 上年度销售总额名称
      lastYearSaleAmount: "",
      lastYearCapitalCount: "", // 上年度资产总计id
      lastYearCapitalName: "", // 上年度资产总计名称
      lastYearAssetsAmount: "",
      lastYearProfitCount: "", // 上年度利润总额id
      lastYearProfitName: "", // 上年度利润总额名称
      unitEmployeesNum: "",
      lastYearDevelopCount: "", // 上年度研费总额id
      lastYearProfit: "", // 上年度研费总额名称
      lastYearDevExpensesAmount: "",
      unitPersonCount: "", // 单位人数id
      unitEmployeesNum: "", // 单位人数名称
      unitPersonCountDetail: "",
      mainBusiness: "", // 主营业务
      nextPlanning: "", // 规划
    },
    gather: {
      mainBusiness: "", // 主营业务
      nextPlanning: "", // 规划
      inventionNum: "", // 发明专利数量
      practicalNum: "", // 实用专利数量
      appearanceNum: "", // 外观专利数量
      trademarkNum: "", // 商标数量
      copyrightNum: "", // 版权数量
      otherNum: "", // 其他知产数量
      lastYearSalesCount: '',
      lastYearCapitalCount: '',
      lastYearProfitAmount: '',
      lastYearDevelopCount: '',
      unitPersonCount: "", // 单位人数id
      numberOfPeople: "",
      lastYearDevExpensesAmount: '',
      unitEmployees: "",
      lastYearDevExpenses: ''
    }
  },

  
  /**
   * 组件的方法列表
   */
  methods: {
    bindYearChange(e){
      this.setData({
        currentYear: this.data.yearsList[e.detail.value].year
      })
      this.getList();
    },
    /* 更新上传营业执照 */
    uploadLicense(){
      let that = this;
      this.setData({
        accessInfo: wx.getStorageSync('accessInfo'),
      })
      wx.chooseMessageFile({
        count: 1,
        type: 'image,file',
        success(res) {
          // tempFilePath可以作为 img 标签的 src 属性显示图片
          let file = res.tempFiles[0]
          let startIndex = file.path.indexOf('.')
          let fileName = file.name
          let fileType = file.path.slice(startIndex + 1)
          let fileSize = file.size
          if (fileType != 'pdf' && fileType != 'jpg' && fileType != 'png' && fileType != 'jpeg') {
            message('请选择pdf格式的文件或者图片格式！')
            return false
          }
          if (fileSize > 4 * (1024 * 1024)) {
            message('文件大小不能超过4M！')
            return false
          }
          that.uploadImage(file, fileName)
        }
      })
    },
    // 上传文件
    uploadImage(item, name) {
      let size = item.size/(1024*1024)
      let fileSize = size.toFixed(2);
      if(Number(fileSize) >= 1){
        fileSize += 'M'
      }else{
        fileSize += 'K'
      }
      wx.showLoading({
        title: '上传中，请稍等',
      })
      let that = this
      wx.uploadFile({
        filePath: item.path,
        name: 'file', //后台接收图片的字段
        url: app.globalData.baseURL + "/wtcrm/file/upload",
        method: "post",
        header: {
          "Content-Type": "multipart/form-data",
          'Authorization': 'Bearer ' + that.data.accessInfo.access_token,
        },
        success(res) {
          let result = JSON.parse(res.data)
          if (result.code == CodeMsg.CODE_0) {
            let licenseFile = {
              name: name,
              fileUrl: app.globalData.imageURL+result.data,
              fileSize: fileSize
            }
            that.setData({
              licenseFile: licenseFile
            })
            that.updateBusinessLicense();
            wx.hideLoading({
              success: (res) => {},
            })
          }
        }
      })
    },

    updateBusinessLicense(){
      let param = {
        clueId: this.data.taskInfo.clueId,
        clueType: this.data.taskInfo.clueType,
        sourceNo: this.data.taskInfo.taskNo,
        sourceName: this.data.taskInfo.spuName,
        fileName: this.data.licenseFile.name,
        fileSize: this.data.licenseFile.fileSize,
        fileUrl: this.data.licenseFile.fileUrl,
      }
      updateLicense(param).then(res=>{
        if(res.code == 0){
          wx.showToast({
            icon: "success",
            title: '营业执照更新成功！',
          })
          this.getList();
        }
      })
    },

    /* 
    查看营业执照
    */
    viewLicense(e){
      let url = e.currentTarget.dataset.url;
      let fileType = url.slice(url.lastIndexOf('.') + 1);
      if(fileType == 'pdf'){
        wx.showLoading({
          title: '加载中...',
        })
        wx.downloadFile({
          url: url,
          success: function (res) {
            var filePath = res.tempFilePath;
            wx.openDocument({
              filePath: filePath,
              fileType: `${fileType}`,
              showMenu: true,
              success: () => {
                wx.hideLoading({
                  success: (res) => {},
                })
              }
            })
          }
        })
      }else{
        wx.previewImage({
          urls: [url],
        })
      }
    },

    getList() {
      getTaskDetail(this.properties.clueId).then(res => {
        if (res.code == 0) {
          this.setData({
            taskMyInfo: res.data
          })
        }
        let obj = {
          id: this.data.taskInfo.id,
          clueId: this.data.taskInfo.clueId,
          listType: "personal"
        }
        getCustomerInfo(obj, this.data.taskMyInfo.clueType).then(res => {
          if (res.code == 0) {
            this.setData({
              taskListdata: res.data
            })
            this.filterType()
            if (this.data.taskMyInfo.clueType == 2) {
              this.assignment()
            }
          }
        })
        getFinanceInfo({clueId: this.data.taskInfo.clueId, year: this.data.currentYear}).then(res=>{
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
      })
    },
    // otherNum
    assignment() {
      let personInfo = this.data.personInfo
      let taskListdata = this.data.taskListdata
      let financeInfo = this.data.financeInfo
      personInfo.legalName = taskListdata.clueCompanyStaff.legalName
      personInfo.legalMobile = taskListdata.clueCompanyStaff.legalMobile
      personInfo.treasurerName = taskListdata.clueCompanyStaff.treasurerName
      personInfo.treasurerMobile = taskListdata.clueCompanyStaff.treasurerMobile
      personInfo.technicalName = taskListdata.clueCompanyStaff.technicalName
      personInfo.technicalMobile = taskListdata.clueCompanyStaff.technicalMobile
      personInfo.marketingName = taskListdata.clueCompanyStaff.marketingName
      // personInfo.marketingMobile = taskListdata.clueCompanyStaff.marketingMobile
      personInfo.administrativeName = taskListdata.clueCompanyStaff.administrativeName
      personInfo.administrativeMobile = taskListdata.clueCompanyStaff.administrativeMobile
      personInfo.marketingDlMobile = taskListdata.clueCompanyStaff.marketingMobile
      let unitData = this.data.unitData
      unitData.inventionNum = taskListdata.clueCompanyUnit.inventionList == null ? null : taskListdata.clueCompanyUnit.inventionList.length
      unitData.otherNum = taskListdata.clueCompanyUnit.otherList == null ? null : taskListdata.clueCompanyUnit.otherList.length
      unitData.practicalNum = taskListdata.clueCompanyUnit.practicalList == null ? null : taskListdata.clueCompanyUnit.practicalList.length
      unitData.trademarkNum = taskListdata.clueCompanyUnit.trademarkList == null ? null : taskListdata.clueCompanyUnit.trademarkList.length
      unitData.copyrightNum = taskListdata.clueCompanyUnit.copyrightList == null ? null : taskListdata.clueCompanyUnit.copyrightList.length
      unitData.appearanceNum = taskListdata.clueCompanyUnit.appearanceList == null ? null : taskListdata.clueCompanyUnit.appearanceList.length
      unitData.lastYearSaleAmount = financeInfo.lastYearSaleAmount
      unitData.lastYearAssetsAmount = financeInfo.lastYearAssetsAmount
      unitData.lastYearProfitAmount = financeInfo.lastYearProfitAmount
      unitData.lastYearDevelopCount = financeInfo.lastYearDevExpensesAmount
      unitData.unitPersonCount = financeInfo.unitEmployeesNum
      unitData.unitPersonCount = financeInfo.unitEmployeesNum
      unitData.lastYearSalesName = financeInfo.lastYearSale
      unitData.lastYearProfitName = financeInfo.lastYearProfit
      unitData.lastYearDevelopName = financeInfo.lastYearDevExpenses
      unitData.unitEmployees = financeInfo.unitEmployees
      unitData.unitEmployeesNum = financeInfo.unitEmployeesNum
      unitData.lastYearCapitalName = financeInfo.lastYearAssets
      unitData.mainBusiness = financeInfo.mainBusiness
      unitData.nextPlanning = financeInfo.nextPlanning

      this.setData({
        personInfo,
        unitData,
      })
    },
    cliackOfUnits() {
      this.setData({
        showStartTime: true
      })
    },
    onConfirm(event) {
      const {
        picker,
        value,
        index
      } = event.detail;
      this.onCancel()
    },

    onCancel() {
      this.setData({
        showStartTime: false
      })
    },
    changeDetailAddress(e) {
      let val = e.detail.value.trim()
      let taskInfo = this.data.taskInfo
      taskInfo.clueCompanyUnit.nextPlanning = val
      this.setData({
        taskInfo: taskInfo
      })
    },
    changeDetailProject(e) {
      let val = e.detail.value.trim()
      let taskInfo = this.data.taskInfo
      taskInfo.clueCompanyUnit.mainBusiness = val
      this.setData({
        taskInfo: taskInfo
      })
    },
    monadtxt() {
      if (this.data.monad) {
        if (this.data.btnIndex == 1) {//修改单位信息
          let gather = this.data.gather
          console.log(gather);
          let obj = {
            clueCompanyId: this.data.taskListdata.clueCompanyId,
            clueCompanyUnit: Object.assign(gather, {lastYear:this.data.currentYear})
          }
          modClueCompanyOfMy(obj).then(res => {
            if (res.code == 0) {
              wx.showToast({
                icon: "success",
                title: '修改成功',
              })
              this.setData({
                monad: false
              })
              this.getList()
            }
          })
        } else {
          let obj = {
            clueCompanyId: this.data.taskListdata.clueCompanyId,
            clueCompanyStaff: this.data.personInfo
          }
          modClueCompanyOfMy(obj).then(res => {//修改人员信息
            if (res.code == 0) {
              wx.showToast({
                icon: "success",
                title: '修改成功',
              })
              this.getList()
              this.setData({
                monad: false
              })
            }
          })
        }
      } else {
        this.setData({
          monad: true
        })
      }
    },
    // 人员信息编辑
    compileTxt() {

    },
    clickTabBtn(e) {
      this.setData({
        monad: false,
        btnIndex: e.currentTarget.dataset.name

      })
    },
    // 分配 type：0-分配线索归属 1-分配业务员
    allot(e) {
      let type = e.currentTarget.dataset.type
      let clueType = this.data.clueType
      let taskInfo = this.data.taskInfo
      let id = clueType == 2 ? taskInfo.clueCompanyId : taskInfo.cluePersonId
      let obj = {
        type: type,
        id: id
      }
      this.triggerEvent('showAllot', obj)
    },
    // 领取公海客户
    receive() {
      let that = this
      wx.showModal({
        content: "确定领取？",
        cancelColor: "#999999",
        cancelText: "取消",
        confirmColor: "#36A6FE",
        confirmText: "确定",
        success(res) {
          if (res.confirm) {
            that.receiveOperate()
          } else if (res.cancel) {}
        }
      })
    },
    // 领取操作
    receiveOperate() {
      let clueType = this.data.clueType
      let taskInfo = this.data.taskInfo
      let params = {
        clueIdList: [clueType == 2 ? taskInfo.clueCompanyId : taskInfo.cluePersonId]
      }
      receive(params, this.data.clueType).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          wx.showToast({
            icon: "success",
            title: '领取成功！',
          })
          this.triggerEvent('refresh')
        } else {
          wx.showToast({
            icon: "none",
            title: res.msg,
          })
        }
      })
    },
    // 判断赋值
    switchValue(num, val) {
      let object = this.data.unitData
      let gather = this.data.gather
      switch (num) {
        case 0:
          object.inventionNum = val
          gather.inventionNum = val
          break
        case 1:
          object.trademarkNum = val
          gather.trademarkNum = val
          break
        case 2:
          object.practicalNum = val
          gather.practicalNum = val
          break
        case 3:
          object.copyrightNum = val
          gather.copyrightNum = val
          break
        case 4:
          object.appearanceNum = val
          gather.appearanceNum = val
          break
        case 5:
          object.otherNum = val
          gather.otherNum = val
          break
        case 6:
          object.lastYearSaleAmount = val
          gather.lastYearSaleAmount = val
          break
        case 7:
          object.lastYearAssetsAmount = val
          gather.lastYearAssetsAmount = val
          break
        case 8:
          object.lastYearProfitAmount = val
          gather.lastYearProfitAmount = val
          break
        case 9:
          object.lastYearDevelopCount = val
          gather.lastYearDevExpensesAmount = val
          break
        case 10:
          object.unitEmployeesNum = val
          gather.unitEmployeesNum = val
          break
        case 11:
          object.mainBusiness = val
          gather.mainBusiness = val
          break
        case 12:
          object.nextPlanning = val
          gather.nextPlanning = val
          break
      }
      this.setData({
        gather,
        unitData: object
      })
    },
    switchPickerValue(type, index) {
      let optionList = this.data.category[6].optionList
      let unitData = this.data.unitData
      let gather = this.data.gather
      switch (type) {
        case 1:
          unitData.lastYearSalesName = optionList[index].name
          unitData.lastYearSale = optionList[index].id
          gather.lastYearSale = optionList[index].id
          break
        case 2:
          unitData.lastYearCapitalName = optionList[index].name
          unitData.lastYearAssets = optionList[index].id
          gather.lastYearAssets = optionList[index].id
          break
        case 3:
          unitData.lastYearProfitName = optionList[index].name
          unitData.lastYearProfit = optionList[index].id
          gather.lastYearProfit = optionList[index].id
          break
        case 4:
          unitData.lastYearDevelopName = optionList[index].name
          unitData.lastYearDevelop = optionList[index].id
          gather.lastYearDevExpenses = optionList[index].id
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
    },
    // 修改销售额（上年度系列）
    bindSaleChange(e) {
      console.log(e);
      let type = Number(e.currentTarget.dataset.type)
      let index = Number(e.detail.value)
      this.switchPickerValue(type, index)
    },
    // 修改单位数量
    bindPersonChange(e) {
      let index = Number(e.detail.value)
      let optionList = this.data.category[7].optionList
      let unitData = this.data.unitData
      let gather = this.data.gather
      unitData.unitEmployees = optionList[index].name
      gather.unitEmployees = optionList[index].id
      this.setData({
        gather,
        unitData: unitData
      })
    },
    // 判断赋值
    switchValuePeople(num, val) {
      let object = this.data.personInfo
      switch (num) {
        case 0:
          object.legalName = val
          break
        case 1:
          object.legalMobile = val
          break
        case 2:
          object.treasurerName = val
          break
        case 3:
          object.treasurerMobile = val
          break
        case 4:
          object.technicalName = val
          break
        case 5:
          object.technicalMobile = val
          break
        case 6:
          object.marketingName = val
          break
        case 7:
          object.marketingDlMobile = val
          break
        case 8:
          object.administrativeName = val
          break
        case 9:
          object.administrativeMobile = val
          break
        case 10:
          object.administrativeMobile = val
          break
      }
      this.setData({
        personInfo: object
      })
    },
    // 修改单位人员信息
    changeInputpop(e) {
      let type = Number(e.currentTarget.dataset.type)
      let val = e.detail.value.trim()
      this.switchValuePeople(type, val)
    },
    // 按钮操作 参数num：0-创建 1-编辑 2-下一步/继续填写 3-上一步
    handelOperate(e) {
      let num = e.currentTarget.dataset.num
      this.triggerEvent('handelOperate', num)
    },
    // key值转换
    filterType() {
      let taskListdata = this.data.taskListdata
      taskListdata.area = filterArea(taskListdata.orgAddress)
      if (this.data.taskMyInfo.clueType == 2) {
        taskListdata.clueLebel = filterClueLabel(taskListdata.clueGradeId)
        taskListdata.orgType = filterUnitType(taskListdata.orgType)
        taskListdata.isDeal = filterIndustry(taskListdata.industry)
        let clueCompanyUnit = taskListdata.clueCompanyUnit
        taskListdata.lastYearSale = filterLastYearSale(clueCompanyUnit.lastYearSale)
        taskListdata.lastYearAssets = filterLastYearSale(clueCompanyUnit.lastYearAssets)
        taskListdata.lastYearProfit = filterLastYearSale(clueCompanyUnit.lastYearProfit)
        taskListdata.lastYearDevExpenses = filterLastYearSale(clueCompanyUnit.lastYearDevExpenses)
        taskListdata.unitEmployees = filterEmployeesNum(clueCompanyUnit.unitEmployees)
      }
      this.setData({
        taskListdata: taskListdata
      })
    },
  },
  
  lifetimes: {
    attached: function () {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
      let year = new Date().getFullYear();
      let yearsList = [];
      yearsList.push(
        { year: parseInt(year-1), name:'-'+parseInt(year-1)+'年度' },
        { year: parseInt(year-2), name:'-'+parseInt(year-2)+'年度' },
        { year: parseInt(year-3), name:'-'+parseInt(year-3)+'年度'},
      )
      this.setData({
        yearsList: yearsList,
        currentYear: parseInt(year-1)
      })
    },
  },
})