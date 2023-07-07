// personal/pages/my-contract/list/index.js
import * as CodeMsg from "../../../../utils/common/codeMsg";
import {
  filterArea
} from "../../../../utils/clue/clue"
import {
  category
} from "../../../../utils/order/order";
import {
  contractStatus,
  elecContractStatus,
  contractStatusList,
  getOrderType
} from "../../../../utils/common/contract";
import {
  pagePaperContractOfMy
} from "../../../../utils/api/contract"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    reachStatus: false, // 是否触底加载更多数据
    newTotal: 0,
    keyWords: "",
    currentPage: 1,
    pageSize: 10,
    contractType: 2, //1-电子 2-纸质
    contractList: [],
    contractStatusList: [],
    elecContractStatus: [],
    orderStatusList: [],
    categoryId: null,
    contractStatus: null,
    filters: {
      taskStatus: null,
      categoryId: null
    },
  },
  // 跳转到录入合同页面
  enterContract() {
    wx.navigateTo({
      url: `/personal/pages/my-contract/enter-contract/enter-contract`,
    })
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
  setOriginalData() {
    this.setData({
      orderStatusList: getOrderType(),
      contractStatusList: contractStatusList(),
      elecContractStatus: elecContractStatus()
    })
  },
  // 显示员工选择框
  showEmpSheet(e) {
    this.setData({
      allotInfo: e.detail
    })
    this.selectComponent('#query-emp').show()
  },
  // 选择员工
  selectEmp(e) {
    console.log(e)
    let empInfo = e.detail
    this.allot(empInfo)
  },

  // 改变搜索内容
  changeKeywords(e) {
    this.setData({
      keyWords: e.detail.value.trim(),
    })
  },
  // 改变线索类型
  changeType() {
    let contractType = this.data.contractType
    this.setData({
      contractType: contractType == 1 ? 2 : 1
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

  changeContract(e) {
    this.setData({
      contractStatus: e.detail
    })
    this.getList();
  },

  changeOrder(e) {
    this.setData({
      categoryId: e.detail
    })
    this.getList();
  },
  // 获取我的合同列表
  getList() {
    let params = {
      taskStatus: this.data.contractStatus,
      categoryId: this.data.categoryId,
      keywords: this.data.keyWords,
      pageNo: this.data.currentPage,
      pageSize: this.data.pageSize,
    }
    pagePaperContractOfMy(params, this.data.contractType).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        try {
          res.data.records.forEach(el => {
            el.contractStatus = contractStatus(el.taskStatus)
            el.categoryId = category(el.categoryId)
            el.area = filterArea(el.orgAddress);
          });
        } catch (error) {

        }
        let contractList = this.data.contractList;
        let reachStatus = this.data.reachStatus;
        this.setData({
          contractList: reachStatus == true ? contractList.concat(res.data.records) : res.data.records,
          newTotal: res.data.total
        })
        wx.stopPullDownRefresh();
      }
    })
  },
  // 触底加载更多数据
  getReachList() {
    let contractList = this.data.contractList
    let newTotal = this.data.newTotal
    let currentPage = this.data.currentPage
    if (contractList.length < newTotal) {
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
      this.getList();
      this.setOriginalData()
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