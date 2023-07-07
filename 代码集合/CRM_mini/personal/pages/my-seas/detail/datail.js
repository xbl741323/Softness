// personal/pages/my-clue/detail/detail.js
import {
  receive,
  allotBelong
} from "../../../../utils/api/clue"
import {
  filterIndustry,
  filterUnitType,
  filterLastYearSale,
  filterClueLabel,
  filterEmployeesNum,
  filterArea,
} from "../../../../utils/clue/clue"
import * as CodeMsg from "../../../../utils/common/codeMsg";
import {
  getSeasClueDetail,
} from '../../../../utils/api/seas'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showChild: false,
    highCertifyImg: '/personal/image/my-clue/certified-high.png',
    lowCertifyImg: '/personal/image/my-clue/certified-low.png',
    FollowUpList: [], // 跟进记录
    active: '0',
    allotInfo: { // 分配对象
      type: "", // 分配类型 0-分配线索归属 1-分配业务员
      id: "" // 分配的线索id
    },
    highSeasType: '',
    orderInfo: "",
    userInfo: {},
    clueId: "", // 线索详情id
    isPerson: true, // 是否属于我的
    clueType: 1, // 线索类型 1-个人 2-单位
    clueInfo: {}, // 线索对象
    transInfo: { // 缓存数据
      orgType: "",
      industry: "",
      clueLebel: "",
      area: "",
      lastYearSale: "",
      lastYearAssets: "",
      lastYearProfit: "",
      lastYearDevExpenses: "",
      unitEmployees: "",
      clueIdList: []
    },
    pageNo: 1,
    pageSize: 20,
  },
  // 修改展示tab类型
  changeTab(e) {
    let name = e.detail.name
    if (name == 3) {
      wx.setNavigationBarTitle({
        title: '跟进记录',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '线索详情',
      })
    }
    this.setData({
      active: name
    })
    this.getChildData()
  },
  // 调用子组件列表接口
  getChildData() {
    let active = this.data.active
    if (active == 1) {
      this.selectComponent("#clue").getClueRecordslist()
    }
    if (active == 2) {
      this.selectComponent("#order").getList()
    }
    if (active == 3) {
      this.selectComponent("#billing").getList()
    }
  },
  // 跳转到线索跟进页
  toFollow() {
    let clueType = this.data.clueType
    let clueInfo = this.data.clueInfo
    let clueId = this.data.clueId
    let clueName = clueType == 1 ? clueInfo.contactName : clueInfo.companyName
    let data = JSON.stringify({
      clueId: clueId,
      clueName: clueName
    })
    wx.navigateTo({
      url: `/personal/pages/my-clue/follow/follow?clueType=${clueType}&&clueInfo=${data}`,
    })
  },
  // 分配 type：0-分配线索归属 1-分配业务员
  allot(empInfo) {
    let type = this.data.allotInfo.type
    let id = this.data.allotInfo.id
    let clueType = this.data.clueType
    let param = {
      clueEmpId: empInfo.userId, // 指定员工id
      clueEmpName: empInfo.name, // 指定员工名称
      clueEmpNo: empInfo.number, // 指定员工Number
      clueEmpDeptId: empInfo.deptId, // 指定员工部门id
      clueEmpDeptName: empInfo.deptName, // 指定员工部门名称
      clueEmpDeptNo: empInfo.deptNumber, // 指定员工部门Number
      clueIdList: [id], // 待分配线索ID列表
    };
    allotBelong(param, type, clueType).then((res) => {
      if (res.code == CodeMsg.CODE_0) {
        wx.showToast({
          icon: "success",
          title: '分配成功！',
        })
        this.getDetail()
      } else {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
      }
    });
  },
  toClueList() {
    wx.navigateBack()
  },
  // 领取公海客户
  receive() {
    let that = this
    wx.showModal({
      content: "如该线索已绑定成交客户，则会在“我的线索”和“我的客户”中分别增加一条客户数据，确定领取？",
      cancelColor: "#999999",
      cancelText: "取消",
      confirmColor: "#36A6FE",
      confirmText: "确定",
      success(res) {
        if (res.confirm) {
          that.receiveOperate()
        } else if (res.cancel) {}
      }
    })
  },
  // 领取操作
  receiveOperate() {
    let clueType = this.data.clueType
    let clueInfo = this.data.clueInfo
    let params = {
      clueIdList: [clueType == 2 ? clueInfo.clueCompanyId : clueInfo.cluePersonId]
    }
    receive(params, this.data.clueType, this.data.highSeasType).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        wx.showToast({
          icon: "success",
          title: '领取成功！',
        })
        setTimeout(() => {
          this.getDetail()
          this.toClueList()
        }, 1000)
      } else {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
      }
    })
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

  // 获取线索详情
  getDetail() {
    getSeasClueDetail(this.data.clueId, this.data.clueType, this.data.highSeasType).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        // 获取数据
        this.setData({
          clueInfo: res.data,
          clueIdList: res.data.clueIdList,
          showChild: true
        })
        this.filterType()
      }
    })
  },
  // key值转换
  filterType() {
    let clueInfo = this.data.clueInfo
    let transInfo = this.data.transInfo
    let clueType = this.data.clueType
    clueInfo.isDeal = transInfo.industry = filterIndustry(clueInfo.industry)
    transInfo.orgType = filterUnitType(clueInfo.orgType)
    transInfo.area = filterArea(clueInfo.orgAddress)
    transInfo.clueLebel = filterClueLabel(clueInfo.clueGradeId)
    if (clueType == 2) {
      let clueCompanyUnit = clueInfo.clueCompanyUnit
      transInfo.lastYearSale = filterLastYearSale(clueCompanyUnit.lastYearSale)
      transInfo.lastYearAssets = filterLastYearSale(clueCompanyUnit.lastYearAssets)
      transInfo.lastYearProfit = filterLastYearSale(clueCompanyUnit.lastYearProfit)
      transInfo.lastYearDevExpenses = filterLastYearSale(clueCompanyUnit.lastYearDevExpenses)
      transInfo.unitEmployees = filterEmployeesNum(clueCompanyUnit.unitEmployees)
    }
    this.setData({
      transInfo: transInfo
    })
  },
  // 获取登录用户信息
  checkLoginStatus() {
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
      })
      this.getDetail()
      this.checkTabIndex()
    }
  },
  // 初始化赋值
  setOriginalValue(options) {
    this.setData({
      clueId: options.id,
      clueType: options.clueType
    })
  },
  // 检查触底加载
  checkReach() {
    let active = this.data.active
    if (active == 1) {
      this.selectComponent("#clue").getReachList()
    }
    if (active == 2) {
      this.selectComponent("#order").getReachList()
    }
    if (active == 3) {
      this.selectComponent("#billing").getReachList()
    }
  },
  // 检查当前tab类型
  checkTabIndex() {
    this.getChildData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      highSeasType: options.highSeasType,
      clueType: options.clueType,
      contractId: options.id
    })
    this.setOriginalValue(options)
  },
  getDataList() {
    let active = this.data.active
    if (active == 1) {
      this.selectComponent("#clue").pullToRefresh()
    }
    if (active == 2) {
      this.selectComponent("#order").getList()
    }
    if (active == 3) {
      this.selectComponent("#billing").getFollowUpData()
    }
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
    }
    this.getDataList()
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
    this.checkLoginStatus()

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
    this.checkReach()
  }
})