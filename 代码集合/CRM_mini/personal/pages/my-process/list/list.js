// personal/pages/my-process/list/list.js
import {
  pageMyOrderTaskInfo,
  contractAuditListOfMy,
  getChangeMyList,
  getContractList,
  getTaskOpenList
} from "../../../../utils/api/process"
import {
  orderTypeData,
  typeData,
  changetypeData,
  changePriceData,
  changePrimary
} from "../../../../utils/common/transfer"
import {
  contractStatus,
  getOrderType
} from "../../../../utils/common/contract";
import {
  getEmpOption,
  getEmpList
} from "../../../../utils/api/category"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    processTypeOptions: [{
        text: '合同审批',
        value: 0
      },
      {
        text: '对公转账',
        value: 1
      },
      {
        text: '改价审批',
        value: 2
      },
      {
        text: '认证审批',
        value: 3
      },
      {
        text: '开启任务',
        value: 4
      },
      {
        text: '退款审批',
        value: 5
      },
    ],
    value1: 0,
    value2: 'a',
    processType: 0,
    keyWords: "",
    orderType: "",
    reactStatus: true,
    createBy: "",
    filters: {
      type: 0,
      changeType: 1,
      orderType: null,
      changeprice: null,
      primaryType: null
    },
    transferList: [], //我的流程-对公转账审批
    contractList: [], //我的流程-合同审批
    changePickerList: [], // 我的流程-改价审批
    primaryList: [], //我的流程 -初級審批認證
    openTaskList: [], // 我的流程 - 开启任务审批
    typeData: typeData(),
    orderTypeData: orderTypeData(),
    contractOrderTrpe: getOrderType(),
    changetypeData: changetypeData(),
    changePriceData: changePriceData(),
    changePrimary: changePrimary(),
    show: true,
    priceShow: true,
    empList: [],
    changempList: [],
    keyWord: "",
    pricekeyWords: "",
    value: [0],
    empInfo: {
      name: "待处理人",
      userId: ""
    },
    initiator: {
      name: "发起人",
      userId: ""
    },
    pageNo: 1,
    pageSize: 20,
    total: 0,
    reachStatus: false,
    totalTransfer: 0,
    totalChange: 0,
    totalPrimary: 0,
    refundInfo:{
      refundPage: 1,
      keyWord: null,
    }
  },
  // 改变订单类型
  changeProcessType(e) {
    // this.setFilters(e, 0)
    this.closeMask();
    this.setData({
      processType: e.detail
    })
    this.changeType()
  },
  closeMask() {
    this.setData({
      show: true,
      priceShow: true,
    })
  },
  changeKeywords(e) {
    this.setData({
      keyWords: e.detail.value.trim()
    })
  },
  searchList() {
    let para = {
      refundPage: 1,
    }
    if(this.data.processType == 5) return this.selectComponent("#refund").getList(para);     
    this.setData({
      pageNo: 1,
    });
    this.getList();
  },
  allot() {
    this.setData({
      show: false,
    });
  },
  allotPrice() {
    this.setData({
      priceShow: false,
      pricekeyWords: ""
    })
  },

  // 关闭选择框
  close() {
    this.setData({
      show: true,
      keyWord: ""
    })
  },
  priceClose() {
    this.setData({
      priceShow: true,
      pricekeyWords: ""
    })
  },
  // 选择员工后关闭选择框
  confirm() {
    this.setData({
      show: true,
      pageNo: 1,
      reachStatus: false,
      keyWord: '',
    })
    let empList = this.data.empList
    let index = this.data.value[0]
    if (empList.length > 0) {
      this.setData({
        empInfo: empList[index]
      })
    }
    this.getList();
    this.getEmpList();
  },
  priceConfirm() {
    this.setData({
      priceShow: true,
      pageNo: 1,
      reachStatus: false,
    })
    let changempList = this.data.changempList
    let index = this.data.value[0]
    if (changempList.length > 0) {
      this.setData({
        initiator: changempList[index]
      })
    }
    this.getList()
  },
  changePType(e) {
    let filters = this.data.filters
    filters.type = e.detail
    this.setData({
      filters: filters,
      pageNo: 1,
      reachStatus: false,
    })
    this.getList()
  },
  changePTypePrice(e) {
    let filters = this.data.filters
    filters.changeType = e.detail
    filters.primaryType = e.detail
    this.setData({
      filters: filters,
      pageNo: 1,
      reachStatus: false,
    })
    this.getList()
  },
  changeOrderType(e) {
    let filters = this.data.filters
    filters.orderType = e.detail
    this.setData({
      filters: filters,
      pageNo: 1,
    })
    this.getList()
  },
  changeOrderpriceType(e) {
    let filters = this.data.filters
    filters.changeprice = e.detail
    this.setData({
      filters: filters,
      pageNo: 1,
    })
    this.getList()
  },
  changepricesty(e) {
    let filters = this.data.filters
    filters.changeprice = e.detail
    this.setData({
      filters: filters,
      pageNo: 1,
    })
    this.getList()
  },
  //获取流程列表
  getList() {
    switch (this.data.processType) {
      case 0:
        this.getContractList()
        break;
      case 1:
        this.getMyOrderTask()
        break;
      case 2:
        this.getChangeMyListData()
        break
      case 3:
        this.getContractListData()
        break
      case 4:
        this.getTaskOpenListData()
        break
    }
  },
  //获取改价审批列表
  getChangeMyListData(options) {
    let params = {
      handleBy: this.data.empInfo.userId,
      keyWord: this.data.keyWords,
      flowStatus: this.data.filters.changeType,
      createBy: this.data.initiator.userId,
      orderType: this.data.filters.changeprice,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
    }
    getChangeMyList(params).then(res => {
      if (res.code == 0) {
        let reachStatus = this.data.reachStatus
        res.data.records.forEach(el => {
          el.contractStatus = contractStatus(el.taskStatus)
        });
        this.setData({
          changePickerList: reachStatus == true ? this.data.changePickerList.concat(res.data.records) : res.data.records,
          total: res.data.total,
          reachStatus: false,
          totalChange: res.data.total,
        })
        if (this.data.changePickerList.length > 0 && options && options.num == 2) {
          this.setData({
            processType: Number(options.num)
          })
        }
        wx.stopPullDownRefresh()
      } else {
        this.setData({
          reachStatus: false,
        })
      }
    })

  },
  //获取初级认证/授权审批 列表
  getContractListData() {
    let params = {
      auditId: this.data.empInfo.userId,
      keyWord: this.data.keyWords,
      flowStatus: this.data.filters.primaryType,
      createBy: this.data.initiator.userId,
      orderType: this.data.filters.changeprice,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
    }
    getContractList(params).then(res => {
      if (res.code == 0) {
        let reachStatus = this.data.reachStatus
        res.data.records.forEach(el => {
          el.contractStatus = contractStatus(el.taskStatus)
        });
        this.setData({
          primaryList: reachStatus == true ? this.data.primaryList.concat(res.data.records) : res.data.records,
          totalPrimary: res.data.total,
          reachStatus: false,
        })
        wx.stopPullDownRefresh()
      }
    })

  },
  // changePickerList
  //获取合同列表
  getContractList() {
    let params = {
      categoryId: this.data.filters.orderType,
      keywords: this.data.keyWords,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
      handlerId: this.data.empInfo.userId,
      taskStatus: this.data.filters.type,
    }
    contractAuditListOfMy(params).then(res => {
      if (res.code == 0) {
        let reachStatus = this.data.reachStatus
        res.data.records.forEach(el => {
          el.contractStatus = contractStatus(el.taskStatus)
        });
        this.setData({
          contractList: reachStatus == true ? this.data.contractList.concat(res.data.records) : res.data.records,
          total: res.data.total,
          reachStatus: false,
        })
        wx.stopPullDownRefresh()
      }
    })
  },
  //获取开启任务
  getTaskOpenListData() {
    let params = {
      createBy: this.data.initiator.userId,
      keyWord: this.data.keyWords,
      flowStatus: this.data.filters.primaryType,
      preAuditorId: this.data.empInfo.userId,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
    }
    getTaskOpenList(params).then(res => {
      if (res.code == 0) {
        let reachStatus = this.data.reachStatus
        res.data.records.forEach(el => {
          el.contractStatus = contractStatus(el.taskStatus)
        });
        this.setData({
          openTaskList: reachStatus == true ? this.data.openTaskList.concat(res.data.records) : res.data.records,
          total: res.data.total,
          reachStatus: false,
        })
        wx.stopPullDownRefresh()
      }
    })
  },

  //获取对公转账列表
  getMyOrderTask(e) {
    if (e) {
      let params = {
        taskCurrentEmpId: this.data.empInfo.userId,
      }
      pageMyOrderTaskInfo(params).then(res => {
        if (res.code == 0) {
          this.setData({
            totalTransfer: res.data.total,
          })
          wx.stopPullDownRefresh()
        }
        wx.stopPullDownRefresh()
      })
    } else {
      let params = {
        categoryId: this.data.filters.orderType,
        keyWord: this.data.keyWords,
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize,
        taskCurrentEmpId: this.data.empInfo.userId,
        taskStatus: this.data.filters.type,

      }
      pageMyOrderTaskInfo(params).then(res => {
        if (res.code == 0) {
          let reachStatus = this.data.reachStatus
          if (this.data.processType == 1) {
            this.setData({
              transferList: reachStatus == true ? this.data.transferList.concat(res.data.records) : res.data.records,
              total: res.data.total,
              reachStatus: false,
            })
          }
          wx.stopPullDownRefresh()
        }
      })
    }

  },
  // 触底加载更多数据
  getReachList() {
    let newTotal = this.data.total
    let pageNo = this.data.pageNo
    if (this.data.transferList.length < newTotal || this.data.contractList.length < newTotal || this.data.changePickerList.length < newTotal || this.data.primaryList.length < newTotal || this.data.openTaskList.length < newTotal) {
      this.setData({
        reachStatus: true,
        pageNo: pageNo + 1
      })
      this.getList()
    }
  },
  // 滚动切换员工
  changePicker(e) {
    this.setData({
      value: e.detail.value
    })
  },
  initialize() {
    this.setData({
      empInfo: {
        name: "待处理人",
        userId: ""
      },
      initiator: {
        name: "发起人",
        userId: ""
      },
    })
  },
  transformType() {
    let processType = this.data.processType
    let filters = this.data.filters
    filters.orderType = null
    filters.changeType = 1
    if (this.data.totalTransfer > 0) {
      this.setData({
        processType: 1,
        filters: filters,
      })
    } else if (this.data.totalChange > 0) {
      this.setData({
        processType: 2,
        filters: filters,
      })
    }
  },
  changeType() {
    let processType = this.data.processType
    if (processType == 0) {
      let filters = this.data.filters
      filters.orderType = null
      filters.changeType = 1
      if (this.data.totalTransfer > 0) {
        this.setData({
          // processType: 1,
          filters: filters,
        })
        this.initialize()
      } else if (this.data.totalChange >= 0) {
        this.setData({
          // processType: 2,
          filters: filters,
        })
        this.initialize()
      } else if (this.data.totalPrimary > 0) {
        filters.changeType = ''
        this.setData({
          // processType: 3,
          filters: filters,
        })
        this.initialize()
      }
      this.getList();
    } else if (processType == 1) {
      let filters = this.data.filters
      filters.orderType = null
      filters.changeType = 1
      if (this.data.totalChange >= 0) {
        this.setData({
          // processType: 2,
          filters: filters
        })
        this.initialize()
      } else if (this.data.totalPrimary > 0) {
        filters.changeType = ''
        this.setData({
          // processType: 3,
          filters: filters,
        })
        this.initialize()
      }
      this.getList();
    } else if (processType == 2 && this.data.totalPrimary > 0) {
      let filters = this.data.filters
      filters.orderType = null
      filters.changeType = ''
      this.setData({
        // processType: 3,
        filters: filters,
      })
      this.initialize()
      this.getList();
    } else {
      let filters = this.data.filters
      filters.orderType = null
      filters.changeType = 1
      this.setData({
        // processType: 0,
        filters: filters,
      })
      this.initialize();
      this.getList();
    }
  },
  changeSearch(e) {
    this.setData({
      keyWord: e.detail.value.trim()
    })
    this.getEmpList();
  },
  changePricekeySearch(e) {
    this.setData({
      pricekeyWords: e.detail.value.trim()
    })
    this.getPriceEmpList()
  },
  removeData() {
    this.setData({
      filters: {
        type: 0,
        changeType: 1,
        orderType: null,
        changeprice: null
      },
      keyWords: "",
      pageNo: 1,
    })
    this.initialize()
  },
  // 根据姓名获取员工
  getEmpList() {
    let params = {
      name: this.data.keyWord
    }
    getEmpOption(params).then(res => {
      if (res.code == 0) {
        this.setData({
          empList: res.data,
        })
      }
    })
  },
  getPriceEmpList() {
    let params = {
      name: this.data.pricekeyWords
    }
    getEmpOption(params).then(res => {
      if (res.code == 0) {
        this.setData({
          changempList: res.data
        })
      }
    })
  },
  clearKerword() {
    this.setData({
      keyWords: "",
      transferList: []
    })
    this.getList()
  },
  noMore(status){
    console.log(status.detail,'-----');
    if (!status.detail) return;
    this.setData({
      reactStatus: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options && options.num) {
      this.setData({
        processType: Number(options.num)
      })
    }
    this.getPriceEmpList()
    this.getEmpList()
    this.getMyOrderTask(1)
    this.getContractList()
    this.getChangeMyListData(options)
    this.getContractListData()

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
  onHide() {},

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(this.data.processType != 5 ) return this.getReachList();
    if(!this.data.reactStatus) return;
    let current = 'refundInfo.refundPage'
    this.setData({
      [current]: this.data.refundInfo.refundPage + 1
    });
    this.selectComponent("#refund").getList(this.data.refundInfo);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})