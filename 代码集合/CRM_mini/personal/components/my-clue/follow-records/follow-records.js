// personal/components/my-clue/follow-records/follow-records.js
import {
  getFollowList
} from "../../../../utils/api/clue"
import {
  filterFollowType
} from "../../../../utils/clue/clue"
import * as CodeMsg from "../../../../utils/common/codeMsg";
const app = getApp()
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
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    env: __wxConfig.envVersion,
    reachStatus: false,
    followList: [],
    imageUrl: app.globalData.imageURL,
    total: 0,
    pageNo: 1,
    pageSize: 20
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 查看图片-待对接
    previewImg(e) {
      let item = e.currentTarget.dataset.item
      wx.previewImage({
        urls: [this.data.imageUrl + item.pictureUrl] // 需要预览的图片http链接列表
      })
    },
    // 触底加载
    getReachList() {
      let followList = this.data.followList
      let total = this.data.total
      let pageNo = this.data.pageNo
      if (followList.length < total) {
        this.setData({
          reachStatus: true,
          pageNo: pageNo + 1
        })
        this.getFollowData()
      }
    },
    // 跳转到线索跟进页
    toFollow(e) {
      let followInfo = JSON.stringify(e.currentTarget.dataset.item)
      let clueType = this.properties.clueType
      let clueInfo = this.properties.clueInfo
      let clueId = this.properties.clueId
      let clueName = clueType == 1 ? clueInfo.contactName : clueInfo.companyName
      let data = JSON.stringify({
        clueId: clueId,
        clueName: clueName
      })
      wx.navigateTo({
        url: `/personal/pages/my-clue/follow/follow?clueType=${clueType}&&clueInfo=${data}&&followInfo=${followInfo}`,
      })
    },
    getFollowData() {
      let params = {
        clueId: this.data.clueId,
        clueType: this.data.clueType,
        userType: 0,
        pageSize: this.data.pageSize,
        activityType: 0,
        pageNo: this.data.pageNo,
      }
      getFollowList(params).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          let r = res.data
          let reachStatus = this.data.reachStatus
          let followList = this.data.followList
          let records = r.records
          records.forEach(item => {
            item.followTypeName = filterFollowType(item.followTypeId)
          })
          this.setData({
            followList: reachStatus == true ? followList.concat(records) : records,
            reachStatus: false,
            total: r.total
          })
        }
      })
    }
  }
})