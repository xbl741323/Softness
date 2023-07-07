// personal/pages/my-order/detail/task-progress/task-progress.js
import {
  getProgress
} from "../../../../../utils/api/order"
import * as CodeMsg from "../../../../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    taskNo: "",
    taskId: "",
    isShow: false,
    taskStatus: null,
    steps: [],
  },
  getProgressData() {
    let taskStatus = this.data.taskStatus
    let params = {
      id: this.data.taskId
    }
    getProgress(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let result = res.data
        result.forEach(item => {
          item.text = `${item.stepName.indexOf('完成') !=-1? item.finishLabel:item.stepName} ${item.createName}`
          item.desc = item.createTime
        })
        this.setData({
          steps: result
        })
        this.isProgress();
      }
    })
  },
  //判断任务进度是否为空
  isProgress() {
    if (this.data.steps.length > 0) {
      this.setData({
        isShow: false
      })
    } else {
      this.setData({
        isShow: true
      })
    }
  },
  setTaskId(options) {
    if (options.data) {
      let r = JSON.parse(options.data)
      this.setData({
        taskId: r.id,
        taskNo: r.taskNo,
        taskStatus: r.taskStatus,
      })
      console.log(this.data.taskStatus, "taskStatus")
      this.getProgressData()
    }
  },
  onLoad(options) {
    this.setTaskId(options)
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
})