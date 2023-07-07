// personal/components/my-clue/clue-item/clue-item.js
import {
  getClueDetail,
  delClue,
  receiveForMy,
  validateCreateOrder,
  getMyCreateCompanyAuthVo
} from "../../../../utils/api/clue"
import {
  throttle,
} from "../../../../utils/common/utils"
import {
  arrToObj
} from "../../../../utils/order/order"
import * as CodeMsg from "../../../../utils/common/codeMsg";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    clueInfo: {
      type: Object
    },
    clueType: { // 线索类型 1-个人 2-单位
      type: Number
    },
    isPerson: {
      type: Boolean // 引用来源 true-我的线索 false-客户查询
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    highCertifyImg: '/personal/image/my-clue/certified-high.png',
    lowCertifyImg: '/personal/image/my-clue/certified-low.png',
    permissions: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 发起认证
    launchApprove(e) {
      let data = this.data.clueInfo
      let clueType = e.currentTarget.dataset.cluetype // 1 个人 2 单位
      let clueId = clueType==2? data.clueCompanyId : data.cluePersonId
      // certifiedLabel 0 未认证 1 初级认证 2高级认证
      let warnTxt = data.certifiedLabel == 1 ? '该客户信用代码已完成初级认证！' : data.certifiedLabel == 2 ? '该客户信用代码已完成高级认证！' : '该客户暂不可选，具体情况咨询管理人员！'
      getMyCreateCompanyAuthVo(clueId, clueType).then(res => {
        if (res.code != CodeMsg.CODE_0) {
          // 修改wx.showToast当title文字超出两行时会显示省略号问题
          this.triggerEvent("itemChange", {
            isShow: true,
            tipText: res.msg
          });
          setTimeout(() => {
            this.triggerEvent("itemChange", {
              isShow: false,
              tipText: res.msg
            });
          }, 1500)
          return false
        }
        if (data.certifiedLabel != 0) {
          wx.showToast({
            icon: "none",
            title: warnTxt,
            duration: 1000
          })
        }
        this.triggerEvent("itemChange", {
          authTypeDialog: true,
          clueId: clueId,
          clueType: clueType // 1 个人 2 单位
        });
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
    // 分配 type：0-分配线索归属 1-分配业务员
    allot(e) {
      let type = e.currentTarget.dataset.type
      let clueType = this.data.clueType
      let clueInfo = this.data.clueInfo
      let id = clueType == 2 ? clueInfo.clueCompanyId : clueInfo.cluePersonId
      let obj = {
        type: type,
        id: id
      }
      this.triggerEvent('showAllot', obj)
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

    throttleSubmit: throttle(function () {
      this.showOrderDetal()
    }, 2000),

    // 查看订单
    showOrderDetal() {
      this.triggerEvent('getOrderDetail', this.data.clueType == 2 ? this.data.clueInfo.clueCompanyId : this.data.clueInfo.cluePersonId)
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
            duration: 1000
          })
          this.triggerEvent('refresh')
        } else {
          wx.showToast({
            icon: "none",
            title: res.msg,
            duration: 1000
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
            duration: 1000
          })
          this.triggerEvent('refresh')
        }
      })
    },
    // 打电话
    phoneCall(e) {
      let phone = e.currentTarget.dataset.phone
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    },
    // 跳转到线索跟进页
    toFollow() {
      let isPerson = this.data.isPerson
      let clueType = this.data.clueType
      let clueInfo = this.data.clueInfo
      let clueId = clueType == 1 ? clueInfo.cluePersonId : clueInfo.clueCompanyId
      let clueName = clueType == 1 ? clueInfo.contactName : clueInfo.companyName
      let data = JSON.stringify({
        clueId: clueId,
        clueNo: clueInfo.clueNo,
        clueType: clueType,
        clueName: clueName,
      })
      if (isPerson) {
        wx.navigateTo({
          url: `/personal/pages/my-clue/follow/follow?clueType=${clueType}&&clueInfo=${data}`,
        })
      }
    },
    // 跳转到线索详情
    toClueDetail() {
      let isPerson = this.data.isPerson
      let clueType = this.data.clueType
      let clueInfo = this.data.clueInfo
      let clueId = clueType == 1 ? clueInfo.cluePersonId : clueInfo.clueCompanyId
      let certifiedLabel = clueInfo.certifiedLabel
      if (isPerson) {
        wx.navigateTo({
          url: `/personal/pages/my-clue/detail/detail?id=${clueId}&clueType=${clueType}&certifiedLabel=${certifiedLabel}`,
        })
      }
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
      let clueInfo = this.data.clueInfo
      let isPerson = this.data.isPerson
      let clueType = this.data.clueType
      let params = clueType == 1 ? {
        cluePersonId: clueInfo.cluePersonId
      } : {
        clueCompanyId: clueInfo.clueCompanyId
      }
      getClueDetail(params, clueType, isPerson).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          let data = JSON.stringify(res.data)
          wx.navigateTo({
            url: `/personal/pages/my-order/generate-order/add/add?clueType=${clueType}&&clueInfo=${data}`,
          })
        } else {
          wx.showToast({
            icon: "none",
            title: res.msg,
            duration: 1000
          })
        }
      })
    },
  },
  lifetimes: {
    attached() {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        permissions: arrToObj(),
      })
    }
  }
})