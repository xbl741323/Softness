// personal/pages/my-task/list/list.js
import {
  getTaskListData,
  getEmpOption,
  editTaskList,
  batchAllot,
  editTaskData,
  submitProgress,
  getTaskFlow,
  updateEngineerName,
  getDataRole
}
from "../../../../utils/api/mytask.js"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    nameData: [],
    nameList: [],
    radio: '1',
    userInfo: {},
    priorityNumber: 2,
    information: [],
    endType: null,
    changeMessage: false,
    stateType: false,
    value: [0],
    Dialog: false,
    filterObj: [{
      text: null,
      state: 1
    }],
    parameter: [],
    getTaske: [],
    finishLabel: [{
      text: null,
      stepType: null
    }],
    stepName: null,
    mainActiveIndex: 0,
    activeId: null,
    btnstate: 1,
    getTaskOrderLsti: [],
    comment: '',
    auditRemark: '',
    auditDialog: false,
    auditRequired: false,
    scheduleList: [],
    resultUserInfo: [],
    initiator: [],
    priorityData: [],
    value: [0],
    pricekeyWords: '',
    page: {
      pageNo: 1,
      pageSize: 20,
    },
    total: 0,
    params: {},
    taskList: [],
    result: [],
    state: false,
    btnNumOne: 1,
    btnNumTow: 2,
    priorityShow: true,
    scheduleShow: true,
    priceShow: true,
    batchShow: true,
    changempList: [],
    stepType: "",
    title: '',
    priorityId: null,
    currentDate: new Date().getTime(),
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
    // 优先级
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
  },
  allotPrice() {
    this.setData({
      priceShow: false,
      pricekeyWords: ""
    })
  },
  priceClose() {
    this.setData({
      priceShow: true,
      pricekeyWords: "",
      nameList: [],
      resultUserInfo: []
    })
  },
  priorityClose() {
    this.setData({
      priorityShow: true,
    })
  },

  batchClose() {
    this.setData({
      batchShow: true,
    })
  },

  scheduleClose() {
    this.setData({
      scheduleShow: true,
    })
  },
  onChange(event) {
    this.setData({
      parameter: this.filtrateArrData(event.detail),
      result: event.detail,
    });
  },
  onUserChange(event) {
    this.setData({
      resultUserInfo: event.detail,
      nameList: this.data.nameData.filter(item => {
        return event.detail.some(value => item.userId == value)
      })
    });
  },
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
  filtrate(e) {
    this.setData({
      params: e.detail,
      page: {
        pageNo: 1,
        pageSize: 20,
      },
    })
    this.setOriginalData()
  },
  filtrateFun(data, type) {
    // this.setOriginalData()
    // debugger
    if (type == 1) {
      return data == '待开始' ? 0 : ['完成', '通过', '不通过'].includes(data) ? 2 : data == '已关闭' ? -2 : data == '已暂停' ? -1 : 1
    } else {
      if (data && data.stepId) {
        return data.stepId
      } else {
        // return Number(this.data.priorityId.stepId)
        return data.text == "已暂停" ? -1 : -2
      }
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
  /**
   * 生命周期函数--监听页面加载
   */
  setOriginalData() {
    getTaskListData({
      ...this.data.params,
      ...this.data.page
    }).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let r = res.data
        let taskList = this.data.taskList
        let reachStatus = this.data.reachStatus
        this.setData({
          taskList: reachStatus == true ? taskList.concat(r.records) : r.records,
          reachStatus: false,
          total: r.total,
          comment: '',
          state: false,
          btnNumOne: 1,
          btnNumTow: 2,
          result: null,
          btnstate: 1,
          value: [0]
        })
      }
    })
  },
  detailList(e) {
    getTaskListData({
      ...this.data.params,
      ...this.data.page
    }).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let r = res.data
        let taskList = this.data.taskList
        let reachStatus = this.data.reachStatus
        this.setData({
          taskList: reachStatus == true ? taskList.concat(r.records) : r.records,
          reachStatus: false,
          total: r.total,
        })
      }
    })
  },
  detailList(e) {
    wx.navigateTo({
      url: `/personal/pages/my-task/detail/detail?id=${e.currentTarget.dataset.item.id } &&state=${e.currentTarget.dataset.item.taskStatus}`,

    })
  },
  changeItem(val) {
    this.setData({
      showStartTime: true
    })
  },
  changeName() {
    this.setData({
      auditDialog: true,
    })
  },
  deleteClue() {
    this.setData({
      changeMessage: true
    })
  },
  filtrateArrData(arr) {
    let taskList = this.data.taskList
    let r = []
    if (arr && taskList) {
      arr.forEach(item => {
        taskList.forEach(val => {
          if (item == val.id) {
            if (this.data.btnNumOne == 1) {
              r.push({
                id: val.id,
                flowVersion: val.flowVersion,
              })
            } else {
              r.push({
                id: val.id,
                orderId: val.orderId,
                flowVersion: val.flowVersion,
                flowId: val.flowId,
                stepId: val.stepId,
                stepName: val.stepName
              })
            }
          }
        })
      })
    }
    return r
  },
  // 触底加载更多数据
  // 触底加载
  getReachList() {
    let taskList = this.data.taskList
    let total = this.data.total
    let page = this.data.page
    if (taskList.length < total) {
      page.pageNo = page.pageNo + 1
      this.setData({
        reachStatus: true,
        page: page
      })
      this.setOriginalData()
    }
  },

  batchConfirm() {
    this.setData({
      batchShow: true,
      Dialog: true
    })

  },
  priceConfirm() {
    if (this.data.resultUserInfo.length !== 0) {
      this.setData({
        priceShow: true,
        Dialog: true
      })
    } else {
      wx.showToast({
        icon: "error",
        title: '至少勾选一个工程师',
      })
    }

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
  goToPage(e) {
    let num = e.currentTarget.dataset.item
    if (num == 1) {
      if (this.data.state) {
        if (!this.data.parameter.length == 0) {
          this.getEmpList()
          this.getPartnerDept()
          this.setData({
            priceShow: false
          })
        } else {
          wx.showToast({
            icon: "error",
            title: '请至少选择一项任务',
          })
        }
      } else {
        this.setData({
          btnNumTow: 1,
          state: true
        })
      }
    } else {
      if (this.data.state) {
        let parameter = this.data.parameter
        if (!parameter.length == 0) {

          if (this.detectionType(parameter)) {
            this.setData({
              batchShow: false
            })
            this.getTaskFlowList()
          } else {
            wx.showToast({
              icon: "error",
              title: '当前所选项不归属于同一订单，请重新选择!',
            })
          }
        } else {
          wx.showToast({
            icon: "error",
            title: '请至少选择一项任务',
          })
        }
      } else {
        this.setData({
          btnNumOne: 2,
          state: true
        })
      }
    }
  },
  // 批量分配
  assignmentOfTasks(obj) {
    batchAllot(obj).then(res => {
      if (res.code == 0) {
        wx.showToast({
          icon: "success",
          title: '批量分配成功',
        })
        this.setData({
          resultUserInfo: [],
          nameList: [],
          state: false,
          btnNumOne: 1,
          btnNumTow: 2,
          radio: '1',
          pricekeyWords: ''
        })
        this.getEmpList()
        this.getPartnerDept()
        this.setOriginalData()
      } else {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
      }
    })
  },

  updateEngineer(obj) {
    updateEngineerName(obj).then(res => {
      if (res.code == 0) {
        wx.showToast({
          icon: "success",
          title: '分配成功',
        })
        this.setData({
          Dialog: false,
          radio: '1',
          resultUserInfo: [],
          nameList: [],
          pricekeyWords: ''
        })
        this.setOriginalData()
      } else {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
      }
    })
  },
  // 更改优先级
  changePriority() {
    let obj = {
      id: this.data.priorityId,
      priority: this.data.priorityData.priority
    }
    editTaskList(obj).then(res => {
      if (res.code == 0) {
        wx.showToast({
          icon: "none",
          title: '修改成功',
        })
        this.setData({
          scheduleShow: true
        })
      } else {
        wx.showToast({
          icon: "error",
          title: res.msg,
        })
      }
      this.setOriginalData()
    })
  },
  // 提交进度

  // 根据姓名获取员工
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
          loading: true,
        })
        wx.nextTick(() => {
          this.setData({
            resultUserInfo: this.data.resultUserInfo,
          })
        })
      }
    })
  },
  showClear() {
    let e = {
      detail: {
        value: ''
      }
    }
    this.changeSearch(e)
  },
  changeSearch(e) {
    this.setData({
      pricekeyWords: e.detail.value.trim(),
    })
    if (this.data.radio == 1) {
      this.getEmpList()
    } else {
      this.getPartnerDept()
    }
  },
  // 滚动切换员工
  changePicker(e) {
    this.setData({
      value: e.detail.value
    })
  },
  // 点击按钮
  toModifyOrder(e) {
    this.setData({
      scheduleShow: false,
      priorityId: e.target.dataset.item
    })
  },
  checkContract(e) {
    let params = {
      flowId: e.target.dataset.item.flowId,
      version: e.target.dataset.item.flowVersion
    }
    this.setData({
      stateType: true,
      batchShow: false,
      priorityId: e.target.dataset.item
    })
    this.getTaskFlowList(params)
  },
  confirmGenerateOrder(e) {
    this.setData({
      currentDate: new Date(e.target.dataset.item.deliveryTime).getTime() || new Date().getTime(),
      auditRemark: e.target.dataset.item.deliveryName,
      changeMessage: true,
      priorityId: e.target.dataset.item.id
    })
  },
  cahangeClose() {
    this.setData({
      changeMessage: false
    })
  },
  // 交付信息
  changRemak(e) {
    this.setData({
      auditRemark: e.detail.value
    })
  },
  // 关闭时间弹窗
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
      id: this.data.priorityId,
      deliveryTime: deliveryTime,
    }
    editTaskList(param).then(res => {
      if (res.code == 0) {
        wx.showToast({
          icon: "success",
          title: '修改成功',
        })
      } else {
        wx.showToast({
          icon: 'error',
          title: res.msg,
        })
      }
      this.setData({
        changeMessage: false,
        auditRemark: '',
        auditRequired: false
      })
      this.closeStartTime()
      this.setOriginalData()
    })
  },
  confirmAudit() {
    if (this.data.auditRemark.length < 0) {
      this.setData({
        auditRequired: true
      })
    } else {
      let param = {
        id: this.data.priorityId,
        deliveryName: this.data.auditRemark,
      }
      editTaskData(param).then(res => {
        if (res.code == 0) {
          this.setOriginalData()
          wx.showToast({
            icon: "success",
            title: '设置成功',
          })
        } else {
          wx.showToast({
            icon: 'error',
            title: res.msg,
          })
        }
      })
      this.setData({
        changeMessage: false,
        auditRemark: '',
        auditRequired: false
      })
    }

  }, // 时间格式操作
  formatDate(date) {
    date = new Date(date);
    let year = date.getFullYear()
    let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    let day = String(date.getDate()).length == 1 ? '0' + date.getDate() : date.getDate()
    return `${year}-${month}-${day} 00:00:00`;
  },
  onClose() {
    this.setData({
      auditRemark: '',
      auditRequired: false
    })
  },
  getAuditRemark(e) {
    this.setData({
      comment: e.detail.value
    })
  },
  clickClong(e) {
    this.setData({
      priorityShow: true,
      pageNo: 1,
      reachStatus: false,
    })
    let getTaskOrderLsti = this.data.getTaskOrderLsti
    let index = this.data.value[0]
    if (getTaskOrderLsti.length > 0) {
      let priorityData = this.data.priorityData
      priorityData = getTaskOrderLsti[index]
      this.setData({
        finishLabel: priorityData
      })
    }
    let btnstate = this.data.btnstate
    if (btnstate == 1) {
      this.setData({
        btnstate: 2
      })
    } else {
      this.setData({
        btnstate: 1
      })
    }
  },
  getAuditRemarkText(e) {
    this.setData({
      auditRemark: e.detail.value
    })
  },
  detectionType() {
    let taskList = this.data.taskList
    let parameter = this.data.parameter
    let r = []
    let orderNos = []
    taskList.forEach(item => {
      parameter.forEach(val => {
        if (val.id == item.id) {
          r.push(item)
          orderNos.push(item.orderNo)
        }
      })
    })
    this.setData({
      information: r
    })
    return [...new Set(orderNos)].length === 1
  },
  // 获取相同任务的提交
  getTaskFlowList(params) {
    let obj = {}
    if (params) {
      obj = params
    } else {
      let parameter = this.data.parameter
      obj = {
        version: parameter[0].flowVersion,
        flowId: parameter[0].flowId
      }
    }
    getTaskFlow(obj).then(res => {
      if (res.code == 0) {
        let endType = res.data[res.data.length - 1].finishType;
        let spalId = res.data[res.data.length - 1].id;
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
        let narr = [{
          text: '通过',
          stepName: '完成',
          finishLabel: '通过',
          stepType: 2,
          stepId: spalId
          // id: -11
        }, {
          text: '不通过',
          stepName: '完成',
          finishLabel: '不通过',
          stepType: 2,
          stepId: spalId
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
          endType: endType,
          getTaskOrderLsti: arr,
        })
      }
    })
  },
  handleConfirm(e) {
    this.getEmpList()
    this.getPartnerDept()
    this.setData({
      priceShow: false,
      priorityId: e.target.dataset.item.id,
      priorityNumber: e.target.dataset.text,
      resultUserInfo: []
    })
  },
  filterItem(arr) {
    let r = arr.map(item => ({
      id: item.id,
      orderId: item.orderId
    }))
    return r
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
  onCloseUpop(action) {
    this.setData({
      state: false,
      btnNumOne: 1,
      btnNumTow: 2
    })
  },
  confirmAuditretuer(e) {
    e.detail.dialog.stopLoading()
    if (this.data.priorityNumber == 1) {
      let resultUserInfo = this.data.resultUserInfo
      let changempList = this.data.nameData
      if (resultUserInfo) {
        this.setData({
          priceShow: true,
          pageNo: 1,
          reachStatus: false,
        })
        let r = []
        changempList.forEach(item => {
          resultUserInfo.forEach(val => {
            if (item.userId == val) {
              r.push({
                engineerId: item.userId,
                engineerNo: item.number,
                engineerName: item.name,
              })
            }
          })
        })
        let obj = {
          id: this.data.priorityId,
          trTaskEngineerList: r,
        }
        this.updateEngineer(obj)
        this.setData({
          resultUserInfo: [],
          priorityNumber: 2
        })
      }
    } else {
      if (this.data.btnstate == 1) {
        let resultUserInfo = this.data.resultUserInfo
        let changempList = this.data.nameData
        if (resultUserInfo) {
          this.setData({
            priceShow: true,
            pageNo: 1,
            reachStatus: false,
          })
          let r = []
          changempList.forEach(item => {
            resultUserInfo.forEach(val => {
              if (item.userId == val) {
                r.push({
                  engineerId: item.userId,
                  engineerNo: item.number,
                  engineerName: item.name,
                })
              }
            })
          })
          let obj = {
            trTaskEngineerList: r,
            tmOrderTaskVoList: this.data.parameter
          }
          this.assignmentOfTasks(obj)
        }
        this.setData({
          resultUserInfo: [],
          Dialog: false
        })
      } else {
        if (this.data.parameter.length == 1 || this.data.stateType) {
          if (this.data.stateType) {
            let obj = {
              stepId: this.filtrateFun(this.data.finishLabel, 2),
              description: this.data.comment,
              finishLabel: this.filtrateFun(this.data.finishLabel.stepName, 1) == 2 ? this.data.finishLabel.finishLabel : '',
              finishType: this.filtrateFun(this.data.finishLabel.text, 1) == 2 ? this.data.endType : '',
              stepName: this.data.finishLabel.stepName,
              stepType: this.filtrateFun(this.data.finishLabel.stepName, 1),
              id: this.data.priorityId.id
            }
            submitProgress(obj, 0).then(res => {
              if (res.code == 0) {
                wx.showToast({
                  icon: "error",
                  title: '提交成功',
                })
                this.setData({
                  comment: '',
                  state: false,
                  btnNumOne: 1,
                  btnNumTow: 2
                })
              } else {
                wx.showModal({
                  title: res.msg,
                })
              }
              this.setOriginalData()
            })
            this.setData({
              comment: '',
              state: false,
              btnNumOne: 1,
              btnNumTow: 2
            })
          } else {
            let bool = true
            if (bool && this.data.information.length > 0) {
              let obj = {
                stepId: this.filtrateFun(this.data.finishLabel, 2),
                description: this.data.comment,
                finishLabel: this.filtrateFun(this.data.finishLabel.stepName, 1) == 2 ? this.data.finishLabel.finishLabel : '',
                finishType: this.filtrateFun(this.data.finishLabel.text, 1) == 2 ? this.data.endType : '',
                stepName: this.data.finishLabel.stepName,
                stepType: this.filtrateFun(this.data.finishLabel.stepName, 1),
                id: this.data.parameter[0].id
              }
              submitProgress(obj, 0).then(res => {
                if (res.code == 0) {
                  wx.showToast({
                    icon: "error",
                    title: '提交成功',
                  })
                } else {
                  wx.showToast({
                    icon: "error",
                    title: res.msg,
                  })
                }
                this.setOriginalData()
              })
            } else {
              // finishLabel
              wx.showToast({
                icon: "none",
                title: '不允许的任务状态提交',
              })
            }
          }
          // }

        } else {
          let obj = {
            id: this.data.parameter[0].id,
            stepId: this.filtrateFun(this.data.finishLabel, 2),
            description: this.data.comment,
            finishLabel: this.filtrateFun(this.data.finishLabel.stepName, 1) == 2 ? this.data.finishLabel.finishLabel : '',
            finishType: this.filtrateFun(this.data.finishLabel.text, 1) == 2 ? this.data.endType : '',
            stepName: this.data.finishLabel.stepName,
            stepType: this.filtrateFun(this.data.finishLabel.stepName, 1),
          }
          submitProgress(obj, 1).then(res => {
            if (res.code == 0) {
              wx.showToast({
                icon: "error",
                title: '批量提交成功',
              })
              this.setData({
                comment: '',
                state: false,
                btnNumOne: 1,
                btnNumTow: 2
              })
            } else {
              wx.showToast({
                icon: "error",
                title: res.msg,
              })
            }
          })
          this.setOriginalData()
        }
      }
    }

  },

  changeTabData(e) {
    this.setData({
      value: e.detail.value,
      stepType: this.data.getTaskOrderLsti[e.detail.value].stepType
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
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
    this.getNameData()
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
  },
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.selectComponent('#task').getList()
    this.setOriginalData()
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
  onShareAppMessage() {

  }
})