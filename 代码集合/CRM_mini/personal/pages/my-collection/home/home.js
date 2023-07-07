// personal/pages/customer/search-list/search-list.js
import {
  getMyReceive,
} from "../../../../utils/api/collection"
import * as CodeMsg from "../../../../utils/common/codeMsg";
// import {
//   filterArea
// } from "../../../../utils/clue/clue"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    filters: {
      startReceiveTime: '', // 开始时间
      endReceiveTime: '', // 结束时间
      keyWords: '' //关键字
    },
    showStatus: false,
    loading: false,
    isPerson: false,
    reachStatus: false, // 是否触底加载更多数据
    newTotal: 0,
    clueType: 2, // 线索类型 1 线下回款 2 线上回款
    clueList: [],
    keyWords: "",
    currentPage: 1,
    pageSize: 20,
    startReceiveTime: null, // 回款开始时间
    endReceiveTime: null, // 回款结束时间
    amountType: null // 费用类型
  },
  // 清除关键词
  clearKerword() {
    this.setData({
      keyWords: "",
      clueList: []
    })
    this.getList()
  },
  // 改变搜索内容
  changeKeywords(e) {
    let clueList = this.data.clueList
    this.setData({
      keyWords: e.detail.value.trim(),
      clueList: e.detail.value.trim() == '' ? [] : clueList,
      showStatus: false
    })
  },
  removeData() {

  },
  // 改变线索类型
  changeType() {
    let clueType = this.data.clueType

    this.setData({
      clueType: clueType == 1 ? 2 : 1,
    })
    this.selectComponent('#filter').removedata()
  },
  searchList() {
    let keyWords = this.data.keyWords
    this.setData({
      currentPage: 1,
      reachStatus: false
    })
    if (keyWords != '') {
      this.getList()
    }

  },
  returnParams() {
    let filters = this.data.filters
    for (let item in filters) {
      if (typeof (filters[item]) === 'undefined' || filters[item] === null || filters[item] === '') {
        delete filters[item]
      }
    }
    let params = {
      // loginNo: this.data.userInfo.id,
      keyWords: this.data.keyWords,
      startReceiveTime: "",
      endReceiveTime: "",
      pageNo: this.data.currentPage,
      pageSize: this.data.pageSize,
    }
    return {
      ...params,
      ...filters
    }
  },
  // 获取线索列表
  getList() {
    getMyReceive(this.returnParams()).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let reachStatus = this.data.reachStatus
        let clueList = this.data.clueList
        let result = res.data.records
        this.setData({
          clueList: reachStatus == true ? clueList.concat(result) : result,
          newTotal: res.data.total,
          reachStatus: false,
          loading: true,
          showStatus: true
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  // 触底加载更多数据
  getReachList() {
    console.log(111);
    let clueList = this.data.clueList
    let newTotal = this.data.newTotal
    let currentPage = this.data.currentPage
    console.log(clueList.length)
    console.log(newTotal)
    if (clueList.length < newTotal) {
      this.setData({
        reachStatus: true,
        currentPage: currentPage + 1
      })
      this.getList()
    }
  },
  getfiltratedata(e) {
    if (e.detail.keyWords == 1) {
      e.detail.keyWords = '上海恩凡知识产权代理有限公司'
    } else if (e.detail.keyWords == 2) {
      e.detail.keyWords = '卧涛科技有限公司'
    } else {
      e.detail.keyWords = ''
    }
    this.setData({
      filters: e.detail
    })
    this.getList()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
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
    this.setData({
      pageNo: 1
    })
    this.getList()
    wx.stopPullDownRefresh()
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