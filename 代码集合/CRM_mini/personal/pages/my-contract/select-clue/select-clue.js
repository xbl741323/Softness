// personal/pages/my-contract/select-clue/select-clue.js
import {
  getMyClueList,
} from "../../../../utils/api/clue"
import * as CodeMsg from "../../../../utils/common/codeMsg";
import {
  filterArea
} from "../../../../utils/clue/clue"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    loading: true,
    isPerson: true,
    reachStatus: false, // 是否触底加载更多数据
    newTotal: 0,
    clueType: 2, // 线索类型 1-个人 2-单位
    clueList: [],
    keyWords: "",
    currentPage: 1,
    pageSize: 10
  },
  // 选择线索返回
  selectClue(e) {
    let item = e.currentTarget.dataset.item
    item.clueType = this.data.clueType
    item.clueId = this.data.clueType == 2 ? item.clueCompanyId : item.cluePersonId
    wx.setStorageSync('contractSelectClue', item)
    wx.navigateBack()
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
      clueType: clueType == 1 ? 2 : 1
    })
    this.getList()
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
  // 获取我的线索列表
  getList() {
    let params = {
      key: this.data.keyWords,
      pageNo: this.data.currentPage,
      pageSize: this.data.pageSize,
      sortField: 'createTime',
      sortType: 'desc',
      clueStatusIdList: ['0'],
      clueSalesmanEmpId: this.data.userInfo.id
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