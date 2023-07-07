// personal/pages/taskProgress/taskProgress.js
import {
  getTaskProgress
} from "../../../utils/api/order.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskList: [],
    taskName: ""
  },
  // 获取任务进度
  getTaskProcess(val) {
    if (val.taskStatus !== 0) {
      let params = {
        taskId: val.id,
        name: val.workflowName,
      }
      getTaskProgress(params).then(res => {
        if (res.code == 0) {
          this.setData({
            taskList: res.data.reverse(),
            taskName: val.productName
          })
        }
      })
    } else {
      this.setData({
        processList: [],
        taskName: val.productName
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let val = JSON.parse(options.data)
    this.getTaskProcess(val)
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