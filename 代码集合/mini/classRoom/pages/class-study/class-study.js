// classRoom/pages/class-study/class-study.js
import {
  pageStudyCourse,
  getBrowseRecords
} from "../../../utils/api/wtClass"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cTabIndex: 0,
    tabList: ["学习记录", "最近浏览"],
    recordList: ['', '', ''],
    browseList: [],
    pageNo: 1,
    pageSize: 10
  },
  // 修改tab类型
  changeTab(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      cTabIndex: index
    })
    this.getList()
  },
  // 获取列表数据
  getList() {
    let cTabIndex = this.data.cTabIndex
    cTabIndex == 0 ? this.getRecordData() : this.getBrowseData()
  },
  // 获取学习记录
  getRecordData() {
    let params = {
      pageNo: this.data.pageNo,
      // pageSize: this.data.pageSize,
    }
    pageStudyCourse(params).then(res => {
      if (res.code == 0) {
        this.setData({
          recordList: res.data.records
        })
      }
    })
  },
  // 获取最近浏览
  getBrowseData() {
    let params = {
      pageNo: this.data.pageNo,
      // pageSize: this.data.pageSize,
    }
    getBrowseRecords(params).then(res => {
      if (res.code == 0) {
        this.setData({
          browseList: res.data.records
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
    this.getList()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})