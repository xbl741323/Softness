// personal/components/my-order/audit-tip/audit-tip.js
import {
  getAuditMan
} from "../../../../utils/api/order"
import * as CodeMsg from "../../../../utils/common/codeMsg";
import {
  throttle
} from "../../../../utils/common/utils"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageForm: { // 0-发起订单 1-订单改价
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: true,
    auditIndex: 0,
    auditManInfo: { // 审核人信息
      name: ''
    },
    auditRemark: '', // 提示审核人备注
    auitManList: [{
        name: '胡桃',
      },
      {
        name: '甘雨',
      },
      {
        name: '七七',
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 重置默认值
    resetVal() {
      let auditManInfo = this.data.auditManInfo
      auditManInfo.name = ''
      this.setData({
        auditManInfo: auditManInfo,
        auditRemark: ''
      })
    },
    // 关闭弹窗
    closeTip() {
      this.setData({
        show: true
      })
    },
    // 显示弹窗
    showTip() {
      this.setData({
        show: false
      })
    },
    // 修改备注
    changeRemark(e) {
      console.log(e)
      let val = e.detail.value.trim()
      this.setData({
        auditRemark: val
      })
    },
    // 修改审核人
    changeAuditMan(e) {
      let index = Number(e.detail.value)
      let auitManList = this.data.auitManList
      let auditManInfo = this.data.auditManInfo
      auditManInfo = auitManList[index]
      this.setData({
        auditIndex: index,
        auditManInfo: auditManInfo
      })
    },
    // 提交审核
    submitAudit: throttle(function () {
      let auditManInfo = this.data.auditManInfo
      if (Number(auditManInfo.name) == 0) {
        wx.showToast({
          icon: 'none',
          title: '已发生改价，请选择改价审核人！',
        })
      } else {
        let params = {
          auditManInfo: this.data.auditManInfo,
          auditRemark: this.data.auditRemark
        }
        this.triggerEvent('submitAudit', params)
      }
    }, 2000),
    // 获取审核人列表
    getAuditList() {
      getAuditMan().then(res => {
        if (res.code == CodeMsg.CODE_0) {
          this.setData({
            auitManList: res.data
          })
        }
      })
    }
  },
  pageLifetimes: {
    show() {
      this.getAuditList()
      console.log('显示了')
    }
  }
})