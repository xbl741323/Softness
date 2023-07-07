// personal/pages/order/search-order.js
import {
  getOrderList
} from "../../../utils/api/order"
import {
  getProType,
} from "../../../utils/api/product"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: [
      '产品', '课程', '会员'
    ],
    cTabIndex: 0,
    clueBelongNo: "",
    salesBelonging: "",
    belongName: "",
    keyWord: "",
    orderList: [],
    currentPage: 1,
    pageSize: 10,
    total: 0,
    proTypeList: [],
    show: false,
  },

  //切换tab
  changeTab(e) {
    this.setData({
      cTabIndex: e.detail.index,
      keyWord: "",
      clueBelongNo: "",
      salesBelonging: "",
      belongName: "",
      orderList: [],
      currentPage: 1,
      total: 0,
      show: false,
    })
  },

  //重置条件
  reset() {
    this.setData({
      clueBelongNo: "",
      salesBelonging: "",
      belongName: "",
      show: this.data.keyWord == "" ? false : true
    })
  },

  //提交筛选
  confirm() {
    if (this.data.cTabIndex == 0) {
      if (this.data.clueBelongNo == "" && this.data.salesBelonging == "" && this.data.belongName == "" && this.data.keyWord == "") {
        return this.toggleClose()
      }
    } else {
      if (this.data.belongName == "" && this.data.keyWord == "") {
        return this.toggleClose()
      }
    }
    this.setData({
      currentPage: 1,
      total: 0,
    })
    this.getOrderList()
    this.toggleClose()
  },

  //关闭下拉菜单
  toggleClose() {
    var that = this;
    that.selectComponent('#screen').toggle(false);
  },

  //筛选输入
  fieldChange(e) {
    let clueBelongNo = this.data.clueBelongNo
    let belongName = this.data.belongName
    let salesBelonging = this.data.salesBelonging
    switch (e.target.dataset.id) {
      case "clueBelongNo":
        clueBelongNo = e.detail
        break;

      case "belongName":
        belongName = e.detail
        break;

      case "salesBelonging":
        salesBelonging = e.detail
        break;
    
      default:
        break;
    }
    this.setData({
      clueBelongNo: clueBelongNo,
      belongName: belongName,
      salesBelonging: salesBelonging,
    })
  },

  //清空搜索框
  clearKerword() {
    this.setData({
      keyWord: "",
      orderList: [],
      show: false,
      currentPage: 1,
      total: 0,
    })
  },

  changeKeywords(e) {
    this.setData({
      keyWord: e.detail.value
    })
  },

  //查询订单
  getAllOrderList() {
    if (this.data.cTabIndex == 0) {
      if (this.data.clueBelongNo == "" && this.data.salesBelonging == "" && this.data.belongName == "" && this.data.keyWord == "") {
        return
      }
    } else {
      if (this.data.belongName == "" && this.data.keyWord == "") {
        return
      }
    }
    this.getOrderList()
  },
  
  //获取订单列表
  getOrderList() {
    if(this.data.cTabIndex == 1) {
      this.getProTypeList()
    }
    let params = {
      pageNo: this.data.currentPage,
      pageSize: this.data.pageSize,
      keyWord: this.data.keyWord,
    }
    if (this.data.cTabIndex == 0) {
      params.clueAttributionEmpInfo = this.data.clueBelongNo
      params.clueSalesmanEmpInfo = this.data.salesBelonging
      params.belongInfo = this.data.belongName
    } else {
      params.belongName = this.data.belongName
    }
    getOrderList(params, this.data.cTabIndex).then(res => {
      if (res.code == 0) {
        let list = this.data.orderList
        if (this.data.currentPage == 1) {
          list = res.data.records
        } else {
          res.data.records.forEach(item => {
            list.push(item)
          })
        }
        this.setData({
          orderList: list,
          total: res.data.total,
          show: true,
        })
      }
    })
  },

  //获取专业类型列表
  getProTypeList() {
    getProType({parentId:0}).then(res => {
      if (res.code == 0) {
        this.setData({
          proTypeList: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    if (this.data.total > this.data.currentPage * 10) {
      this.setData({
        currentPage: this.data.currentPage + 1
      })
      this.getOrderList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})