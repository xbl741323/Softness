// personal/pages/questionsAnswer/questions/questions.js
import {
  getMyQuestionList,
  getStatisticMyQuestion,
  removeQuestion
} from "../../../../utils/api/questionAnswer";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    filterList: [{
        title: "全部",
        value: null,
        deleted: null,
      },
      {
        title: "等待解答",
        value: 0,
        deleted: 0,
      },
      {
        title: "已解答",
        value: 1,
        deleted: 0,
      },
      {
        title: "已删除",
        value: -1,
        deleted: 1,
      },
    ],
    questionsList: [],
    delBtnWidth: 180, //删除按钮宽度单位（rpx）
    delBtnWidth: 160,
    isScroll: true,
    windowWidth: 0,
    windowHeight: 0,
    answerStatus: null,
    pageNo: 1,
    pageSize: 10,
    answeredNum: 0,
    waiteAnswerNum: 0,
    total: 0,
    deleted: null,
    reachStatus: false,
  },
  //获取我的回答列表
  getList() {
    let params = {
      answerStatus: this.data.answerStatus,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
      deleted: this.data.deleted,
    }
    getMyQuestionList(params).then(res => {
      if (res.code == 0) {
        let reachStatus = this.data.reachStatus
        let result = res.data.records ? res.data.records : []
        let questionsList = this.data.questionsList
        result.map(item => {
          item.createTime = item.createTime.slice(0, 10)
        })
        this.setData({
          questionsList: reachStatus == true ? questionsList.concat(result) : result,
          total: res.data.total
        })
      }
    })
    getStatisticMyQuestion({}).then(res => {
      if (res.code == 0) {
        this.setData({
          answeredNum: res.data.answeredNum,
          waiteAnswerNum: res.data.waiteAnswerNum
        })
      }
    })
  },
  drawStart(e) {
    var touch = e.touches[0]
    for (var index in this.data.questionsList) {
      var item = this.data.questionsList[index]
      item.right = 0
    }
    this.setData({
      data: this.data.questionsList,
      startX: touch.clientX,
    })

  },
  drawMove(e) {
    console.log(e);
    var touch = e.touches[0]
    var item = this.data.questionsList[e.currentTarget.dataset.index]
    var disX = this.data.startX - touch.clientX

    if (disX >= 20) {
      if (disX > this.data.delBtnWidth) {
        disX = this.data.delBtnWidth
      }
      item.right = disX
      this.setData({
        isScroll: false,
        questionsList: this.data.questionsList
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        questionsList: this.data.questionsList
      })
    }
  },
  drawEnd(e) {
    var item = this.data.questionsList[e.currentTarget.dataset.index]
    if (item.right >= this.data.delBtnWidth / 2) {
      item.right = this.data.delBtnWidth
      this.setData({
        isScroll: true,
        questionsList: this.data.questionsList,
      })
    } else {
      item.right = 0
      this.setData({
        isScroll: true,
        questionsList: this.data.questionsList,
      })
    }
  },

  // 跳转卧涛问答详情
  toQuestionDetail(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/personal/pages/questionsAnswer/questionDetail/questionsDetail?questionId=${item.id}`,
    })
  },

  //删除
  delItem(e) {
    let params = {
      id: e.currentTarget.dataset.item.id
    }
    removeQuestion(params).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: '删除成功！',
          icon: 'success'
        })
        this.getList()
      }
    })
  },

  // 改变筛选条件
  changeFilter(e) {
    console.log(e);
    let answerStatus = e.currentTarget.dataset.item.value;
    let deleted = e.currentTarget.dataset.item.deleted;
    let current = 'page.current';
    this.setData({
      answerStatus: answerStatus,
      deleted: deleted,
      [current]:1,
      questionsList: [],
    });
    this.getList()
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 500,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        });
      }
    });
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
    this.getList()
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
    console.log(222);
    let questionsList = this.data.questionsList
    let total = this.data.total
    if (questionsList.length < total) {
      this.setData({
        reachStatus: true,
        pageNo: this.data.pageNo + 1
      })
      this.getList()
    }  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})