// personal/pages/questionsAnswer/initiateQuestion/initiateQuestion.js
import {
  saveQuestion
} from "../../../../utils/api/questionAnswer";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputTextLen: 0,
    textareaTextLen: 0,
    title: "",
    description: "",
    showDialog: false,
  },

  inputTitle(e) {
    let str = e.detail.value
    this.setData({
      title: str,
      inputTextLen: str.split("").length,
    })
  },

  inputDescription(e) {
    let str = e.detail.value
    this.setData({
      description: str,
      textareaTextLen: str.split("").length,
    })
  },
  //提交按钮
  handleConfirm() {
    if (this.data.title != "") {
      let parmas = {
        title: this.data.title,
        questionPort: "APPLET",
        description: this.data.description
      }
      saveQuestion(parmas).then(res => {
        if (res.code == 0) {
          wx.showToast({
            title: '提交成功！',
            icon: "success",
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
          },500)
        } else {
          wx.showToast({
            title: res.msg,
            icon: "none",
          })
        }
      })
    } else {
      return wx.showToast({
        title: '请填写必填项！',
        icon: "error"
      })
    }
  },
  openDialog() {
    this.setData({
      showDialog: true,
    })
  },
  closeDialog() {
    this.setData({
      showDialog: false,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})