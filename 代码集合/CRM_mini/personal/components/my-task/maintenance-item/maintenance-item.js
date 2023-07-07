// personal/components/my-task/indent-item/indent-item.js
import {
  getUserEdit,
  taskEditRecords
} from "../../../../utils/api/mytask"
import {
  filterFollowType
} from "../../../../utils/clue/clue"
const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    taskInfo: {
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
    active: '0',
    env: __wxConfig.envVersion,
    keyWord: null,
    imageUrl: app.globalData.imageURL,
    FollowUpListArr: [],
    logsList: [],
    total: 0,
    reachStatus: false,
    pageNo: 1,
    pageSize: 20,

  },

  /**
   * 组件的方法列表
   */
  methods: { // 查看图片-待对接
    previewImg() {
      let item = e.currentTarget.dataset.item
      wx.previewImage({
        urls: [this.data.imageUrl + item.pictureUrl] // 需要预览的图片http链接列表
      })
    },
    getList() {
      console.log('ddddddddddddd');
      if (this.data.active == 0) {
        // console.log(thi);
        let obj = {
          keywords: this.data.keyWord,
          pageNo: this.data.pageNo,
          pageSize: this.data.pageSize,
          orderTaskId: this.properties.taskInfo.id,
          operateTypes: [0]
        }
        getUserEdit(obj).then(res => {
          console.log(res);
          let FollowUpListArr = this.data.logsList
          let reachStatus = this.data.reachStatus
          if (res.code == 0) {
            res.data.records.forEach(item => {
              item.followTypeName = filterFollowType(item.followType)
              console.log(item.followTypeName);
            })
            this.setData({
              total: res.data.total,
              FollowUpListArr: reachStatus == true ? FollowUpListArr.concat(res.data.records) : res.data.records
            })
          }
        })
      } else if (this.data.active == 1) {
        let obj = {
          keyId: this.properties.taskInfo.id,
          pageNo: this.data.pageNo,
          pageSize: this.data.pageSize,
          type: 7,
        }
        taskEditRecords(obj).then(res => {
          console.log(res);
          let logsList = this.data.logsList
          let reachStatus = this.data.reachStatus
          if (res.code == 0) {
            this.setData({
              total: res.data.total,
              logsList: reachStatus == true ? logsList.concat(res.data.records) : res.data.records
            })
          }
        })
      }

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
      let obj = p.currentTarget.dataset.val
      console.log(this.data.taskInfo);
      obj.orderSpuName = this.data.taskInfo.orderSpuName
      obj.taskNo = this.data.taskInfo.taskNo
      console.log(obj, 'objobjobjobjobjobjobj');
      let data = JSON.stringify(
        obj
      )
      wx.navigateTo({
        url: `/personal/pages/my-task/follow/follow?followInfo=${data}`
      })
    },
    changeSearch(e) {
      this.setData({
        keyWord: e.detail.value.trim()
      })
      this.getList()
    },
    // 修改展示tab类型
    changeTab(e) {
      console.log(e)
      let name = e.detail.name
      this.setData({
        active: name,
        reachStatus: false,
        pageNo: 1,
        pageSize: 20
      })
      this.getList()
    },
  },
})