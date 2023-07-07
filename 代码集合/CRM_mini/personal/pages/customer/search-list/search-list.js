// personal/pages/customer/search-list/search-list.js
import {
  getClueList,
  getArea
} from "../../../../utils/api/clue"
import {
  getProductListByClue
} from "../../../../utils/api/order"
import * as CodeMsg from "../../../../utils/common/codeMsg";
import {
  filterArea
} from "../../../../utils/clue/clue"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showStatus: false,
    loading: false,
    isPerson: false,
    reachStatus: false, // 是否触底加载更多数据
    newTotal: 0,
    clueType: 2, // 线索类型 1-个人 2-单位
    clueList: [],
    keyWords: "",
    currentPage: 1,
    areaList: [],
    value: [0,0,0],
    pIndex: 0,
    cIndex: 0,
    aIndex: 0,
    areaPath: '',
    areaName: '',
    show: false,
    orderShow: false,
    orderDetail: [],
    orderList: [],
    orderCurrentPage: 1,
    total: 0,
    clueId: "",
    pageSize: 20
  },
  // 清除关键词
  clearKerword() {
    this.setData({
      keyWords: "",
      clueList: []
    })
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
  // 改变线索类型
  changeType() {
    let clueType = this.data.clueType
    this.setData({
      clueType: clueType == 1 ? 2 : 1
    })
    this.getList()
  },
  searchList() {
    let keyWords = this.data.keyWords
    this.setData({
      currentPage: 1,
      reachStatus: false
    })
    if (keyWords != '' || this.areaPath != '') {
      this.getList()
    }

  },
  // 获取线索列表
  getList() {
    let params = {
      key: this.data.keyWords,
      orgAddress: this.data.areaPath,
      sortField: "createTime",
      sortType: "desc",
      pageNo: this.data.currentPage,
      pageSize: this.data.pageSize,
    }
    getClueList(params, this.data.clueType).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let reachStatus = this.data.reachStatus
        let clueList = this.data.clueList
        let result = res.data.records
        result.forEach(item => {
          item.area = filterArea(item.orgAddress)
        })
        this.setData({
          clueList: reachStatus == true ? clueList.concat(result) : result,
          newTotal: res.data.total,
          reachStatus: false,
          loading: true,
          showStatus: true
        })
      }
    })
  },
  //获取地区列表
  getAeaList() {
    getArea().then(res => {
      if (res.code == 0) {
        let list = res.data
        list.forEach(item => {
          item.children.unshift({
            areaName: '全部',
            id: 0,
            nodeNumber: 0,
            children:[
              {
                areaName: '全部',
                id: 0,
                children: null,
                parentId: 0,
              }
            ]
          })
        })
        this.setData({
          areaList: list
        })
      }
    })
  },
  showPopup() {
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  bindChange(e) {
    const val = e.detail.value
    let pThis = val[0]
    let cThis = val[1]
    if (pThis != this.data.pIndex) {
      this.setData({
        value: [val[0],0,0],
        pIndex: val[0],
        cIndex: 0,
        aIndex: 0,
      })
    } else {
      if (cThis != this.data.cIndex) {
        this.setData({
          value: [val[0],val[1],0],
          pIndex: val[0],
          cIndex: val[1],
          aIndex: 0,
        })
      } else {
        this.setData({
          value: val,
          pIndex: val[0],
          cIndex: val[1],
          aIndex: val[2],
        })
      }
    }
  },
  submit() {
    let data = this.data.areaList
    let pIndex = this.data.pIndex
    let cIndex = this.data.cIndex
    let aIndex = this.data.aIndex
    let areaPath = []
    let areaName = []
    areaPath.push(data[pIndex].id)
    areaName.push(data[pIndex].areaName)
    areaPath.push(data[pIndex].children[cIndex].id)
    if (data[pIndex].children[cIndex].id != 0) {
      areaName.push(data[pIndex].children[cIndex].areaName)
    }
    areaPath.push(data[pIndex].children[cIndex].children[aIndex].id)
    if (data[pIndex].children[cIndex].children[aIndex].id != 0) {
      areaName.push(data[pIndex].children[cIndex].children[aIndex].areaName)
    }
    this.setData({
      areaPath: areaPath.join(','),
      areaName: areaName.join(' '),
      show: false,
    })
  },
  chongzhi() {
    this.setData({
      areaPath: "",
      areaName: "",
      show: false,
    })
  },
  cancel() {
    this.setData({
      show: false,
      value: [0, 0, 0],
      pIndex: 0,
      cIndex: 0,
      aIndex: 0
    })
  },
  onCloseOrder() {
    this.setData({
      orderShow: false,
      orderCurrentPage: 1,
    })
  },
  getOrderDetail(e) {
    let params = {
      pageNo: 1,
      pageSize: 10,
      clueId: e.detail,
    }
    this.setData({
      clueId: e.detail,
      orderDetail: [],
    })
    this.getOrderList(params)
  },
  getOrderList(params) {
    getProductListByClue(params).then(res => {
      if (res.code == 0) {
        let list = []
        if (this.data.orderCurrentPage == 1) {
          list = res.data.records
        } else {
          list = this.data.orderDetail
          res.data.records.forEach(item => {
            list.push(item)
          })
        }
        this.setData({
          orderShow: true,
          orderDetail: list,
          total: res.data.total,
          orderCurrentPage: this.data.orderCurrentPage + 1
        })
      }
    })
  },
  //订单列表下拉加载
  scrollOrderList() {
    let params = {
      pageNo: this.data.orderCurrentPage,
      pageSize: 10,
      clueId: this.data.clueId,
    }
    if (this.data.total < (this.data.orderCurrentPage - 1) * 10) {
      return
    }
    this.getOrderList(params)
  },
  touchMove() {
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
    this.getAeaList()
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