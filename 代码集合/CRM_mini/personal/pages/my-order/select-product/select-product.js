// personal/pages/my-order/select-product/select-product.js
import {
  getProType,
  getProList,
  getTradeInfo
} from "../../../../utils/api/product"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageFrom: 0, // 跳转源页面 0-发起订单页 1-线索跟进页
    reachStatus: false, // 是否触底加载更多数据
    temTradeInfo: null,
    currentPage: 1,
    pageSize: 20,
    total: 0,
    keyWord: "",
    selectedList: [],
    selectedIdList: [],
    productList: [],
    cTabIndex: 0,
    tabList: []
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
  // 改变产品类型
  changeTab(e) {
    this.setData({
      cTabIndex: e.detail.index,
    })
    this.getAllProList()
  },
  // 选择产品
  changeSelect(e) {
    let selectList = e.detail.value
    let productList = this.data.productList
    let cList = this.data.selectedList
    let cIdList = this.data.selectedIdList
    productList.forEach(item => {
      selectList.forEach(cItem => {
        if (item.id == cItem && cIdList.indexOf(cItem) == -1) {
          item.disabled = true
          item.checked = true
          this.getProTradeInfo(item.id).then(res => {
            item.tradeInfo = res.code == CodeMsg.CODE_0 ? res.data : null
          })
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
  // 获取产品类型tab数据
  getProTab() {
    let params = {
      parentId: 0,
    };
    getProType(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let result = res.data
        result.unshift({
          id: 0,
          categoryName: '全部'
        })
        this.setData({
          tabList: result
        })
        this.getProductList()
      }
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
    let cTabIndex = this.data.cTabIndex
    let tabList = this.data.tabList
    let params = {
      categoryId: tabList[cTabIndex].id,
      pageNo: this.data.currentPage,
      pageSize: this.data.pageSize,
      keywords: this.data.keyWord,
    }
    // if (this.data.pageFrom == 0) {
    //   params.isOnline = 1
    // }
    getProList(params).then(res => {
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
    let pageFrom = this.data.pageFrom
    let selectedList = this.data.selectedList
    if (selectedList.length == 0 || selectedList.length > (pageFrom == 1 ? 3 : 20)) {
      if (pageFrom == 0) {
        wx.showToast({
          icon: "none",
          title: selectedList.length > 20 ? '订单最多可选20条！' : selectedList.length == 0 ? '请至少选择一条订单' : '',
        })
      } else {
        wx.showToast({
          icon: "none",
          title: selectedList.length > 3 ? '跟进产品最多可选3条！' : selectedList.length == 0 ? '请至少选择一条跟进产品' : '',
        })
      }
    } else {
      wx.setStorageSync('selectedPro', selectedList)
      wx.setStorageSync('addNewPro', true)
      wx.navigateBack()
    }
  },
  // 获取产品交易信息
  getProTradeInfo(id) {
    let params = {
      spuId: id
    }
    return getTradeInfo(params);
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
    if (wx.getStorageSync('selectedPro')) {
      let selectedList = wx.getStorageSync('selectedPro')
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
  // 设置pageFrom值
  setPageFrom(options) {
    if (options.pageFrom) {
      this.setData({
        pageFrom: options.pageFrom
      })
    }
    wx.setNavigationBarTitle({
      title: this.data.pageFrom == 1 ? '选择产品' : '添加订单',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setDefaultProduct()
    this.getProTab()
    this.setPageFrom(options)
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