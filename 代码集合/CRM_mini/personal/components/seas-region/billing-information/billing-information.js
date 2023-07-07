// personal/components/seas-region/billing-information/billing-information.js
const app = getApp();
import {
  getFollowUp
} from '../../../../utils/api/seas'
import {
  filterFollowType
} from "../../../../utils/clue/clue"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    clueInfo: {
      type: Object
    },
    userInfo: {
      type: Object
    },
    clueType: {
      type: Number
    },
    clueId: {
      type: Number
    },
    highSeasType: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    env: __wxConfig.envVersion,
    reachStatus: false,
    imageUrl: app.globalData.imageURL,
    FollowUpListArr: [],
    total: 0,
    pageNo: 1,
    pageSize: 20
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 查看图片-待对接
    previewImg() {
      let item = e.currentTarget.dataset.item
      wx.previewImage({
        urls: [this.data.imageUrl + item.pictureUrl] // 需要预览的图片http链接列表
      })
    },
    getList() {
      let highSeasType = this.data.highSeasType
      let param = {
        key: "",
        clueType: this.data.clueType,
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize
      }
      // 集团公海
      if (highSeasType == 2) {
        param.userId = this.data.clueInfo.userId
      }
      // 地区公海
      if (highSeasType == 1) {
        param.clueId = this.data.clueId
        param.activityType = 0
        param.userType = 0
      }
      getFollowUp(param, highSeasType).then(res => {
        let r = res.data
        let reachStatus = this.data.reachStatus
        let FollowUpListArr = this.data.FollowUpListArr
        let records = res.data.records
        records.forEach(item => {
          item.followTypeName = filterFollowType(item.followTypeId)
        })
        this.setData({
          FollowUpListArr: reachStatus == true ? FollowUpListArr.concat(records) : records,
          reachStatus: false,
          total: r.total
        })
      })
    },
    // 触底加载
    getReachList() {
      let FollowUpListArr = this.data.FollowUpListArr
      let total = this.data.total
      let pageNo = this.data.pageNo
      if (FollowUpListArr.length < total) {
        this.setData({
          reachStatus: true,
          pageNo: pageNo + 1
        })
        this.getList()
      }
    },
    getLookAccessory(p) {
      let clueInfo = JSON.stringify(
        p.currentTarget.dataset.val
      )
      wx.navigateTo({
        url: `/personal/components/seas-region/follow-records/follow-records?followInfo=${clueInfo}`
      })
    }
  }
})