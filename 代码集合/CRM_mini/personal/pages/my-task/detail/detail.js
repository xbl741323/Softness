// personal/pages/my-clue/detail/detail.js
const app = getApp();
import {
  delClue,
  allotBelong
} from "../../../../utils/api/clue"
import {
  returnCategory
} from "../../../../utils/clue/clue"
import * as CodeMsg from "../../../../utils/common/codeMsg";
import {
  getTaskDetail,
  editTaskList,
  getTaskFlow,
  submitProgress,
  getEmpOption,
  updateEngineerName,
  getDataRole
} from "../../../../utils/api/mytask"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    nameData: [],
    nameList: [],
    radio: '1',
    changeRoleList: [],
    result: [],
    userInfo: {},
    engineerInfo: [],
    endType: null,
    priceShow: true,
    changempList: [],
    deliveryTime: null,
    currentDate: new Date().getTime(),
    showStartTime: false,
    auditRequired: false,
    auditRemark: '',
    auditDialog: false,
    changeMessage: false,
    comment: '',
    finishLabel: [{
      text: null,
      stepType: null
    }],
    mainActiveIndex: 0,
    activeId: null,
    stepType: "",
    getTaskOrderLsti: [],
    btnstate: 1,
    batchShow: true,
    category: [],
    clueType: null,
    taskobj: {},
    value: [0],
    active: '0',
    taskInfo: {},
    priorityShow: true,
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
    }, // 优先级
    priorityList: [{
      text: '高',
      priority: 1
    }, {
      text: '中',
      priority: 2
    }, {
      text: '低',
      priority: 3
    }, {
      text: '紧急',
      priority: 0
    }],
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    pricekeyWords: '',
  },

  // 点击按钮
  toModifyOrder() {
    this.setData({
      priorityShow: false,
    })
  },
  priorityClose() {
    this.setData({
      priorityShow: true,
    })
  },
  priorityConfirm() {
    this.setData({
      priorityShow: true,
      pageNo: 1,
      reachStatus: false,
    })
    let priorityList = this.data.priorityList
    let index = this.data.value[0]
    if (priorityList.length > 0) {
      let priorityData = this.data.priorityData
      priorityData = priorityList[index]
      this.setData({
        priorityData: priorityData
      })
      this.changePriority()
    }
  },
  // 更改优先级
  changePriority() {
    let obj = {
      id: this.data.taskInfo.id,
      priority: this.data.priorityData.priority
    }
    editTaskList(obj).then(res => {
      if (res.code == 0) {
        wx.showToast({
          icon: "none",
          title: '修改成功',
        })
        this.setData({
          priorityShow: true
        })
      } else {
        wx.showToast({
          icon: "error",
          title: res.msg,
        })
      }
      this.getDetail()
    })
  }, // 滚动切换员工
  changePicker(e) {
    this.setData({
      value: e.detail.value
    })
  },
  // 修改展示tab类型
  changeTab(e) {
    let name = e.detail.name
    this.setData({
      active: name
    })
    this.getChildData()
  },
  // 调用子组件列表接口
  getChildData() {
    let active = this.data.active
    if (active == 0) {
      this.selectComponent("#taskInfo").getList()
    }
    if (active == 1) {
      this.selectComponent('#indent').getList()
    }
    if (active == 2) {
      this.selectComponent("#mission").getList()
    }
    if (active == 3) {
      this.selectComponent("#maintenance").getList()
    }
  },
  showEmpSheet(e) {
    this.setData({
      priceShow: false
    })
  },
  // 选择员工
  selectEmp(e) {
    let empInfo = e.detail
    this.allot(empInfo)
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
        this.setData({
          resultUserInfo: [],
          nameList: []
        })
        this.getEmpList()
        this.getPartnerDept()
        this.getDetail()
      } else {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
      }
    });
  },
  // 分配工程师
  removerFun(e) {
    this.setData({
      nameList: this.data.nameList.filter(item => {
        return item.userId != e.currentTarget.dataset.info.userId
      }),
      resultUserInfo: this.data.resultUserInfo.filter(item => {
        return item != e.currentTarget.dataset.info.userId
      })
    })
  },
  confirmDelete() {
    let clueType = this.data.clueType

    let taskInfo = this.data.taskInfo
    let params = {
      id: clueType == 2 ? taskInfo.clueCompanyId : taskInfo.cluePersonId,

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
  // 跳转到发起订单页
  toGenerateOrder() {
    let clueType = this.data.clueType

    let taskInfo = this.data.taskInfo
    let data = JSON.stringify(taskInfo)
    wx.navigateTo({
      url: `/personal/pages/my-order/generate-order/add/add?clueType=${clueType}&&taskInfo=${data}`,

    })
  },
  // 获取线索详情
  async getDetail() {
    await getTaskDetail(this.data.clueId).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        this.setData({
          taskInfo: res.data,
          clueType: res.data.clueType
        })
      }
    })
  },
  // 获取登录用户信息
  checkLoginStatus() {
    this.getDetail()
    // this.checkTabIndex()
  },
  // 初始化赋值
  setOriginalValue(options) {
    this.setData({
      category: returnCategory(),
      clueId: options.id,
      clueType: options.clueType,
      taskStatus: options.state
    })
  },
  // 检查触底加载
  checkReach() {
    let active = this.data.active
    if (active == 3) {
      this.selectComponent("#maintenance").getReachList()
    }
  },
  // 单选框状态切换
  onChangeRadio(event) {
    this.setData({
      radio: event.detail,
    });
    let e = {
      detail: {
        value: ''
      }
    }
    this.changeSearch(e)
  },
  // 检查当前tab类型
  checkTabIndex() {
    this.getChildData()
  },
  goToPage(e) {
    let num = e.currentTarget.dataset.item
    if (num == 1) {
      if (this.data.state) {
        this.setData({
          priceShow: false
        })
      } else {
        this.setData({
          btnNumTow: 1,
          state: true
        })
      }
    } else {
      if (this.data.state) {
        let parameter = this.data.parameter
        this.getTaskFlowList()
      } else {
        this.setData({
          btnNumOne: 2,
          state: true
        })
      }
    }
  },
  batchClose() {
    this.setData({
      batchShow: true,
      btnstate: 1
    })
  },
  getTaskFlowList() {
    let obj = {
      version: this.data.taskInfo.flowVersion,
      flowId: this.data.taskInfo.flowId
    }
    getTaskFlow(obj).then(res => {
      if (res.code == 0) {
        let endType = res.data[res.data.length - 1].finishType;
        let sepanId = res.data[res.data.length - 1].id;
        let arr = []
        res.data.forEach(item => {
          if (!(endType == 'B' && item.stepName == '完成')) {
            arr.push({
              text: item.stepName,
              id: item.sort,
              stepName: item.stepName,
              stepType: item.stepType,
              finishType: item.finishType,
              stepId: item.id
            })
          }
        })
        // zheli
        let narr = [{
          text: '通过',
          stepName: '完成',
          finishLabel: '通过',
          stepType: 2,
          stepId: sepanId
          // id: -11
        }, {
          text: '不通过',
          stepName: '完成',
          finishLabel: '不通过',
          stepType: 2,
          stepId: sepanId
          // id: -22,
        }, {
          text: '已暂停',
          stepName: '已暂停',
          id: "-1"
        }, {
          text: '已关闭',
          stepName: '已关闭',
          id: "-2"
        }]

        if (endType == 'A') {
          narr.shift()
          narr.shift()
        }

        arr = [...arr, ...narr]
        this.setData({
          getTaskOrderLsti: arr,
          batchShow: false,
          endType: endType,
          // priceShow: true
        })
      }
    })
  },
  filtrateFun(data, type) {
    // debugger
    if (type == 1) {
      return data == '待开始' ? 0 : ['完成', '通过', '不通过'].includes(data) ? 2 : data == '已关闭' ? -2 : data == '已暂停' ? -1 : 1
    } else {
      if (data && data.stepId) {
        return data.stepId
      } else {
        // return Number(this.data.taskInfo.stepId)
        return data.text == "已暂停" ? -1 : -2
      }
    }
  },
  getAuditRemark(e) {
    this.setData({
      comment: e.detail.value
    })
  },
  clickClong(e) {
    let btnstate = this.data.btnstate
    if (btnstate == 1) {
      this.nextStepClong()
      this.setData({
        btnstate: 2
      })
    } else {
      this.setData({
        btnstate: 1
      })
    }
  },
  confirmAuditretuer() {
    let obj = {
      id: this.data.taskInfo.id, // 这个任务的id
      stepId: this.filtrateFun(this.data.finishLabel, 2),
      description: this.data.comment,
      finishLabel: this.filtrateFun(this.data.finishLabel.stepName, 1) == 2 ? this.data.finishLabel.finishLabel : '',
      // finishLabel: this.filtrateFun(this.data.finishLabel.finishLabel, 1) == 1 || this.filtrateFun(this.data.finishLabel.finishLabel, 1) == -2 ? "" : this.data.finishLabel.text || '',
      finishType: this.filtrateFun(this.data.finishLabel.text, 1) == 2 ? this.data.endType : '',
      stepName: this.data.finishLabel.stepName,
      stepType: this.filtrateFun(this.data.finishLabel.text, 1),
    }
    submitProgress(obj, 0).then(res => {
      if (res.code == 0) {
        this.checkLoginStatus()
        wx.showToast({
          icon: "error",
          title: '提交进度成功',
        })
      } else {
        wx.showModal({
          title: res.msg,
        })
      }
      this.setData({
        batchShow: true,
        comment: '',
        btnstate: 1
      })
    })
  },
  onClose() {
    this.setData({
      batchShow: true,
      comment: '',
      btnstate: 1
    })
  },
  batchConfirm() {
    this.setData({
      Dialog: true,
      batchShow: true,
      btnstate: 1
    })
  },
  deleteClue() {
    this.setData({
      auditRemark: this.data.taskInfo.deliveryName,
      currentDate: new Date(this.data.taskInfo.deliveryTime).getTime() || new Date().getTime(),
      changeMessage: true
    })
  },
  toFollow() {
    let taskInfo = this.data.taskInfo
    let data = JSON.stringify(taskInfo)
    wx.navigateTo({
      url: `/personal/pages/my-task/follow/follow?taskInfo=${data}&&pageForm=${1}`,
    })
  },
  onClose() {
    this.setData({
      changeMessage: false
    })
  },
  changeItem() {
    this.setData({
      showStartTime: true
    })
  },
  changeName() {
    this.setData({
      auditDialog: true,
    })
    this.onClose()
  },

  onBeforeClose(action) {
    const pages = getCurrentPages()
    let page = pages[pages.length - 1]
    if (action == "confirm") {
      if (page.data.auditRequired) {
        return false
      } else {
        return true
      }
    } else {
      return true
    }
  },
  changRemak(e) {
    this.setData({
      auditRemark: e.detail.value
    })
  },
  confirmAudit() {
    if (this.data.auditRemark.length !== 0) {
      let param = {
        id: this.data.taskInfo.id,
        deliveryName: this.data.auditRemark,
      }
      editTaskList(param).then(res => {
        if (res.code == 0) {
          wx.showToast({
            icon: "none",
            title: '修改成功',
          })
        } else {
          wx.showToast({
            icon: 'error',
            title: res.msg,
          })
        }
        this.getDetail()
        this.setData({
          auditRemark: '',
          auditRequired: false
        })
      })

    } else {
      this.setData({
        auditRequired: true
      })
    }

  }, // 关闭时间弹窗
  closeStartTime() {
    this.setData({
      showStartTime: false
    })
  },
  onConfirmStart(e) {
    let date = e.detail
    let deliveryTime = this.data.deliveryTime
    deliveryTime = this.formatDate(date)
    this.setData({
      deliveryTime
    })
    let param = {
      id: this.data.taskInfo.id,
      deliveryTime: deliveryTime,
    }
    editTaskList(param).then(res => {
      if (res.code == 0) {
        this.getDetail()
        wx.showToast({
          icon: "none",
          title: '修改成功',
        })
      } else {
        wx.showToast({
          icon: 'error',
          title: res.msg,
        })
      }

      this.setData({
        auditRemark: '',
        auditRequired: false
      })
      this.closeStartTime()
    })
  },
  // 时间格式操作
  formatDate(date) {
    date = new Date(date);
    let year = date.getFullYear()
    let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    let day = String(date.getDate()).length == 1 ? '0' + date.getDate() : date.getDate()
    return `${year}-${month}-${day} 00:00:00`;
  },
  priceConfirm() {
    let obj = {
      id: this.data.taskInfo.id,
      trTaskEngineerList: this.data.engineerInfo
    }
    updateEngineerName(obj).then(res => {
      if (res.code == 0) {
        wx.showToast({
          icon: "none",
          title: '分配成功',
        })
        this.priceClose()
        this.setData({
          resultUserInfo: [],
          nameList: [],
          radio: '1',
          pricekeyWords: ''
        })
        this.getDetail()
        this.getEmpList()
        this.getPartnerDept()
      }
    })
  }, // 根据姓名获取员工
  getEmpList() {
    this.setData({
      loading: true,
    })
    let params = {
      name: this.data.pricekeyWords
    }
    getEmpOption(params).then(res => {
      if (res.code == 0) {
        this.setData({
          changempList: res.data,
          loading: false,
        })
        wx.nextTick(() => {
          this.setData({
            resultUserInfo: this.data.resultUserInfo,
          })
        })
      }
    })
  },
  getPartnerDept() {
    this.setData({
      loading: true,
    })
    let params = {
      keywords: this.data.pricekeyWords
    }
    getDataRole(params).then(res => {
      if (res.code == 0) {
        this.setData({
          changeRoleList: res.data,
          loading: false,
        })
        wx.nextTick(() => {
          this.setData({
            resultUserInfo: this.data.resultUserInfo,
          })
        })
      }
    })
  },
  allotPrice() {
    this.setData({
      priceShow: false,
      pricekeyWords: "",
      nameList: [],
      resultUserInfo: []
    })
    wx.nextTick(() => {
      this.getEmpList()
      this.getPartnerDept()
    })
  },
  priceClose() {
    this.setData({
      priceShow: true,
      pricekeyWords: ""
    })
  },
  changeSearch(e) {
    this.setData({
      pricekeyWords: e.detail.value.trim()
    })
    if (this.data.radio == 1) {
      this.getEmpList()
    } else {
      this.getPartnerDept()
    }
  },
  onUserChange(event) {
    let r = event.detail
    let changempList = this.data.nameData
    let arr = []
    changempList.forEach(item => {
      r.forEach(val => {
        if (item.userId == val) {
          arr.push({
            engineerId: item.userId,
            engineerName: item.name,
            engineerNo: item.number
          })
        }
      })
    })
    this.setData({
      engineerInfo: arr,
      resultUserInfo: event.detail,
      nameList: this.data.nameData.filter(item => {
        return event.detail.some(value => item.userId == value)
      })
    });
    this.getDetail()
  }, // 批量分配
  changeTabData(e) {
    this.setData({
      value: e.detail.value,
      stepType: this.data.getTaskOrderLsti[e.detail.value].stepType
    })
  },
  nextStepClong() {
    let getTaskOrderLsti = this.data.getTaskOrderLsti
    let index = this.data.value[0]
    if (getTaskOrderLsti.length > 0) {
      let priorityData = this.data.priorityData
      priorityData = getTaskOrderLsti[index]
      this.setData({
        finishLabel: priorityData
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getNameData() {
    let list = []
    let data = {
      name: this.data.pricekeyWords
    }
    getEmpOption(data).then(res => {
      if (res.code == 0) {
        list.push(...res.data)
      }
    })
    let params = {
      keywords: this.data.pricekeyWords
    }
    getDataRole(params).then(res => {
      if (res.code == 0) {
        list.push(...res.data)
        this.setData({
          nameData: list
        })
      }
    })
  },
  onLoad(options) {
    this.getEmpList()
    this.getPartnerDept()
    this.getNameData()
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.setOriginalValue(options)
    this.checkLoginStatus()
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
    this.getChildData()
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