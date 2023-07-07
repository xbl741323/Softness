// personal/pages/my-user/detail/detail.js
const app = getApp();
import {
  getClueDetail,
  delClue,
  receive,
  allotBelong
} from "../../../../utils/api/clue"
import {
  getUserDetail,
  editRemark,
  getMyRegister,
  getAllCustomer,
  userAllocationBatch
} from "../../../../utils/api/user"
import {
  filterIndustry,
  filterUnitType,
  filterLastYearSale,
  filterClueLabel,
  filterEmployeesNum,
  filterArea,
} from "../../../../utils/clue/clue"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showChild: false,
    active: '0',
    allotInfo: { // 分配对象
      type: "", // 分配类型 0-分配线索归属 1-分配业务员
      id: "" // 分配的线索id
    },
    btnStatus: 0,
    type: null,
    orderInfo: "",
    userInfo: "",
    userId: "", // 用户id
    isPerson: true, // 是否属于我的
    userType: null, // 用户类型0未认证 1-个人 2-单位
    clueType: null,// 线索类型1-个人 2-单位
    userDetailInfo: {}, // 用户详情信息
    clueInfo: {}, // 线索信息
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
    },
    remarkDialog: false,
    allotDialog: false,
    remark: "",//备注
    activeStatus: 0,
    registerInfo: {},//注册信息
    customerList:[],//客服列表
    customerId: null,//客服ID
    customerName: "",//客服姓名
  },
  // 修改展示tab类型
  changeTab(e) {
    let name = e.detail.name
    this.setData({
      active: name
    })
    this.getChildData()
  },
  // 调用子组件列表接口
  getChildData() {
    let active = this.data.active
    if (active == 1) {
      this.selectComponent("#order").getList()
    }
    if (active == 3) {
      this.selectComponent("#follow").getUserFollow()
    }
    if (active == 4) {
      this.selectComponent("#maintenance").getDiff()
    }
  },
  // 跳转到用户跟进
  toFollow() {
    let userId = this.data.userId
    let userType = this.data.userType
    this.setData({
      btnStatus: 1
    })
    setTimeout(()=>{
      this.setData({
        btnStatus: 0
      })
    },2000)
    wx.navigateTo({
      url: `/personal/pages/my-user/follow/follow?userId=${userId}&userType=${userType}`,
    })
  },
  // 复制链接
  copyText(e) {
    let text = e.currentTarget.dataset.text
    wx.setClipboardData({
      data: text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  // 获取用户详情
  getDetail() {
    let userId = this.data.userId
    let userType = this.data.userType
    getUserDetail(userId, userType).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        res.data.diyIndustryFilter = filterIndustry(res.data.diyIndustry)
        res.data.diyOrgAddressFilter = filterArea(res.data.diyOrgAddress)
        this.setData({
          userDetailInfo: res.data,
          clueType: res.data.clueType,
        })
        this.getClueDetail(res.data.clueId, res.data.clueType, this.data.isPerson)
      }
    })
  },
  // 获取线索详情
  getClueDetail(data, clueType, isPerson){
    let params = clueType == 1 ? {
      cluePersonId: data
    } : {
      clueCompanyId: data
    }
    getClueDetail(params, clueType, isPerson).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        this.setData({
          clueInfo: res.data,
          showChild: true,
        })
        this.filterType()
      }
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
  // 获取登录用户信息
  checkLoginStatus() {
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
      })
      this.getDetail()
      this.checkTabIndex()
    }
  },
  // 初始化赋值
  setOriginalValue(options) {
    this.setData({
      userId: options.userId,
      userType: options.userType
    })
    getMyRegister(options.userId, options.userType).then(res =>{
      if (res.code == CodeMsg.CODE_0) {
        res.data.diyIndustryFilter = filterIndustry(res.data.diyIndustry)
        res.data.diyOrgTypeFilter = filterUnitType(res.data.diyOrgType)
        this.setData({
          registerInfo: res.data
        })
      }
    })
  },
  // 子组件通知父组件刷新页面
  refresh() {
    getMyRegister(this.data.userId, this.data.userType).then(res =>{
      if (res.code == CodeMsg.CODE_0) {
        res.data.diyIndustryFilter = filterIndustry(res.data.diyIndustry)
        res.data.diyOrgTypeFilter = filterUnitType(res.data.diyOrgType)
        this.setData({
          registerInfo: res.data
        })
      }
    })
  },
  // 检查触底加载
  checkReach() {
    let active = this.data.active
    if (active == 1) {
      this.selectComponent("#order").getReachList()
    }
    if (active == 3) {
      this.selectComponent("#follow").getReachList()
    }
  },
  // 检查当前tab类型
  checkTabIndex() {
    this.getChildData()
  },
  // 打开备注弹窗
  openRemark(){
    this.setData({
      remarkDialog: true,
      remark: this.data.userDetailInfo.remark
    })
  },
  // 关闭备注弹窗
  closeRemark(){
    this.setData({
      remarkDialog: false,
    })
  },
  changeInput(e) {
    let type = e.currentTarget.dataset.type
    let val = e.detail.value.trim()
    let remark= this.data.remark
    type == 1 ? remark = val :''
    this.setData({
      remark: remark,
    })
  },
  // 提交备注
  confirmRemark(){
    let params = {
      userId: this.data.userId,
      remark: this.data.remark
    }
    editRemark(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        wx.showToast({
          title: "编辑备注成功",
          icon: 'success',
          duration: 1500
        })
        this.setData({
          remarkDialog: false
        })
        this.getDetail()
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500
        })
        this.setData({
          remarkDialog: false
        })
      }
    })
  },
  // 显示用户注册信息
  showRegister(){
    this.setData({
      activeStatus: 0
    })
  },
  // 显示用户线索信息
  showClue(){
    this.setData({
      activeStatus: 1
    })
  },
  // 显示用户分配弹窗
  toAllot(){
    this.setData({
      btnStatus: 2,
      allotDialog: true
    })
    setTimeout(()=>{
      this.setData({
        btnStatus: 0
      })
    },2000)
  },
  // 关闭分配弹窗
  closeAllot() {
    this.setData({ 
      allotDialog: false 
    });
  },
  // 获取客服列表
  getAllCustomer(){
    getAllCustomer().then(res => {
      if (res.code == CodeMsg.CODE_0) {
        this.setData({
          customerList: res.data
        })
      }
    })
  },
  // 分配客服信息显示
  changeCustomer(e){
    let index = Number(e.detail.value)
    let customerList = this.data.customerList
    let customerId = customerList[index].userId
    this.setData({
      customerName: customerList[index].name,
      customerId: customerId
    })
  },
  // 分配客服
  allotCustom(){
    let userIds = []
    userIds.push(this.data.userId)
    let params = {
      userIds: userIds,
      customerServerId: this.data.customerId
    }
    userAllocationBatch(params).then(res => {
      if(res.code == CodeMsg.CODE_0){
        wx.showToast({
          icon: "success",
          title: '分配成功！',
        })
        this.closeAllot()
        setTimeout(() => {
          wx.redirectTo({
            url: `/personal/pages/my-user/list/list?userType=${this.data.userType}`,
          })
        }, 500)
      }else {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setOriginalValue(options)
    this.getAllCustomer()
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
    this.checkLoginStatus()

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
    this.checkReach()
  }
})