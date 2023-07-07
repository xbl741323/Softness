// personal/pages/my-contract/enter-contract/enter-contract.js
const app = getApp();
import {
  getContractHeadNo,
  getContractApprover,
  enterContract,
  getContractDetail,
  getContractOrder
} from "../../../../utils/api/contract"
import * as CodeMsg from "../../../../utils/common/codeMsg";
import {
  throttle
} from "../../../../utils/common/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMore: false, // 控制展示全部订单
    contractInfo: {}, // 获取草稿合同详情数据
    isEdit: false, // 是否是编辑状态 true-是 false-否
    id: null, // 编辑回显合同id
    isDraft: false, // 是否为草稿
    accessInfo: {},
    showCalendar: false,
    pageForm: 0, // 来源页面 0-我的合同 1-我的线索（列表、详情）
    clueLabelList: ['线索编号', '线索名称', '联系人', '手机号', '业务员'],
    clueInfo: null, // 线索信息
    orderList: [], // 选择的订单列表
    activeContractIndex: null, // 合同抬头下标
    contractHeadList: [], // 合同编号抬头列表
    contractHeadValue: "", // 合同编号抬头自定义值
    contractHeadValueError: false, // 合同编号抬头校验
    contractFileList: [], // 合同附件列表
    signManInfo: { // 签约人信息
      contactName: "",
      contactPhone: "",
      signTime: "",
      orderRemark: ""
    },
    signPhoneError: false, // 电话格式校验
    customerInfo: {
      legalPersonName: "", // 法人姓名
      legalPersonPhone: "", // 法人手机号
      treasurerName: "", // 财务主管姓名
      treasurerPhone: "", // 财务主管姓名
    }, // 补充客户信息
    approverInfo: { // 审批人信息
      id: "",
      name: "",
    },
    approverList: [], // 审批人列表
    currentDate: new Date().getTime(),
    minDate: new Date(2021, 1, 1).getTime(),
    maxDate: new Date().getTime(),
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
      if (type === 'hour') {
        return `${value}时`;
      }
      if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    },
  },
  // 控制展示订单列表
  changeShowMore() {
    this.setData({
      showMore: !this.data.showMore
    })
  },
  // 时间格式操作
  formatDate(date) {
    date = new Date(date);
    let year = date.getFullYear()
    let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    let day = String(date.getDate()).length == 1 ? '0' + date.getDate() : date.getDate()
    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
    let minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    return `${year}-${month}-${day} ${hour}:${minute}:00`;
  },
  // 确定选择时间
  onConfirm(e) {
    let date = e.detail
    let signManInfo = this.data.signManInfo
    signManInfo.signTime = this.formatDate(date)
    this.setData({
      signManInfo: signManInfo
    })
    this.onClose()
  },
  // 关闭时间弹窗
  onClose() {
    this.setData({
      showCalendar: false
    })
  },
  // 展示时间弹窗
  bindShow() {
    this.setData({
      showCalendar: true
    })
  },
  // 修改签约人信息
  changeSignInfo(e) {
    let signManInfo = this.data.signManInfo
    let type = e.currentTarget.dataset.type
    let val = e.detail.value.trim()
    switch (Number(type)) {
      case 0:
        signManInfo.contactName = val
        break
      case 1:
        signManInfo.orderRemark = val
        break
    }
    this.setData({
      signManInfo: signManInfo
    })
  },
  // 修改签约人电话
  changeSignPhone(e) {
    let signManInfo = this.data.signManInfo
    let val = e.detail.value.trim()
    signManInfo.contactPhone = val
    if ((/^((0\d{2,3}-?\d{7,9})|(1[3465789]\d{9}))$/).test(val)) {
      this.setData({
        signManInfo: signManInfo,
        signPhoneError: false
      })
    } else {
      this.setData({
        signManInfo: signManInfo,
        signPhoneError: true
      })
      wx.showToast({
        icon: "none",
        title: '请输入正确的联系电话(固话须加区号)！',
      })
    }
  },
  // 修改自定义合同编号抬头值
  changeHeadVal(e) {
    let val = e.detail.value.trim()
    if ((Number(val) != 0) && (/^[A-Z]{1,10}$/).test(val)) {
      this.setData({
        contractHeadValueError: false
      })
    } else {
      this.setData({
        contractHeadValueError: true
      })
      wx.showToast({
        icon: "none",
        title: '请输入正确的合同编号抬头，最多十个大写字母！',
      })
    }
    this.setData({
      contractHeadValue: val,
    })
  },
  // 跳转到选择线索页面
  toSelectClue() {
    wx.navigateTo({
      url: '/personal/pages/my-contract/select-clue/select-clue',
    })
  },
  // 跳转到选择订单页面
  toSelectOrder() {
    let clueInfo = this.data.clueInfo
    if (clueInfo != null) {
      let clueType = clueInfo.clueType
      let clueId = clueInfo.clueId
      wx.navigateTo({
        url: `/personal/pages/my-contract/select-order/select-order?clueType=${clueType}&&clueId=${clueId}`,
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '尚无线索信息，无法添加订单！',
      })
    }
  },
  // 修改合同抬头下标
  changeContractHead(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      activeContractIndex: index,
      contractHeadValue: ""
    })
  },
  // 录入合同选择产品赋值
  setSelectOrder() {
    if (wx.getStorageSync('contractSelectOrder')) {
      let orderList = wx.getStorageSync('contractSelectOrder')
      this.setData({
        orderList: orderList
      })
    }
  },
  // 录入合同选择线索赋值
  setSelectClue() {
    if (wx.getStorageSync('contractSelectClue')) {
      let clueInfo = this.data.clueInfo
      let info = wx.getStorageSync('contractSelectClue')
      console.log(info, 'infoinfo')
      let signManInfo = this.data.signManInfo
      signManInfo.contactName = info.contactName
      signManInfo.contactPhone = info.mobile
      this.setData({
        clueInfo: info,
        signManInfo: signManInfo
      })
      if (clueInfo != null && (clueInfo.clueId != info.clueId)) {
        wx.removeStorageSync('contractSelectOrder')
        this.setData({
          orderList: []
        })
      } else {
        console.log('回显订单信息')
        this.setSelectOrder()
      }
    } else {
      this.setSelectOrder()
    }
  },
  // 设置补充客户信息
  setCustomerInfo() {
    if (wx.getStorageSync('fixCustomerInfo')) {
      let customerInfo = wx.getStorageSync('fixCustomerInfo')
      this.setData({
        customerInfo: customerInfo
      })
    }
  },
  // 删除已选产品
  delProduct(e) {
    let id = e.currentTarget.dataset.item.id
    this.commonDelPro(id)
  },
  // 公共删除已选产品
  commonDelPro(id) {
    if (wx.getStorageSync('contractSelectOrder')) {
      let orderList = wx.getStorageSync('contractSelectOrder')
      orderList.forEach((item, index) => {
        if (item.id == id) {
          orderList.splice(index, 1)
        }
      })
      wx.setStorageSync('contractSelectOrder', orderList)
      this.setData({
        orderList: orderList,
      })
    } else {
      let orderList = this.data.orderList
      orderList.forEach((item, index) => {
        if (item.id == id) {
          orderList.splice(index, 1)
        }
      })
      this.setData({
        orderList: orderList,
      })
    }
  },
  // 从线索页面录入合同clueInfo赋值
  setClueInfo(options) {
    if (options.clueInfo) {
      let signManInfo = this.data.signManInfo
      let info = JSON.parse(options.clueInfo)
      console.log(info, 'info')
      if (info.contactName) {
        signManInfo.contactName = info.contactName
        signManInfo.contactPhone = info.mobile
      } else {
        signManInfo.contactName = info.clueCompanyContactList[0].contactName
        signManInfo.contactPhone = info.clueCompanyContactList[0].mobile
      }
      this.setData({
        pageForm: options.pageForm,
        clueInfo: info,
        signManInfo: signManInfo
      })
    }
  },
  // 获取合同编号抬头
  getContractHeadData() {
    getContractHeadNo().then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let r = res.data
        r.push({
          label: "自定义",
          labelDesc: ''
        })
        this.setData({
          contractHeadList: res.data
        })
      }
    })
  },
  // 获取合同审批人列表
  getContractApproverData() {
    getContractApprover().then(res => {
      if (res.code == CodeMsg.CODE_0) {
        this.setData({
          approverList: res.data,
        })
        if (res.data.length == 1) {
          let approverInfo = {
            id: res.data[0].userId,
            name: res.data[0].name
          }
          this.setData({
            approverInfo: approverInfo,
          })
        }
      }
    })
  },
  // 修改审批人
  changeApprover(e) {
    let index = Number(e.detail.value)
    let approverInfo = this.data.approverInfo
    let approverList = this.data.approverList
    approverInfo.id = approverList[index].userId
    approverInfo.name = approverList[index].name
    this.setData({
      approverInfo: approverInfo,
    })
  },
  // 合同附件选择文件
  chooseFile() {
    let that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        // tempFilePath可以作为 img 标签的 src 属性显示图片
        let file = res.tempFiles[0]
        let startIndex = file.path.indexOf('.')
        let fileName = file.name
        let fileType = file.path.slice(startIndex + 1)
        let fileSize = file.size
        if (fileType == 'pdf') {
          if (fileSize <= 20 * (1024 * 1024)) {
            that.uploadImage(file, fileName)
          } else {
            wx.showToast({
              icon: 'none',
              title: '文件大小不能超过20M！',
            })
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '请选择pdf格式的文件！',
          })
        }
      }
    })
  },
  uploadImage(item, name) {
    wx.showLoading({
      title: '上传中，请稍等',
    })
    let contractFileList = []
    let that = this
    wx.uploadFile({
      filePath: item.path,
      name: 'multipartFile', //后台接收图片的字段
      url: app.globalData.baseURL + "/wtess/paperContract/upLoadClueFollowFile",
      method: "post",
      header: {
        "Content-Type": "multipart/form-data",
        'Authorization': 'Bearer ' + that.data.accessInfo.access_token,
      },
      success(res) {
        let result = JSON.parse(res.data)
        if (result.code == CodeMsg.CODE_0) {
          contractFileList.push({
            name: name,
            url: result.data.url,
          })
          that.setData({
            contractFileList: contractFileList
          })
          wx.hideLoading({
            success: (res) => {},
          })
        }
      }
    })
  },
  // 清空合同附件
  delContractFile() {
    this.setData({
      contractFileList: [],
    })
  },
  // 保存草稿/提交审核 0-保存草稿 1-提交审核
  handelOperate: throttle(function (e) {
    let that = this
    let status = e.currentTarget.dataset.type
    that.setData({
      isDraft: status
    })
    that.validateEnterContract()
  }, 2000),
  // 录入合同必填项校验
  validateEnterContract() {
    let signManInfo = this.data.signManInfo
    let activeContractIndex = this.data.activeContractIndex
    let contractHeadList = this.data.contractHeadList
    let contractHeadValue = this.data.contractHeadValue
    let isDraft = this.data.isDraft
    let isEdit = this.data.isEdit
    let validError = false
    let msg = ''
    if (this.data.clueInfo == null) {
      validError = true
      msg = "请选择线索！"
    } else if ((this.data.orderList.length == 0) && (!isDraft)) {
      validError = true
      msg = "请选择订单！"
    } else if (activeContractIndex == null && (!isEdit)) {
      validError = true
      msg = "请选择合同编号抬头！"
    } else if ((activeContractIndex == (contractHeadList.length - 1)) && ((Number(contractHeadValue) == 0) || (this.data.contractHeadValueError)) && (!isEdit)) {
      validError = true
      msg = "请输入正确的合同编号抬头，最多十个大写字母！"
    } else if ((signManInfo.contactName == '' || signManInfo.contactPhone == '' || signManInfo.signTime == '') && (!isDraft)) {
      validError = true
      msg = "请将签约人信息补充完整！"
    } else if (this.data.signPhoneError && (!isDraft)) {
      validError = true
      msg = "请输入正确的联系电话(固话须加区号)！"
    } else if ((this.data.contractFileList.length == 0) && (!isDraft)) {
      validError = true
      msg = "请上传合同附件！"
    } else if ((this.data.approverInfo.id == '') && (!isDraft)) {
      validError = true
      msg = "请选择审批人！"
    }
    if (validError) {
      wx.showToast({
        icon: "none",
        title: msg,
      })
    } else {
      this.enterContractData()
    }
  },
  // 筛选订单id
  filterOrderId() {
    let orderList = this.data.orderList
    let idList = []
    if (orderList.length > 0) {
      orderList.forEach(item => {
        idList.push(item.id)
      })
    }
    return idList
  },
  // 返回录入合同参数
  returnContractParam() {
    let contractHeadValue = this.data.contractHeadValue
    let contractFileList = this.data.contractFileList
    let params = {
      id: this.data.id,
      isDraft: this.data.isDraft, // 草稿状态 true-草稿 false-正常
      clueId: this.data.clueInfo.clueId, // 线索id
      clueType: this.data.clueInfo.clueType, // 线索类型 2-单位 1-个人
      salesmanEmpId: this.data.clueInfo.clueSalesmanEmpId, // 线索业务员id
      orderIdList: this.filterOrderId(), // 订单id集合
      signUrl: contractFileList.length > 0 ? this.data.contractFileList[0].url : "", // 合同附件url
      contractName: contractFileList.length > 0 ? this.data.contractFileList[0].name : "", // 合同附件名称
      signName: this.data.signManInfo.contactName, // 签约人姓名
      signMobile: this.data.signManInfo.contactPhone, // 签约人手机号
      signTime: this.data.signManInfo.signTime, // 签约时间
      remark: this.data.signManInfo.orderRemark, // 合同备注
      handlerId: this.data.approverInfo.id, // 审批人id
      handlerName: this.data.approverInfo.name, // 审批人姓名
    }
    if (this.data.customerInfo.legalPersonName != '') {
      params.legalName = this.data.customerInfo.legalPersonName, // 法人姓名
        params.legalMobile = this.data.customerInfo.legalPersonPhone, // 法人手机号
        params.treasurerName = this.data.customerInfo.treasurerName, // 财务主管名称
        params.treasurerMobile = this.data.customerInfo.treasurerPhone // 财务主管手机号
    }
    if (this.data.isEdit) {
      params.contractNoHead = this.data.contractInfo.contractNo
    } else {
      let activeContractIndex = this.data.activeContractIndex
      let chooseHeadValue = this.data.contractHeadList[activeContractIndex].label
      params.contractNoHead = contractHeadValue != '' ? contractHeadValue : chooseHeadValue // 合同编号抬头
    }
    return params
  },
  // 录入合同
  enterContractData() {
    let params = this.returnContractParam()
    enterContract(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        wx.showToast({
          icon: "none",
          title: this.data.isDraft ? "保存草稿成功！" : "提交审核成功！",
        })
        wx.removeStorageSync('contractSelectOrder')
        wx.removeStorageSync('contractSelectClue')
        wx.removeStorageSync('fixCustomerInfo')
        setTimeout(() => {
          wx.navigateTo({
            url: '/personal/pages/my-contract/list/index',
          })
        }, 500)
      } else if (res.code == CodeMsg.CODE_4002) {
        wx.navigateTo({
          url: '/personal/pages/my-contract/add-customer-info/add-customer-info',
        })
      } else {
        wx.showToast({
          icon: "none",
          title: res.msg,
        })
      }
    })
  },
  // 草稿合同进入修改赋值
  setContractId(options) {
    if (options.id) {
      this.setData({
        id: options.id,
        isEdit: true
      })
      this.getContractData()
    }
  },
  // 获取草稿合同详情数据
  getContractData() {
    let params = {
      id: this.data.id
    }
    getContractDetail(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        this.setData({
          contractInfo: res.data
        })
        this.setEditVal()
      }
    })
  },
  // 获取订单列表
  getOrderList() {
    let contractInfo = this.data.contractInfo
    if (Number(contractInfo.orderIdList) != 0) {
      let params = contractInfo.orderIdList
      getContractOrder(params).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          this.setData({
            orderList: res.data
          })
        }
      })
    }
  },
  // 编辑数据回显
  setEditVal() {
    // 回显线索信息
    this.setEditClueInfo()
    // 回显订单信息
    this.setEditOrderList()
    // 回显签约人信息
    this.setEditSignManInfo()
    // 回显合同附件信息
    this.setEditContractFileList()
    // 回显审批人信息
    this.setEditApproverInfo()
  },
  setEditClueInfo() {
    let contractInfo = this.data.contractInfo
    let clueInfo = {
      clueId: contractInfo.clueId,
      clueNo: contractInfo.clueNo,
      clueType: contractInfo.clueType,
      companyName: contractInfo.authName,
      contactName: contractInfo.contactName,
      mobile: contractInfo.mobile,
      clueSalesmanEmpName: contractInfo.clueSalesmanEmpName,
    }
    this.setData({
      clueInfo: clueInfo
    })
  },
  setEditOrderList() {
    this.getOrderList()
  },
  setEditSignManInfo() {
    let contractInfo = this.data.contractInfo
    let signManInfo = {
      contactName: Number(contractInfo.signName) != 0 ? contractInfo.signName : "",
      contactPhone: Number(contractInfo.signMobile) != 0 ? contractInfo.signMobile : "",
      signTime: Number(contractInfo.signTime) != 0 ? contractInfo.signTime : "",
      orderRemark: Number(contractInfo.remark) != 0 ? contractInfo.remark : "",
    }
    this.setData({
      signManInfo: signManInfo
    })
  },
  setEditContractFileList() {
    let contractInfo = this.data.contractInfo
    if (Number(contractInfo.signUrl) != 0) {
      let contractFileList = [{
        name: contractInfo.contractName,
        url: contractInfo.signUrl,
      }]
      this.setData({
        contractFileList: contractFileList
      })
    }
  },
  setEditApproverInfo() {
    let contractInfo = this.data.contractInfo
    if (Number(contractInfo.handlerId) != 0) {
      let approverInfo = {
        id: contractInfo.handlerId,
        name: contractInfo.handlerName
      }
      this.setData({
        approverInfo: approverInfo
      })
    }
  },
  // 显示员工选择框
  showEmpSheet() {
    this.selectComponent('#query-emp').show()
  },
  // 选择员工
  selectEmp(e) {
    let info = e.detail
    let approverInfo = {
      id: info.userId,
      name: info.name,
    }
    this.setData({
      approverInfo: approverInfo
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      accessInfo: wx.getStorageSync('accessInfo'),
    })
    this.setClueInfo(options)
    this.getContractHeadData()
    this.getContractApproverData()
    this.setContractId(options)
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
    this.setSelectClue()
    this.setCustomerInfo()
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
    wx.removeStorageSync('contractSelectOrder')
    wx.removeStorageSync('contractSelectClue')
    wx.removeStorageSync('fixCustomerInfo')
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