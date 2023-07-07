// classRoom/pages/detail/shortVideo/shortVideo.js
const app = getApp();
import {
  getSVideoList,
  getShortVideoUrl
} from "../../../../utils/api/wtClass"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cVideoUrl: "",
    imageUrl: app.globalData.imageURL,
    total: 0,
    currentPage: 1,
    showBtn: true,
    showDescStatus: false,
    cutVideoId: "",
    cVideoId: 0,
    cPercent: 0,
    videoList: []
  },
  // 滑动切换视频
  changeVideo(e) {
    console.log(e)
    let index = e.detail.current
    let length = this.data.videoList.length
    let total = this.data.total
    this.setData({
      cVideoId: index,
      showDescStatus: false
    })
    if ((e.detail.current >= (length - 1)) && (length < total)) {
      this.getShortList(true)
    }
    this.getVideoData(this.data.videoList[index].playVideoId)
  },
  // (展开/收起)操作
  changeDesc(e) {
    let status = e.currentTarget.dataset.status
    this.setData({
      showDescStatus: status
    })
  },
  bindtimeupdate(e) {
    let {
      currentTime,
      duration
    } = e.detail
    this.setData({
      cPercent: (currentTime / duration * 100).toFixed(2),
    })
  },
  // 获取短视频列表
  getShortList(status) {
    let page = this.data.currentPage
    let params = {
      pageSize: 10,
      pageNo: status == true ? page + 1 : page
    }
    getSVideoList(params).then(res => {
      if (res.code == 0) {
        let records = res.data.records
        let cutIndex = 0
        records.forEach((item, index) => {
          item.showBtn = item.description.length > 90 ? true : false
          if (this.data.cutVideoId == item.id) {
            cutIndex = index
          }
        })
        let videoList = this.data.videoList.concat(records)
        this.setData({
          videoList: status == true ? videoList : records,
          total: res.data.total,
          cVideoId: cutIndex
        })
        console.log(this.data.cVideoId,'cVideoIdcVideoIdcVideoId')
        status == false ? this.getVideoData(records[cutIndex].playVideoId) : ''
      }
    })
  },
  // 获取视频url
  getVideoData(videoId) {
    let params = {
      videoId: videoId
    }
    getShortVideoUrl(params).then(res => {
      if (res.code == 0) {
        let r = JSON.parse(res.data)
        console.log(r.playInfoList[0].playURL)
        this.setData({
          cVideoUrl: r.playInfoList[0].playURL
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cutVideoId: options.id
    })
    this.getShortList(false)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})