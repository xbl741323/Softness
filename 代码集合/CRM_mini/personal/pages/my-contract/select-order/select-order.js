// personal/pages/my-contract/select-order/select-order.js
import {
  getSelectOrder
} from "../../../../utils/api/contract"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clueType: 2,
    clueId: '',
    reachStatus: false, // 是否触底加载更多数据
    temTradeInfo: null,
    currentPage: 1,
    pageSize: 20,
    total: 0,
    keyWord: "",
    selectedList: [],
    selectedIdList: [],
    productList: [],
  },
  // 清除关键词
  clearKerword() {
    this.setData({
      keyWord: ""
    })
    this.getAllProList()
  },
  // 改变搜索关键词
  changeKeywords(e) {
    this.setData({
      keyWord: e.detail.value.trim(),
    })
  },
  // 选择产品
  changeSelect(e) {
    console.log(e, "输出e")
    let selectList = e.detail.value
    let productList = this.data.productList
    let cList = this.data.selectedList
    let cIdList = this.data.selectedIdList
    productList.forEach(item => {
      selectList.forEach(cItem => {
        if (item.id == cItem && cIdList.indexOf(cItem) == -1) {
          item.disabled = true
          item.checked = true
          cList.push(item)
          cIdList.push(cItem)
        }
      })
    })
    this.setData({
      selectedList: cList,
      selectedIdList: cIdList,
      productList: productList
    })
    console.log(this.data.selectedList, "selectedList")
  },
  // 选择产品-单个
  changeOneSelect(e) {
    let id = e.currentTarget.dataset.id
    let cIdList = this.data.selectedIdList
    if (cIdList.indexOf(String(id)) != -1) {
      this.commonDelPro(id)
    }
  },
  // 删除已选产品
  delProduct(e) {
    let id = e.currentTarget.dataset.item.id
    this.commonDelPro(id)
  },
  // 公共删除已选产品
  commonDelPro(id) {
    let selectedList = this.data.selectedList
    let selectedIdList = this.data.selectedIdList
    let productList = this.data.productList
    selectedList.forEach((item, index) => {
      if (item.id == id) {
        selectedList.splice(index, 1)
      }
    })
    selectedIdList.forEach((item, index) => {
      if (item == id) {
        selectedIdList.splice(index, 1)
      }
    })
    productList.forEach((item) => {
      if (item.id == id) {
        item.checked = false
        item.disabled = false
      }
    })
    this.setData({
      selectedList: selectedList,
      selectedIdList: selectedIdList,
      productList: productList
    })
  },
  // 获取产品列表-currentPage重置为1
  getAllProList() {
    this.setData({
      currentPage: 1,
      reachStatus: false
    })
    this.getProductList()
  },
  // 获取产品列表
  getProductList() {
    let params = {
      pageNo: this.data.currentPage,
      pageSize: this.data.pageSize,
      keyWord: this.data.keyWord,
      contractType: 2, // 合同类型（1：电子；2：纸质）
      clueType: this.data.clueType,
      clueId: Number(this.data.clueId)
    }
    getSelectOrder(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let reachStatus = this.data.reachStatus
        let productList = this.data.productList
        let result = res.data.records
        this.setData({
          productList: reachStatus == true ? productList.concat(result) : result,
          reachStatus: false,
          total: res.data.total,
        })
        this.resetProChecked()
      }
    })
  },
  // 获取产品列表时重现勾选项
  resetProChecked() {
    let selectedList = this.data.selectedList
    let productList = this.data.productList
    productList.forEach(item => {
      item.checked = false
      selectedList.forEach(cItem => {
        if (item.id == cItem.id) {
          item.checked = true
          item.disabled = true
        }
      })
    })
    this.setData({
      productList: productList
    })
  },
  // 确认添加
  confirmAdd() {
    let selectedList = this.data.selectedList
    if (selectedList.length == 0 || selectedList.length > 20) {
      wx.showToast({
        icon: "none",
        title: selectedList.length > 20 ? '订单最多可选20条！' : selectedList.length == 0 ? '请至少选择一条订单' : '',
      })
    } else {
      wx.setStorageSync('contractSelectOrder', selectedList)
      wx.navigateBack()
    }
  },
  // 触底加载更多数据
  getReachList() {
    let clueList = this.data.productList
    let newTotal = this.data.total
    let currentPage = this.data.currentPage
    if (clueList.length < newTotal) {
      this.setData({
        reachStatus: true,
        currentPage: currentPage + 1
      })
      this.getProductList()
    }
  },
  // 设置默认产品
  setDefaultProduct() {
    if (wx.getStorageSync('contractSelectOrder')) {
      let selectedList = wx.getStorageSync('contractSelectOrder')
      let selectedIdList = []
      selectedList.forEach(item => {
        selectedIdList.push(String(item.id))
      })
      this.setData({
        selectedList: selectedList,
        selectedIdList: selectedIdList
      })
    }
  },
  // 线索信息赋值
  setClueInfo(options) {
    if (options.clueType) {
      this.setData({
        clueType: options.clueType,
        clueId: options.clueId
      })
    }
    this.setDefaultProduct()
    this.getProductList()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setClueInfo(options)
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
    this.getReachList()
  },

  /**
   * 用户点击右上角分享
   */

})