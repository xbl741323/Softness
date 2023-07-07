// personal/pages/my-blogs/my-blogs.js
const app = getApp();
import {
  getMyLogList
} from "../../../../utils/api/myblogs";
// import * as CodeMsg from "../../../utils/common/codeMsg";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    testList: [],
    current: 1,
    size: 20,
    myLogList: [],
    reachStatus: false,
    userInfo: {},
    imageUrl: app.globalData.imageURL,
    condition: true
  },
  // 查看图片-待对接
  previewImg(e) {
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      urls: [url] // 需要预览的图片http链接列表
    })
  },
  getMyLogListData() {
    let params = {
      current: this.data.current,
      size: this.data.size
    }
    getMyLogList(params).then(res => {
      let reachStatus = this.data.reachStatus
      let myLogList = this.data.myLogList
      let records = res.data.records
      records.forEach(item => {
        item.time = item.createTime.slice(-8)
        item.picture = this.filtration(item.pictures)
        item.week = this.showTime(item.journalTime)
        item.testList = this.filterArr(item.pictures)
      })
      this.setData({
        myLogList: reachStatus == true ? myLogList.concat(res.data.records) : res.data.records,
        newTotal: res.data.total,
        reachStatus: false
      })
      wx.stopPullDownRefresh()
      wx.removeStorageSync('isLogSubmit')
    })
  },
  getReachList() {
    let myLogList = this.data.myLogList
    let newTotal = this.data.newTotal
    let current = this.data.current
    if (myLogList.length < newTotal) {
      this.setData({
        reachStatus: true,
        current: current + 1
      })
      this.getMyLogListData()
    }
  },
  showTime(tiem) {
    let show_day = new Array(
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
      "星期日"
    );
    let time = new Date(tiem);
    let day = time.getDay();
    let now_time = show_day[day - 1]
    return now_time
  },
  /**
   * 生命周期函数--监听页面加载
   */
  filterArr(arr) {
    if (arr && arr[0]) {
      let r1 = arr.map(item => ({
        url: this.data.imageUrl + item.replace(/\s*/g, "")
      }))
      return r1
    }
    return []
  },

  filtration(arr) {
    if (arr && arr[0]) {
      return arr[0].replace(/\s*/g, "").split(',')
    }
  },
  getBlogsItem(e) {
    let detaildata = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: `/personal/pages/my-blogs/blogs-details/index?detaildata=${detaildata}`,
    })
  },
  formatDate() {//日期转换
    let date = new Date();
    let year = date.getFullYear()
    let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    let day = String(date.getDate()).length == 1 ? '0' + date.getDate() : date.getDate()
    return `${year}-${month}-${day}`;
  },
  addBlogs() {
    let arr
    let myLogList = this.data.myLogList
    let currentDate = this.formatDate()
    if (myLogList) {
      arr = myLogList.filter(item => {
        return item.journalTime == currentDate
      })
    }
    if (arr.length > 0) {
      let obj = JSON.stringify(arr[0])
      wx.navigateTo({
        url: `/personal/pages/my-blogs/blogs-details/index?detaildata=${obj}&&condition=true`,
      })
    } else {
      wx.navigateTo({
        url: '/personal/pages/my-blogs/blogs-details/index?condition=true',
      })
    }
  },
  // 控制调用列表接口
  checkGetList() {
    if (wx.getStorageSync('isLogSubmit')) {
      this.setData({
        current: 1
      })
      this.getMyLogListData()
    }
  },
  onLoad(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.getMyLogListData()
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
    this.checkGetList()
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
    this.setData({
      current: 1
    })
    this.getMyLogListData()
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