// personal/components/seas-region/clue-list/clue-list.js
import {
  getClueRecords
} from '../../../../utils/api/seas'
Component({
  /**
   * 组件的属性列表
   */


  properties: {
    clueId: {
      type: Number
    },
    clueType: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    clueInfo: [],
    pageNo: 1,
    pageSize: 20,
    total: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {

    // 下啦刷新
    getReachList() {
      let FollowUpListArr = this.data.FollowUpListArr
      let total = this.data.total
      let pageNo = this.data.pageNo
      if (FollowUpListArr.length < total) {
        this.setData({
          reachStatus: true,
          pageNo: pageNo + 1
        })
        this.getClueRecordslist()
      }
    },
    getClueRecordslist() {
      let obj = {
        clueId: this.properties.clueId,
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize
      }
      getClueRecords(obj, this.data.clueType).then(res => {
        this.setData({
          clueInfo: res.data.records,
          total: res.data.total
        })

      })

    },
    click() {
      console.log(this.data.clueInfo);
    },
    getReachList() {},
    getList() {},
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
  }
})