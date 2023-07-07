// personal/pages/my-user/list/list.js
import {
  getMyUser,
  getArea,
  userAllocationBatch,
  getAllCustomer
} from "../../../../utils/api/user"
import {
  accountStatusList,
} from "../../../../utils/common/user";
import {
  filterArea
} from "../../../../utils/clue/clue"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    userList: [],
    userInfo: {},
    reachStatus: false, // 是否触底加载更多数据
    keyWord: "",
    currentPage: 1,
    pageSize: 20,
    total: 0,
    userType: 2,
    cTabIndex: 2,
    accountList: [], //账号状态下拉框
    filters: {
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
    customerServerName: "", //客服
    promoteAttributionName: "", //推广归属
    batch: "批量分配",
    isBatch: true, //批量分配按钮显隐
    isConfirm: false, //批量分配按钮显隐
    batchStatus: 0, //是否点击批量分配按钮
    customerList: [], //客服列表
    allotDialog: false, //分配客服弹窗
    customerName: "", //客服名称
    customerId: "", //客服ID
    childObj: {}, //子组件传过来的值
    userIds: [],
    checked: false
  },
  // 设置初始值
  setOriginalData() {
    this.getAreaData()
    this.getAllCustomer()
    this.setData({
      accountList: accountStatusList(),
    })
  },
  // 清除关键词
  clearKeyword() {
    this.setData({
      keyWord: "",
    })
    this.getAllUserList()
  },
  // 改变用户类型
  changeType() {
    let userType = this.data.userType
    this.setData({
      userType: userType == 2 ? 1 : userType == 1 ? 0 : userType == 0 ? 2 : 0,
      checked: false,
      userIds: []
    })
    wx.pageScrollTo({
      scrollTop: 0, //滚到顶部 
      duration: 0.5, //滚的到顶部需要的时间  动画
    })
    this.getUserList()
  },
  // 修改地区
  changeArea(e) {
    this.getAreaValue(e.detail.value)
  },
  // 修改地区-column
  changeColumnArea(e) {
    this.getAreaRange(e.detail.column, e.detail.value)
  },
  // 改变账号状态
  changeAccountStatus(e) {
    let filters = {}
    filters.area = this.data.filters.area
    filters.areaIdList = this.data.filters.areaIdList
    filters.accountStatus = e.detail
    this.setData({
      filters: filters
    })
    this.getAllUserList()
  },
  // 改变搜索内容
  changeKeyword(e) {
    this.setData({
      keyWord: e.detail.value.trim(),
    })
  },
  // 客服搜索框
  changeCustomerServerName(e) {
    this.setData({
      customerServerName: e.detail.value.trim()
    })
  },
  // 推广归属搜索框
  changePromoteAttributionName(e) {
    this.setData({
      promoteAttributionName: e.detail.value.trim()
    })
  },
  // 刷新接口
  refresh() {
    this.getAllUserList()
  },
  // 重置
  resetCon() {
    let filters = this.data.filters
    filters.accountStatus = null
    this.setData({
      keyWord: '',
      isDisabled: null,
      customerServerName: '',
      promoteAttributionName: '',
      filters: filters,
      currentPage: 1,
      pageSize: 20,
    })
    this.getAllUserList()
  },
  // 获取用户列表currentPage重置为1
  getAllUserList() {
    this.setData({
      currentPage: 1,
      reachStatus: false
    })
    this.getUserList()
  },
  // 传参设置
  filterParams() {
    let userType = this.data.userType
    let area = ''
    let params = {}
    if (this.data.filters.areaIdList.length != 0) {
      area = this.data.filters.areaIdList.join(',')
    }
    if (userType == 2) {
      params = {
        keyword: this.data.keyWord,
        diyOrgAddress: this.data.filters.areaIdList.length == 0 ? null : area,
        isDisabled: this.data.filters.accountStatus,
        pageNo: this.data.currentPage,
        pageSize: this.data.pageSize,
      }
    } else {
      params = {
        keyword: this.data.keyWord,
        isDisabled: this.data.filters.accountStatus,
        pageNo: this.data.currentPage,
        pageSize: this.data.pageSize,
        customerServerName: this.data.customerServerName,
        promoteAttributionName: this.data.promoteAttributionName
      }
    }
    return params
  },
  // 获取用户列表
  getUserList() {
    let params = this.filterParams()
    getMyUser(params, this.data.userType).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let reachStatus = this.data.reachStatus
        let userList = this.data.userList
        let result = res.data.records
        let userIds = this.data.userIds
        result.forEach(item => {
          item.area = item.diyOrgAddress != null ? filterArea(item.diyOrgAddress) : ''
          item.checked = false
          if (userIds.indexOf(item.userId) != -1) {
            item.checked = true
          }
        })
        this.setData({
          userList: reachStatus == true ? userList.concat(result) : result,
          total: res.data.total,
          reachStatus: false,
          loading: true
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  // 触底加载更多数据
  getReachList() {
    let userList = this.data.userList
    let newTotal = this.data.total
    let currentPage = this.data.currentPage
    if (userList.length < newTotal) {
      this.setData({
        reachStatus: true,
        currentPage: currentPage + 1
      })
      this.getUserList()
    }
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
  // 封装地区回显name方法
  getAreaValue(list) {
    let areaNameList = []
    let areaIdList = []
    let areaRange = this.data.areaRange
    let filters = this.data.filters
    let validateInfo = this.data.validateInfo
    areaRange.forEach((item, index) => {
      if (item.length > 0) {
        areaNameList.push(item[list[index]].name)
        areaIdList.push(item[list[index]].id)
      }
    })
    filters.area = areaNameList.join(',')
    filters.areaIdList = areaIdList
    validateInfo.areaError = areaIdList.length > 0 ? true : false
    this.setData({
      filters: filters,
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
  // 获取客服列表
  getAllCustomer() {
    getAllCustomer().then(res => {
      if (res.code == CodeMsg.CODE_0) {
        this.setData({
          customerList: res.data
        })
      }
    })
  },
  // 关闭分配弹窗
  closeAllot() {
    let userList = this.data.userList
    userList.forEach(item => {
      item.checked = false
    })
    this.setData({
      allotDialog: false,
      isBatch: true,
      isConfirm: false,
      batchStatus: 0,
      userIds: [],
      userList: userList
    });
  },
  // 分配客服信息显示
  changeCustomer(e) {
    let index = Number(e.detail.value)
    let customerList = this.data.customerList
    let customerId = customerList[index].userId
    this.setData({
      customerName: customerList[index].name,
      customerId: customerId
    })
  },
  // 批量分配客服
  batchAllocation() {
    this.setData({
      isBatch: false,
      isConfirm: true,
      batchStatus: 1
    })
  },
  // 确认分配客服
  confirmAllocation() {
    if (this.data.userIds.length == 0) {
      wx.showToast({
        title: '请至少选择一项',
        icon: 'none',
        duration: 1000
      })
      return false
    }
    this.setData({
      allotDialog: true
    })
  },
  // 分配客服
  allotCustom() {
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      userIds: this.data.userIds,
      customerServerId: this.data.customerId
    }
    userAllocationBatch(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        wx.showToast({
          icon: "success",
          title: '分配成功！',
        })
        this.closeAllot()
        setTimeout(() => {
          wx.navigateTo({
            url: `/personal/pages/my-user/list/list?userType=${this.data.userType}`,
          })
        }, 300)
        wx.hideLoading({
          success: (res) => {}
        })
      } else {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
        wx.hideLoading({
          success: (res) => {}
        })
      }
    })

  },
  toUserDetail(e) {
    let userType = this.data.userType
    let userId = e.currentTarget.dataset.item.userId
    wx.navigateTo({
      url: `/personal/pages/my-user/detail/detail?userId=${userId}&userType=${userType}`,
    })
  },
  followContent(e) {
    let userId = e.currentTarget.dataset.item.userId
    let userType = this.data.userType
    wx.navigateTo({
      url: `/personal/pages/my-user/follow/follow?userId=${userId}&userType=${userType}`,
    })
  },
  onChange(e) {
    let list = e.currentTarget.dataset.item
    let userList = this.data.userList
    let checked = e.detail
    let userIds = this.data.userIds
    userList.forEach(item => {
      if (list.userId == item.userId) {
        item.checked = checked
        list.checked = checked
      }
    })
    this.setData({
      checked: checked,
      userList: userList
    });
    if (list.checked) {
      userIds.push(list.userId)
    } else {
      let index = userIds.indexOf(list.userId)
      index != -1 ? delete userIds[index] : ''
    }
    this.setData({
      userIds: userIds
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.setOriginalData()
    this.getUserList()
    if (options.userType) {
      this.setData({
        userType: options.userType
      })
      this.getUserList()
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