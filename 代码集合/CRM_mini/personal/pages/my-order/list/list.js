// personal/pages/my-order-list/list/list.js
import {
  getMyOrder,
  updateOrderStatus
} from "../../../../utils/api/order"
import {
  getOrderStatus,
  getWaitOrderStatus,
  getTailStatus,
  getMemberOrderStatus,
  getCourseOrderStatus,
} from "../../../../utils/order/order"
import {
  getProType
} from "../../../../utils/api/product"
import {
  getPartnerList
} from "../../../../utils/api/clue";
import {
  filterPer
} from "../../../../utils/order/order"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    childOrderInfo: {}, // 选择的订单对象
    loading: false,
    orderList: [],
    userInfo: {},
    reachStatus: false, // 是否触底加载更多数据
    keyWord: "",
    currentPage: 1,
    pageSize: 20,
    total: 0,
    filterValue: '产品',
    tabList: [{
      text: '产品',
      type: 1,
      Privilege: {
        bt_check_product_list_my: true
      }
    }, {
      text: '课程',
      type: 2,
      Privilege: {
        bt_check_list_courses_my: true
      }
    }, {
      text: '会员',
      type: 3,
      Privilege: {
        bt_check_list_courses_vip_my: true
      }
    }, {
      type: 4,
      text: '待生效',
      Privilege: {
        bt_check_list_init_my: true
      }
    }, ],
    cTabIndex: 0,
    orderTypeList: [], // 订单类型下拉框
    orderStatusList: [], // 订单状态下拉框
    waitOrderStatus: [], // 待生效订单状态下拉框
    tailStatusList: [], // 订单尾款状态下拉框
    memberOrderStatus: [], // 会员订单状态下拉框
    courseOrderStatus: [], // 课程订单状态下拉框
    filters: {
      orderType: null,
      orderStatus: null,
      orderTailStatus: null,
    },
    cluefromShow: false,
    customerOwnerList: [{
      partnerId: "",
      partnerName: "全部",
    }],
    partnerId: null,
    partnerIndex: 0,
    partnerIndex1: 0,
    addPermissions: false,
    orderIndex: 0,
    tailIndex: 0,
  },
  // 生成订单
  generateNewOrder(params) {
    let that = this
    that.generateFinalNewOrder(params)
  },
  generateFinalNewOrder(params) {
    updateOrderStatus(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        wx.showToast({
          icon: "success",
          title: '操作成功！',
        })
        this.selectComponent('#audit-tip').closeTip()
        this.selectComponent('#audit-tip').resetVal()
        this.refresh()
      }
    })
  },
  // 子组件回调显示弹窗
  showAudit(val) {
    this.setData({
      childOrderInfo: val.detail
    })
    this.showAuditTip()
  },
  // 提交审核回调
  submitAudit(val) {
    let auditManInfo = val.detail.auditManInfo
    let auditRemark = val.detail.auditRemark
    let childOrderInfo = this.data.childOrderInfo
    let params = {
      id: childOrderInfo.id, // 订单id
      handleBy: auditManInfo.userId, // 审核人userId
      handleByNo: auditManInfo.number, // 审核人number
      handleByName: auditManInfo.name, // 审核人name
      changePriceRemark: auditRemark, // 审核备注
      orderStatus: childOrderInfo.orderStatus
    }
    this.generateNewOrder(params)
  },
  // 显示弹窗
  showAuditTip() {
    this.selectComponent('#audit-tip').showTip()
  },
  // 清除关键词
  clearKerword() {
    this.setData({
      keyWord: "",
    })
    this.getAllOrderList()
  },
  // 获取产品类型tab数据
  getProTab() {
    let params = {
      parentId: 0,
    };
    getProType(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let result = res.data
        result.forEach(item => {
          item.text = item.categoryName
          item.value = item.id
        })
        result.unshift({
          value: null,
          text: '全部类型'
        })
        this.setData({
          orderTypeList: result
        })
      }
    })
  },
  // 改变订单类型
  changeOrderType(e) {
    this.setFilters(e, 0)
  },
  // 改变订单状态
  changeOrderStatus(e) {
    this.setFilters(e, 1)
  },
  // 改变尾款状态
  changeTailStatus(e) {
    this.setFilters(e, 2)
  },
  // 筛选项赋值并刷新接口
  setFilters(e, type) {
    let filters = this.data.filters
    type == 0 ? filters.orderType = e.detail : type == 1 ? filters.orderStatus = e.detail : filters.orderTailStatus = e.detail
    this.setData({
      filters: filters,
      reachStatus: false
    })
    if (this.data.cTabIndex == 0 && (type == 1 || type == 2)) {
      return
    }
    this.getAllOrderList()
  },
  // 改变搜索内容
  changeKeywords(e) {
    this.setData({
      keyWord: e.detail.value.trim(),
    })
  },
  // tab切换
  changeTab(e) {
    console.log(e);
    let filters = this.data.filters
    filters.orderType = null
    filters.orderStatus = null
    filters.orderTailStatus = null
    this.setData({
      filterValue: e.detail.title,
      cTabIndex: e.detail.index,
      filters: filters,
      keyWord: ""
    })
    this.getAllOrderList()
  },
  // 刷新接口
  refresh() {
    this.getAllOrderList()
  },
  // 获取订单列表currentPage重置为1
  getAllOrderList() {
    this.setData({
      currentPage: 1,
      reachStatus: false
    })
    this.getOrderList()
  },
  // 传参设置
  filterParams() {
    let cTabIndex = this.data.cTabIndex
    let params = {}
    // if (cTabIndex == 0 || cTabIndex == 3) {
    if (this.filterTab(this.data.tabList[0].title || this.data.filterValue) == 0 || this.filterTab(this.data.tabList[0].title || this.data.filterValue) == 3) {
      params = {
        categoryIds: this.data.filters.orderType == 2 ? [3, 4, 5, 6] : null,
        keyWord: this.data.keyWord,
        pageNo: this.data.currentPage,
        pageSize: this.data.pageSize,
        categoryId: this.data.filters.orderType == 2 ? null : this.data.filters.orderType,
        partnerId: this.data.partnerId,
        orderStatus: this.data.filters.orderStatus,
        tailStatus: cTabIndex == 0 ? this.data.filters.orderTailStatus : null,
      }
      // } else if (cTabIndex == 1) {
    } else if (this.filterTab(this.data.tabList[0].title || this.data.filterValue) == 1) {
      params = {
        belongId: this.data.userInfo.id,
        keyWord: this.data.keyWord,
        pageNo: this.data.currentPage,
        pageSize: this.data.pageSize,
        orderStatusList: this.data.filters.orderStatus == 0 ? ['0', '1'] : null,
        deleted: this.data.filters.orderStatus == 1 ? 1 : null,
        orderStatus: this.data.filters.orderStatus == 2 || this.data.filters.orderStatus == 4 ? this.data.filters.orderStatus : null,
      }
      if (this.data.filters.orderType != null) {
        params.subjectId = this.data.filters.orderType
      }
    } else {
      params = {
        belongId: this.data.userInfo.id,
        keyWord: this.data.keyWord,
        pageNo: this.data.currentPage,
        pageSize: this.data.pageSize,
        orderStatus: this.data.filters.orderStatus == 0 ? 0 : null,
        timeStatus: this.data.filters.orderStatus == 0 ? null : this.data.filters.orderStatus
      }
    }
    return params
  },
  filterTab(val, num) {
    let list = ['产品', '课程', '会员', '待生效']
    if (num == 1) {
      this.setData({
        filterValue: this.data.tabList[0].text
      })
    } else {
      for (let i = 0; i < list.length; i++) {
        if (list[i] == val) {
          return i
        }
      }
    }
  },
  // 获取订单列表
  getOrderList() {
    // let cTabIndex = this.data.cTabIndex
    let params = this.filterParams()
    getMyOrder(params, this.filterTab(this.data.tabList[0].title || this.data.filterValue)).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let reachStatus = this.data.reachStatus
        let orderList = this.data.orderList
        let result = res.data.records
        this.setData({
          orderList: reachStatus == true ? orderList.concat(result) : result,
          total: res.data.total,
          reachStatus: false,
          loading: true
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  parentComponentFunction: function () {
    this.getOrderList()
  },

  onCloseMenu() {
    this.closeFilter()
  },

  closeFilter() {
    this.selectComponent('#filter').toggle();
  },

  // 线索归属方
  showCluefrom() {
    this.setData({
      cluefromShow: true,
    })
  },

  // 获取线索归属方列表
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

  changeOrder(e) {
    let obj = {}
    obj.detail = e.currentTarget.dataset.item[0].value
    let index = e.currentTarget.dataset.item[1]
    if (index == null) {
      index = 1
    }
    this.changeOrderStatus(obj)
    this.setData({
      orderIndex: index
    })
  },

  changeTail(e) {
    let obj = {}
    obj.detail = e.currentTarget.dataset.item[0].value
    let index = e.currentTarget.dataset.item[1]
    if (index == null) {
      index = 1
    }
    this.changeTailStatus(obj)
    this.setData({
      tailIndex: index
    })
  },

  resetBtn() {
    let filters = {
      orderType: null,
      orderStatus: null,
      orderTailStatus: null,
    }
    this.setData({
      filters: filters,
      orderIndex: 0,
      tailIndex: 0,
      partnerIndex: 0,
      partnerIndex1: 0,
      partnerId: null,
    })
    this.getAllOrderList()
    this.closeFilter()
  },

  okBtn() {
    this.getAllOrderList()
    this.closeFilter()
  },

  // 触底加载更多数据
  getReachList() {
    let clueList = this.data.orderList
    let newTotal = this.data.total
    let currentPage = this.data.currentPage
    if (clueList.length < newTotal) {
      this.setData({
        reachStatus: true,
        currentPage: currentPage + 1
      })
      this.getOrderList()
    }
  },
  // 设置初始值
  setOriginalData() {
    this.setData({
      orderStatusList: getOrderStatus(),
      waitOrderStatus: getWaitOrderStatus(),
      tailStatusList: getTailStatus(),
      memberOrderStatus: getMemberOrderStatus(),
      courseOrderStatus: getCourseOrderStatus(),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    if (options.type) {
      this.setData({
        cTabIndex: Number(options.type)
      })
    }
    this.getProTab()
    this.setOriginalData()
    this.getCustomerOwnerList()
    this.setData({
      tabList: filterPer(this.data.tabList)
    })
    this.filterTab(this.data.filterValue, 1)
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
    this.getOrderList()
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