// personal/components/my-order/product-item/product-item.js
const app = getApp();
import {
  arrToObj
} from "../../../../utils/order/order"
import {
  getClueDetail
} from "../../../../utils/api/clue"
import {
  updateOrderStatus,
  getModifyOrderDetail,
  validateListAudit
} from "../../../../utils/api/order"
import {
  closeOrder,
  delOrder,
  getOrderTaskStatus,
  getAuditor,
  amendTaskState,
  sendTaskState
} from "../../../../utils/api/order"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    typePr: {
      type: String,
      value: 'sys_order_detail_product_my'
    },
    taskData: {
      type: Object,
      value: []
    },
    orderInfo: {
      type: Object
    },
    pageFrom: { // 来源页面 0-产品列表 3-待生效订单列表 4-订单详情
      type: Number,
      value: 0
    },
    orderType: { // 订单类型 0-产品订单 3-待生效订单
      type: Number,
      value: 0
    },
    disabled: { // 是否失效 true-失效 false-正常
      type: Boolean,
      value: false
    },
    auditStatus: { // 是否对公转账审核中
      type: Boolean,
      value: false
    },
    openData: {
      type: Object,
      value: {}
    },
    filterValue: {
      type: String,
      value: '产品'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    permissions: {},
    taskOpenState: false,
    auditor: null,
    auditRemark: null,
    taskShow: false,
    taskBool: false,
    imageUrl: app.globalData.imageURL,
    contractUrl: app.globalData.fadadaUrl,
    optionsList: [1, 2, 3, 4, 5, 67, 78]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getAuditRemark(e) {
      this.setData({
        auditRemark: e.detail.value
      })
    },
    chooseList(e) {
      console.log(e);
      this.setData({
        auditor: e.detail
      })
    },
    getAuditorFn() {
      let data = {
        orderId: this.data.orderInfo.id,
        changePriceStatus: this.data.orderInfo.changePriceStatus
      }
      sendTaskState(data).then()
      getAuditor().then(res => {
        if (res.code == CodeMsg.CODE_0) {
          this.setData({
            optionsList: res.data
          })
          console.log(this.data.optionsList);
        }
      })
    },
    // 开启任务
    submitTask() {
      if (this.data.auditor) {
        let data = {
          preAuditorId: this.data.auditor.userId,
          preAuditorName: this.data.auditor.name,
          remark: this.data.auditRemark,
          flowNo: this.data.orderInfo.clueNo,
          orderId: this.data.orderInfo.id
        }
        amendTaskState(data).then(res => {
            if (res.code == CodeMsg.CODE_0) {
              wx.showToast({
                icon: "success",
                title: '发起审批成功',
              })
            } else {
              wx.showToast({
                icon: "none",
                title: res.msg,
              })
            }
          }),
          this.triggerEvent('parentComponentFunction');
        this.onClose()
      } else {
        wx.showToast({
          title: '请选择审核人',
          icon: 'error'
        })
      }
    },
    openTaskFn() {
      this.getAuditorFn()
      this.setData({
        taskShow: true
      })
    },
    onClose() {
      this.setData({
        taskShow: false,
        auditRemark: null,
        optionsList: [],
        auditor: null
      });
      this.selectComponent('#selector').removerName()
    },
    // 跳转到上传支付凭证页面
    toPayVoucher() {
      let orderInfo = this.data.orderInfo
      let data = {
        categoryId: orderInfo.categoryId,
        orderNo: orderInfo.orderNo,
        payAmount: this.transPayVal(orderInfo),
        orderPort: orderInfo.orderPort,
        addressId: orderInfo.addressId,
        paymentId: orderInfo.waitPayment.id,
      }
      let params = JSON.stringify(data)
      wx.navigateTo({
        url: `/personal/pages/my-order/pay-voucher/pay-voucher?orderInfo=${params}`,
      })
    },
    // 判断获取当前应付金额
    transPayVal(row) {
      // 首先判断定金尾款还是一次性付款类型
      if (row.tailStatus == 3) {
        return row.totalAmount
      } else {
        // 其次判断定金是否已支付
        return row.waitPayment.payAmount
      }
    },
    // 查看合同
    checkContract() {
      let contractFileUrl = this.data.orderInfo.contractFileUrl
      if (contractFileUrl.indexOf('https://testapi.fadada.com:8443') != -1) {
        let newUrl = contractFileUrl.replace('https://testapi.fadad2a.com:8443', this.data.contractUrl)
        wx.setStorageSync('fadaUrl', newUrl)
        wx.navigateTo({
          url: `/pagesFace/pages/webview/webview`,
        })
      } else {
        let url = this.data.imageUrl + contractFileUrl
        this.downloadContract(url)
      }
    },
    // 下载合同
    downloadContract(url) {
      wx.showLoading({
        title: '加载中...',
      })
      wx.downloadFile({
        url: url,
        success: function (res) {
          var filePath = res.tempFilePath;
          let fileType = filePath.slice(filePath.indexOf('.') + 1)
          wx.openDocument({
            filePath: filePath,
            fileType: `${fileType}`,
            showMenu: true,
            success: () => {
              wx.hideLoading({
                success: (res) => {},
              })
            }
          })
        }
      })
    },
    // 跳转到查看合同页面
    toShowContract(url) {
      wx.navigateTo({
        url: `/personal/pages/my-order/detail/show-contract/show-contract?url=${url}`,
      })
    },
    // 检查该订单是否有待审核的开启任务流程
    checkOrder() {
      let orderId = this.data.orderInfo.id
      getOrderTaskStatus(orderId).then(res => {
        if (res.code == -1) {
          wx.showToast({
            icon: 'none',
            title: '该订单有待审核的开启任务流程，无法改价！',
          })
        } else {
          this.toModifyOrder()
        }
      })
    },
    // 跳转到订单改价页面
    toModifyOrder() {
      let orderId = this.data.orderInfo.id
      getModifyOrderDetail({
        orderId: orderId
      }).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          wx.navigateTo({
            url: `/personal/pages/my-order/modify-price/modify-price?orderId=${orderId}`,
          })
        } else {
          wx.showToast({
            icon: "none",
            title: res.msg,
          })
        }
      })
    },
    // 发起订单提示
    confirmGenerateOrder() {
      let that = this
      wx.showModal({
        title: "确定发起订单？",
        cancelColor: "#A5A5A5",
        cancelText: "取消",
        confirmColor: "#0082FC",
        confirmText: "确定",
        success(res) {
          if (res.confirm) {
            let params = {
              id: that.data.orderInfo.id
            }
            that.generateNewOrder(params)
          } else if (res.cancel) {}
        }
      })
    },
    // 校验订单是否需要选择审核
    validateAudit() {
      let params = {
        orderId: this.data.orderInfo.id
      }
      validateListAudit(params).then(res => {
        if ((res.code == CodeMsg.CODE_0) && (res.data == true)) { // 校验通过
          this.confirmGenerateOrder()
        } else if (res.code == CodeMsg.CODE_777) {
          wx.showToast({
            icon: 'none',
            title: res.msg,
          })
        } else { // 需要审核
          this.triggerEvent('showAudit', this.data.orderInfo)
        }
      })
    },
    // 生成订单
    generateNewOrder(params) {
      updateOrderStatus(params).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          wx.showToast({
            icon: "success",
            title: '操作成功！',
          })
          this.triggerEvent('refresh')
        }
      })
    },
    // 操作提示
    handleConfirm(e) {
      let type = e.currentTarget.dataset.type
      let that = this
      wx.showModal({
        content: type == 0 ? "确认删除？" : "确认关闭？",
        cancelColor: "#999999",
        cancelText: "取消",
        confirmColor: "#36A6FE",
        confirmText: "确定",
        success(res) {
          if (res.confirm) {
            let params = {
              orderId: that.data.orderInfo.id
            }
            type == 0 ? that.handleDelOrder(params) : that.handleCloseOrder(params)
          } else if (res.cancel) {}
        }
      })
    },
    // 关闭草稿订单
    handleCloseOrder(params) {
      closeOrder(params).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          wx.showToast({
            icon: "success",
            title: '操作成功！',
          })
          this.triggerEvent('refresh')
        }
      })
    },
    // 删除失效订单
    handleDelOrder(params) {
      delOrder(params).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          wx.showToast({
            icon: "success",
            title: '操作成功！',
          })
          this.triggerEvent('refresh')
        }
      })
    },
    // 复制链接
    copyText(e) {
      console.log(this.data.orderInfo);
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
    // 跳转到订单详情
    toOrderDetail() {
      let pageFrom = this.data.pageFrom
      if (pageFrom == 0 || pageFrom == 3) {
        let orderInfo = this.data.orderInfo
        let pageFrom = this.data.pageFrom
        let openData = JSON.stringify(orderInfo)
        wx.navigateTo({
          url: `/personal/pages/my-order/detail/product-order/product-order?orderId=${orderInfo.id}&&orderType=${pageFrom}&&openData${openData}`,
        })
      }
    },
    // 跳转到草稿订单编辑页面
    toEditOrder() {
      this.getDetail()
    },
    // 获取线索详情
    getDetail() {
      let orderInfo = this.data.orderInfo
      let clueType = orderInfo.clueType
      let params = clueType == 1 ? {
        cluePersonId: orderInfo.clueId
      } : {
        clueCompanyId: orderInfo.clueId
      }
      getClueDetail(params, clueType, true).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          let data = JSON.stringify(res.data)
          wx.navigateTo({
            url: `/personal/pages/my-order/generate-order/edit/edit?clueType=${clueType}&&clueInfo=${data}&orderId=${orderInfo.id}`,
          })
        } else {
          wx.showToast({
            icon: "none",
            title: res.msg,
          })
        }
      })
    },
  },
  lifetimes: {
    attached: function () {
      // 开启任务
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        permissions: arrToObj()
      })
      let orderInfo = this.data.orderInfo
      if (orderInfo) {
        if (orderInfo.orderStatus != 0) {} else {
          if (orderInfo.tailStatus != 3) {} else if (orderInfo.changePriceStatus && orderInfo.changePriceStatus == 1) {} else {
            this.setData({
              taskOpenState: true
            })
          }
        }
      }
    },
  },
})