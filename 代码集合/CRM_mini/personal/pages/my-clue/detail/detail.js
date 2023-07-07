// personal/pages/my-clue/detail/detail.js
const app = getApp();
import {
  getClueDetail,
  delClue,
  receiveForMy,
  allotBelong,
  validateCreateOrder,
  getMyCreateCompanyAuthVo
} from "../../../../utils/api/clue"
import {
  filterIndustry,
  filterUnitType,
  filterLastYearSale,
  filterClueLabel,
  filterEmployeesNum,
  filterArea,
} from "../../../../utils/clue/clue"
import {
  arrToObj
} from "../../../../utils/order/order"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showChild: false,
    userInfo: {},
    highCertifyImg: '/personal/image/my-clue/certified-high.png',
    lowCertifyImg: '/personal/image/my-clue/certified-low.png',
    active: '0',
    allotInfo: { // 分配对象
      type: "", // 分配类型 0-分配线索归属 1-分配业务员
      id: "" // 分配的线索id
    },
    orderInfo: "",
    clueId: "", // 线索详情id
    isPerson: true, // 是否属于我的
    clueType: 1, // 线索类型 1-个人 2-单位
    clueInfo: {}, // 线索对象
    certifiedLabel: null, //认证方式 0-未认证 1-初级认证 2-高级认证
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
    },
    isShow: false,
    tipText: '',
    permissions: {},
    authTypeDialog: false,//认证类型弹窗
    authType: "1",//认证类型
    currentYear: new Date().getFullYear()-1
  },

  getCurrentYear(e){
    this.setData({
      currentYear: e.detail
    })
  },
  // 发起认证
  launchApprove(e) {
    let data = this.data.clueInfo
    let clueType = this.data.clueType // 1 个人 2 单位
    let certifiedLabel = this.data.certifiedLabel
    let clueId = clueType == 2 ? data.clueCompanyId : data.cluePersonId
    // certifiedLabel 0 未认证 1 初级认证 2高级认证
    let warnTxt = certifiedLabel == 1 ? '该客户信用代码已完成初级认证！' : certifiedLabel == 2 ? '该客户信用代码已完成高级认证！' : '该客户暂不可选，具体情况咨询管理人员！'
    getMyCreateCompanyAuthVo(clueId, clueType).then(res => {
      if (res.code != CodeMsg.CODE_0) {
        // 修改wx.showToast当title文字超出两行时会显示省略号问题
        this.setData({
          isShow: true,
          tipText: res.msg
        })
        setTimeout(() => {
          this.setData({
            isShow: false,
            tipText: res.msg
          })
        }, 1500)
        return false
      }
      if (certifiedLabel != 0) {
        wx.showToast({
          icon: "none",
          title: warnTxt,
          duration: 1000
        })
      }
      this.setData({
        authTypeDialog: true
      })
      if(clueType==1){
        this.setData({
          authType: "2"
        })
      }
    })
  },
  // 跳转到录入合同页面
  enterContract() {
    let clueInfo = this.data.clueInfo
    clueInfo.clueType = this.data.clueType
    clueInfo.clueId = this.data.clueType == 2 ? clueInfo.clueCompanyId : clueInfo.cluePersonId
    let data = JSON.stringify(clueInfo)
    wx.navigateTo({
      url: `/personal/pages/my-contract/enter-contract/enter-contract?clueInfo=${data}&&pageForm=${1}`,
    })
  },
  // 修改展示tab类型
  changeTab(e) {
    console.log(e)
    let name = e.detail.name
    this.setData({
      active: name
    })
    this.getChildData()
  },
  // 调用子组件列表接口
  getChildData() {
    let active = this.data.active
    if (active == 1) {
      this.selectComponent("#order").getList()
    }
    if (active == 2) {
      this.selectComponent("#follow").getFollowData()
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
      clueNo: clueInfo.clueNo,
      clueType: clueType,
      clueName: clueName,
    })
    wx.navigateTo({
      url: `/personal/pages/my-clue/follow/follow?clueType=${clueType}&&clueInfo=${data}`,
    })
  },
  // 跳转到编辑线索页面
  toEditClue() {
    let clueId = this.data.clueId
    let clueType = this.data.clueType
    let currentYear = this.data.currentYear;
    let data = JSON.stringify({
      clueId: clueId,
      clueType: clueType,
      currentYear
    })
    wx.navigateTo({
      url: `/personal/pages/my-clue/modify/modify?data=${data}`,
    })
  },
  // 显示员工选择框 分配 type：0-分配线索归属 1-分配业务员
  showEmpSheet(e) {
    let type = e.currentTarget.dataset.type
    let clueType = this.data.clueType
    let clueInfo = this.data.clueInfo
    let id = clueType == 2 ? clueInfo.clueCompanyId : clueInfo.cluePersonId
    let obj = {
      type: type,
      id: id
    }
    this.setData({
      allotInfo: obj
    })
    this.selectComponent('#query-emp').show()
  },
  // 选择员工
  selectEmp(e) {
    console.log(e)
    let empInfo = e.detail
    this.allot(empInfo)
  },
  // 分配 type：0-分配线索归属 1-分配业务员
  allot(empInfo) {
    console.log(empInfo, "empInfo")
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
  // 领取公海客户
  receive() {
    let that = this
    wx.showModal({
      content: "确定领取？",
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
    receiveForMy(params, this.data.clueType).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        wx.showToast({
          icon: "success",
          title: '领取成功！',
        })
        this.getDetail()
      } else {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
      }
    })
  },
  // 确认删除
  deleteClue() {
    let that = this
    wx.showModal({
      content: "确定删除该线索？",
      cancelColor: "#999999",
      cancelText: "取消",
      confirmColor: "#36A6FE",
      confirmText: "确定",
      success(res) {
        if (res.confirm) {
          that.confirmDelete()
        } else if (res.cancel) {}
      }
    })
  },
  // 确认删除
  confirmDelete() {
    let clueType = this.data.clueType
    let clueInfo = this.data.clueInfo
    let params = {
      id: clueType == 2 ? clueInfo.clueCompanyId : clueInfo.cluePersonId,
    }
    delClue(params, clueType).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        wx.showToast({
          icon: "none",
          title: '失效线索已删除！',
        })
        this.toClueList()
      }
    })
  },
  // 返回线索列表页
  toClueList() {
    let url = `/personal/pages/my-clue/list/list`
    wx.navigateTo({
      url: `${url}`,
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
  // 检查发起订单是否符合条件
  validateProOrder() {
    let row = this.data.clueInfo
    let clueType = this.data.clueType
    let params = clueType == 2 ? {
      companyName: row.companyName,
      organization: row.organization
    } : {
      mobile: row.mobile,
      personName: row.contactName
    }
    validateCreateOrder(params, clueType).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        this.toGenerateOrder()
      } else {
        wx.showModal({
          content: `${res.msg}`,
          confirmColor: "#36A6FE",
        })
      }
    })
  },
  // 跳转到发起订单页
  toGenerateOrder() {
    let clueType = this.data.clueType
    let clueInfo = this.data.clueInfo
    let data = JSON.stringify(clueInfo)
    wx.navigateTo({
      url: `/personal/pages/my-order/generate-order/add/add?clueType=${clueType}&&clueInfo=${data}`,
    })
  },
  // 获取线索详情
  getDetail() {
    let clueId = this.data.clueId
    let isPerson = this.data.isPerson
    let clueType = this.data.clueType
    let params = clueType == 1 ? {
      cluePersonId: clueId
    } : {
      clueCompanyId: clueId
    }
    getClueDetail(params, clueType, isPerson).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        this.setData({
          clueInfo: res.data,
          showChild: true,
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
    transInfo.industry = filterIndustry(clueInfo.industry)
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
      clueType: options.clueType,
      certifiedLabel: options.certifiedLabel
    })
  },
  // 检查触底加载
  checkReach() {
    let active = this.data.active
    if (active == 1) {
      this.selectComponent("#order").getReachList()
    }
    if (active == 2) {
      this.selectComponent("#follow").getReachList()
    }
  },
  // 检查当前tab类型
  checkTabIndex() {
    this.getChildData()
  },
   // 关闭认证类型弹窗
   closeAuthDialog(){
    this.setData({
      authTypeDialog: false,
      authType: '1'
    })
  },
  // 提交认证类型
  submitAuthType(){
    // authType 1 后台自主认证 2 电商认证
    // clueType 1 个人 2 单位
    console.log(1111);
    wx.navigateTo({
      url: `/personal/pages/my-clue/launch-approve/launch-approve?id=${this.data.clueId}&&authType=${this.data.authType}&&clueType=${this.data.clueType}`,
    })
    console.log(2222);
    this.closeAuthDialog()
  },
  // 单选框状态切换
  onChangeRadio(event) {
    this.setData({
      authType: event.detail,
    });
  },
  // 禁止屏幕滚动
  preventTouchMove() {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      permissions: arrToObj()
    })
    this.setOriginalValue(options)
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
    console.log("触底了")
    this.checkReach()
  }
})