// personal/components/my-clue/clue-item/clue-item.js
import {
  getClueDetail,
  delClue,
  receive
} from "../../../../utils/api/clue"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    highSeasType: {
      type: Number
    },
    clueInfo: {
      type: Object
    },
    contractType: {
      type: Number
    },
    clueType: {
      type: Number
    },
    isPerson: {
      type: Boolean //引用来源 true-我的线索 false-客户查询
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    highCertifyImg: '/personal/image/my-clue/certified-high.png',
    lowCertifyImg: '/personal/image/my-clue/certified-low.png',
    userInfo: {}
  },
  /**
   * 组件的方法列表
   */
  methods: {
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
    goToClueList() {},
    // 领取操作
    receiveOperate() {
      let clueType = this.data.clueType
      let clueInfo = this.data.clueInfo
      let params = {
        clueIdList: [clueType == 2 ? clueInfo.clueCompanyId : clueInfo.cluePersonId]
      }
      receive(params, this.data.clueType, this.data.highSeasType).then(res => {
        console.log(res);
        if (res.code == CodeMsg.CODE_0) {
          console.log('ssss');
          wx.showToast({
            icon: "success",
            title: '领取成功！',
          })
          this.triggerEvent('refresh')
          this.goToClueList()
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
          this.triggerEvent('refresh')
        }
      })
    },

    // 跳转到线索跟进页
    toFollow() {
      let highSeasType = this.properties.highSeasType
      let isPerson = this.data.isPerson
      let clueType = this.data.clueType
      let clueInfo = this.data.clueInfo
      let clueId = clueType == 1 ? clueInfo.cluePersonId : clueInfo.clueCompanyId
      let clueName = clueType == 1 ? clueInfo.contactName : clueInfo.companyName
      let data = JSON.stringify({
        clueId: clueId,
        clueName: clueName
      })
      if (isPerson) {
        wx.navigateTo({
          url: `/personal/pages/my-seas/detail?clueType=${clueType}&&clueInfo=${data}&&highSeasType=${highSeasType}`,
        })
      }
    },
    // 跳转到线索详情
    toClueDetail() {
      let clueType = this.data.clueType
      let clueInfo = this.data.clueInfo
      let clueId = clueType == 1 ? clueInfo.cluePersonId : clueInfo.clueCompanyId
      let highSeasType = this.data.highSeasType
      wx.navigateTo({
        url: `/personal/pages/my-seas/detail/datail?id=${clueId}&clueType=${clueType}&highSeasType=${highSeasType}`,
      })
    },
    // 跳转到发起订单页
    toGenerateOrder() {
      this.getDetail()

    },
    // 获取线索详情
    getDetail() {
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
          })
        }
      })
      wx.stopPullDownRefresh()
    },
  },
  lifetimes: {
    attached: function () {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    },
  },
})