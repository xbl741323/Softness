// personal/pages/my-seas/seas-region/seas-region.js
import {
  getseasList,
} from '../../../../utils/api/seas'
import {
  filterIndustry,
  filterArea,
  filterDept,
  filterUnitType
} from "../../../../utils/clue/clue"
import {
  repeatDeptList
} from "../../../../utils/api/category"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    highSeasType: 1, // 1地区 2集团
    isPerson: true,
    loading: true,
    contractType: 2,
    currentPage: 1,
    seasList: [],
    pageSize: 10,
    reachStatus: false,
    keyWords: "",
    pageSize: 10,
    DeptListData: [] //查重部门列表
  },
  changeType() {
    let contractType = this.data.contractType
    this.setData({
      contractType: contractType == 1 ? 2 : 1
    })
    this.getSeasData()
  },
  searchList() {
    this.setData({
      currentPage: 1,
      reachStatus: false
    })


    this.getSeasData()
  },

  // 清除关键词
  clearKerword() {
    this.setData({
      keyWords: "",
      currentPage: 1,
      reachStatus: false
    })
    this.getSeasData()
  },
  // 改变搜索内容
  changeKeywords(e) {
    this.setData({
      keyWords: e.detail.value.trim(),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // 获取公海部门列表
  getrepeatDeptList() {

    repeatDeptList().then(res => {
      this.setData({
        DeptListData: res.data
      })
    })
  },
  onLoad(options) {
    this.getrepeatDeptList()
    this.setData({
      highSeasType: options.highSeasType
    })
    wx.setNavigationBarTitle({
        title: this.data.highSeasType == 2 ? '集团公海' : '地区公海'
      }),
      this.getSeasData()
  },
  getSeasData(data) {
    let highSeasType = this.data.highSeasType
    let contractType = this.data.contractType
    let params = {
      key: this.data.keyWords,
      pageNo: this.data.currentPage,
      pageSize: this.data.pageSize,
    }
    getseasList(params, contractType, highSeasType).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let reachStatus = this.data.reachStatus
        let seasList = this.data.seasList
        let result = res.data.records
        result.forEach((item, index) => {
          item.industry = filterIndustry(item.industry)
          item.orgAddress = filterArea(item.orgAddress)
          item.clueAttributionEmpDeptVal = filterDept(item.clueAttributionEmpDeptId, this.data.DeptListData)
          item.orgType = filterUnitType(item.orgType)
        })
        this.setData({
          seasList: reachStatus == true ? seasList.concat(result) : result,
          reachStatus: false,
          newTotal: res.data.total,
          loading: true
        })
        wx.stopPullDownRefresh()
      }
    })

  },
  refresh() {
    this.getSeasData()
  },
  // 触底加载更多数据
  getReachList() {
    let clueList = this.data.seasList
    let newTotal = this.data.newTotal
    let currentPage = this.data.currentPage
    if (clueList.length < newTotal) {
      this.setData({
        reachStatus: true,
        currentPage: currentPage + 1
      })
      this.getSeasData()
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
    this.getSeasData()
    console.log('onshow')
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
      currentPage: 1
    })
    this.getSeasData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this.setData({
      currentPage: 1
    })
    this.getReachList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})