// personal/pages/my-clue/list/list.js
import {
  getMyClueList,
  allotBelong,
  getPartnerList
} from "../../../../utils/api/clue"
import * as CodeMsg from "../../../../utils/common/codeMsg";
import {
  filterArea
} from "../../../../utils/clue/clue"
import {
  getArea,
} from "../../../../utils/api/user";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    allotInfo: { // 分配对象
      type: "", // 分配类型 0-分配线索归属 1-分配业务员
      id: "" // 分配的线索id
    },
    loading: true,
    isPerson: true,
    reachStatus: false, // 是否触底加载更多数据
    newTotal: 0,
    clueType: 2, // 线索类型 1-个人 2-单位
    clueList: [],
    keyWords: "",
    currentPage: 1,
    pageSize: 10,
    tipText: '',
    index: 0,
    isShow: false,
    filters: {
      clueUserEmp: "",
      clueAttributionEmp: "",
      clueSalesmanEmp: "",
      createBy: "",
    },
    areaFilters: {
      accountStatus: null,
      area: "地区", // 所在地区
      areaIdList: [], // 所在地区id集合
    },
    cAreaInedx: 0, // 第一层索引下标
    areaList: [],
    areaRange: [
      [],
      [],
      []
    ],
    // 必填项校验 fasle-未通过 true-通过
    validateInfo: {
      areaError: false,
    },
    areaIndex: [0, 0, 0],
    cluefromShow: false,
    customerOwnerList: [{
      partnerId: "",
      partnerName: "全部",
    }],
    partnerId: null,
    partnerIndex: 0,
    partnerIndex1: 0,
    addPermissions: false,
    permissionsList: [],
    authTypeDialog: false,//认证类型弹窗
    authType: "1",//认证类型
    clueId: null,//单位线索ID
    myClueType: null//我的线索类型 1-个人 2-单位
  },
  // 清除关键词
  clearKerword() {
    this.setData({
      keyWords: "",
      currentPage: 1,
      reachStatus: false
    })
    this.getList()
  },
  // 显示员工选择框
  showEmpSheet(e) {
    console.log(e, "输出时代大厦")
    this.setData({
      allotInfo: e.detail
    })
    this.selectComponent('#query-emp').show()
  },
  // 选择员工
  selectEmp(e) {
    console.log(e)
    let empInfo = e.detail
    this.allot(empInfo)
  },

  // 线索提供方
  showCluefrom() {
    this.setData({
      cluefromShow: true,
    })
  },

  changeClueUserEmp(e) {
    let filters = this.data.filters
    filters.clueUserEmp = e.detail.value
    this.setData({
      filters: filters
    })
  },
  changeClueAttributionEmp(e) {
    let filters = this.data.filters
    filters.clueAttributionEmp = e.detail.value
    this.setData({
      filters: filters
    })
  },
  changeClueSalesmanEmp(e) {
    let filters = this.data.filters
    filters.clueSalesmanEmp = e.detail.value
    this.setData({
      filters: filters
    })
  },
  changeCreateBy(e) {
    let filters = this.data.filters
    filters.createBy = e.detail.value
    this.setData({
      filters: filters
    })
  },

  submit() {
    let partnerId = ""
    let partnerIndex1 = this.data.partnerIndex1
    partnerId = this.data.customerOwnerList[partnerIndex1].partnerId
    this.setData({
      partnerId: partnerId,
      cluefromShow: false,
      partnerIndex: this.data.partnerIndex1,
    })
  },
  cancel() {
    this.setData({
      cluefromShow: false,
    })
  },
  resetBtn() {
    let filters = {
      clueUserEmp: "",
      clueAttributionEmp: "",
      clueSalesmanEmp: "",
      createBy: "",
    }
    this.setData({
      filters: filters,
      partnerId: null,
      partnerIndex: 0,
      partnerIndex1: 0,
    })
    this.getList()
    this.onCloseMenu();
  },
  okBtn() {
    this.getList()
    this.onCloseMenu();
  },
  //关闭筛选弹窗
  onCloseMenu() {
    this.selectComponent('#item').toggle();
  },
  // 修改地区
  changeArea(e) {
    this.getAreaValue(e.detail.value)
  },
  // 修改地区-column
  changeColumnArea(e) {
    this.getAreaRange(e.detail.column, e.detail.value)
  },
  // 封装地区回显name方法
  getAreaValue(list) {
    let areaNameList = []
    let areaIdList = []
    let areaRange = this.data.areaRange
    let areaFilters = this.data.areaFilters
    let validateInfo = this.data.validateInfo
    areaRange.forEach((item, index) => {
      if (item.length > 0) {
        areaNameList.push(item[list[index]].name)
        areaIdList.push(item[list[index]].id)
      }
    })
    areaFilters.area = areaNameList.join(',')
    areaFilters.areaIdList = areaIdList
    validateInfo.areaError = areaIdList.length > 0 ? true : false
    this.setData({
      areaFilters: areaFilters,
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
  getAreaData() {
    let areaRange = this.data.areaRange
    getArea().then((res) => {
      if (res.code == CodeMsg.CODE_0) {
        let list = res.data
        list.forEach(item => {
          if (item.children != undefined && item.children.length > 0) {
            item.children.forEach(item1 => {
              item1.children.unshift({
                areaName: '全部',
                id: 0,
                nodeNumber: 0,
              })
            })
          }
          item.children.unshift({
            areaName: '全部',
            id: 0,
            nodeNumber: 0,
            children: [{
              areaName: '全部',
              id: 0,
              children: null,
              parentId: 0,
            }]
          })
        })
        list.forEach(item => {
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
  // 获取线索提供方列表
  getCustomerOwnerList() {
    getPartnerList().then(res => {
      if (res.code == 0) {
        let customerOwnerList = this.data.customerOwnerList
        res.data.forEach(item => {
          customerOwnerList.push(item)
        })
        this.setData({
          customerOwnerList: customerOwnerList,
        })
      }
    })
  },
  changeClueFrom(e) {
    let partnerIndex1 = ""
    partnerIndex1 = e.detail.value[0]
    this.setData({
      partnerIndex1: partnerIndex1,
    })
  },
  // 分配 type：0-分配线索归属 1-分配业务员
  allot(empInfo) {
    console.log(empInfo, "empInfo")
    let type = this.data.allotInfo.type
    let id = this.data.allotInfo.id
    let clueType = this.data.clueType
    let param = {
      clueEmpId: empInfo.userId, // 指定员工id
      clueEmpName: empInfo.name, // 指定员工名称
      clueEmpNo: empInfo.number, // 指定员工Number
      clueEmpDeptId: empInfo.deptId, // 指定员工部门id
      clueEmpDeptName: empInfo.deptName, // 指定员工部门名称
      clueEmpDeptNo: empInfo.deptNumber, // 指定员工部门Number
      clueIdList: [id], // 待分配线索ID列表
    };
    allotBelong(param, type, clueType).then((res) => {
      if (res.code == CodeMsg.CODE_0) {
        wx.showToast({
          icon: "success",
          title: '分配成功！',
        })
        this.searchList()
      } else {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
      }
    });
  },
  // 改变搜索内容
  changeKeywords(e) {
    this.setData({
      keyWords: e.detail.value.trim(),
    })
  },
  // 改变线索类型
  changeType() {
    let clueType = this.data.clueType
    this.setData({
      clueType: clueType == 1 ? 2 : 1,
      currentPage: 1
    })
    this.getList()
  },
  getPermissionsList() {
    let permissionsList = []
    this.data.userInfo.authorities.forEach(item => {
      permissionsList.push(item.authority)
    })
    this.setData({
      permissionsList: permissionsList,
    })
  },
  searchList() {
    this.setData({
      currentPage: 1,
      reachStatus: false
    })
    this.getList()
  },
  // 子组件通知父组件刷新页面
  refresh() {
    this.searchList()
  },
  addPermissions() {
    let userInfo = this.data.userInfo
    let list = []
    userInfo.authorities.forEach(item => {
      list.push(item.authority)
    })
    if (list.includes("bt_add_clue_my")) {
      this.setData({
        addPermissions: true
      })
    }
  },
  // 获取我的线索列表
  getList() {
    let area = ''
    if (this.data.areaFilters.areaIdList.length != 0) {
      area = this.data.areaFilters.areaIdList.join(',')
    }
    let params = {
      key: this.data.keyWords,
      pageNo: this.data.currentPage,
      pageSize: this.data.pageSize,
      orgAddress: this.data.areaFilters.areaIdList.length == 0 ? null : area,
      clueUserEmp: this.data.filters.clueUserEmp,
      clueAttributionEmp: this.data.filters.clueAttributionEmp,
      clueSalesmanEmp: this.data.filters.clueSalesmanEmp,
      createBy: this.data.filters.createBy,
      partnerId: this.data.partnerId,
      sortField: 'createTime',
      sortType: 'desc'
    }
    getMyClueList(params, this.data.clueType).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let reachStatus = this.data.reachStatus
        let clueList = this.data.clueList
        let result = res.data.records
        result.forEach(item => {
          item.area = filterArea(item.orgAddress)
        })
        this.setData({
          clueList: reachStatus == true ? clueList.concat(result) : result,
          reachStatus: false,
          newTotal: res.data.total,
          loading: true
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  // 触底加载更多数据
  getReachList() {
    let clueList = this.data.clueList
    let newTotal = this.data.newTotal
    let currentPage = this.data.currentPage
    if (clueList.length < newTotal) {
      this.setData({
        reachStatus: true,
        currentPage: currentPage + 1
      })
      this.getList()
    }
  },
  goToaddPage() {
    wx.navigateTo({
      url: '/personal/pages/my-clue/modify/modify',
    })
  },
  // 获取子传父数据
  handleItemChange(e) {
    let item = e.detail
    item.isShow && this.setData({
      isShow: item.isShow,
      tipText: item.tipText,
    })
    !item.isShow && setTimeout(()=>{
      this.setData({
        isShow: false
      },1500)
    })
    item.authTypeDialog && this.setData({
      authTypeDialog: item.authTypeDialog
    })
    item.clueId && this.setData({
      clueId: item.clueId
    })

    if(item.clueType){
      this.setData({
        myClueType: item.clueType
      })
      if(item.clueType==1){
        this.setData({
          authType: "2"
        })
      }
    }
  },
  // 关闭认证类型弹窗
  closeAuthDialog(){
    this.setData({
      authTypeDialog: false,
      authType: '1'
    })
  },
  // 提交认证类型
  submitAuthType(){
    // authType 1 后台自主认证 2 电商认证
    // clueType 0 个人 1 单位
    wx.navigateTo({
      url: `/personal/pages/my-clue/launch-approve/launch-approve?id=${this.data.clueId}&&authType=${this.data.authType}&&clueType=${this.data.myClueType}`,
    })
    this.closeAuthDialog()
  },
  // 单选框状态切换
  onChangeRadio(event) {
    this.setData({
      authType: event.detail,
    });
  },
  // 禁止屏幕滚动
  preventTouchMove() {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
      this.getList()
    }
    this.getAreaData()
    this.addPermissions()
    this.getCustomerOwnerList()
    this.getPermissionsList()
    if(options.clueType){
      this.setData({
        clueType: options.clueType
      })
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
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.refresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.getReachList()
  },

  /**
   * 用户点击右上角分享
   */

})