// personal/pages/questionsAnswer/questionDetail/questionsDetail.js
const app = getApp();
import {
  getAllAnswer,
  getQuestionDetail,
  thumbsUpAnswer,
  acceptAnswer,
  removeQuestion
} from "../../../../utils/api/questionAnswer";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: app.globalData.imageURL,
    userInfo: {},
    reachStatus: false, // 是否触底加载更多数据
    pageNo: 1,
    pageSize: 10,
    questionId: "",
    sortField: 0,
    questionDetail: {},
    answerList: [],
    answerTotal: 0,
  },

  handleSort(e) {
    this.setData({
      sortField: e.currentTarget.dataset.sort,
      answerList: [],
      pageNo: 1,
    })
    this.getList()
  },

  handleThumbsUp(e) {
    let item = e.currentTarget.dataset.item
    let type = e.currentTarget.dataset.type
    let index = e.currentTarget.dataset.index
    let params = {
      answerId: item.id,
      questionId: item.questionId,
      type: type
    }
    thumbsUpAnswer(params).then(res => {
      if (res.code == 0) {
        this.replace(index)
      }
    })
  },

  //点赞采纳之后根据index替换对象更新视图
  replace(index) {
    let page = parseInt(index / 10) + 1
    let params = {
      questionId: this.data.questionId,
      currentAccountId: this.data.userInfo.accountId,
      pageNo: page,
      pageSize: this.data.pageSize,
      sortField: this.data.sortField == 0 ? 'Other' : 'HighQuality',
    }
    getAllAnswer(params).then(res => {
      if (res.code == 0) {
        let list = res.data.records
        list.map(item => {
          item.createTime = item.createTime.slice(0, 16)
          item.content = item.content.replace(/\<img/g, '<img style="max-width: 200rpx;height: auto;display:block"')
          item.content = item.content.replace(/\<video/g, '<video style="max-width: 300rpx;height: 150rpx;display:block"')
        })
        let presentObj = list[index % 10]
        let answerList = this.data.answerList
        answerList.splice(index, 1, presentObj)
        this.setData({
          answerList: answerList,
        })
      }
    })
  },

  handleAccept(e) {
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    let params = {
      questionId: item.questionId,
      id: item.id,
      acceptFlag: item.acceptFlag == 0 ? 1 : 0,
    }
    acceptAnswer(params).then(res => {
      if (res.code == 0) {
        this.replace(index)
      }
    })
  },

  handleDel(e) {
    let params = {
      id: this.data.questionDetail.id
    }
    wx.showModal({
      title: '提示',
      content: '确认删除提问吗?删除后将不显示',
      success (res) {
        if (res.confirm) {
          removeQuestion(params).then(res => {
            if (res.code == 0) {
              wx.showToast({
                title: '删除成功！',
                icon: 'success'
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
                })
              },500)
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  getDetail() {
    getQuestionDetail(this.data.questionId).then(res => {
      if (res.code == 0) {
        let result = res.data
        result.createTime = result.createTime.slice(0, 10)
        this.setData({
          questionDetail: result
        })
        this.getList()
      }
    })
  },
  getList() {
    let params = {
      questionId: this.data.questionId,
      currentAccountId: this.data.userInfo.accountId,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
      sortField: this.data.sortField == 0 ? 'Other' : 'HighQuality',
    }
    getAllAnswer(params).then(res => {
      if (res.code == 0) {
        let reachStatus = this.data.reachStatus
        let result = res.data.records ? res.data.records : []
        let answerList = this.data.answerList
        result.map(item => {
          item.createTime = item.createTime.slice(0, 16)
          item.content = item.content.replace(/\<img/g, '<img style="max-width: 200rpx;height: auto;display:block"')
          item.content = item.content.replace(/\<video/g, '<video style="max-width: 300rpx;height: 150rpx;display:block"')
        })
        this.setData({
          answerList: reachStatus == true ? answerList.concat(result) : result,
          answerTotal: res.data.total,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      questionId: options.questionId,
    })
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
      })
    }
    this.getDetail()
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
    let answerList = this.data.answerList
    let answerTotal = this.data.answerTotal
    if (answerList.length < answerTotal) {
      this.setData({
        reachStatus: true,
        pageNo: this.data.pageNo + 1
      })
      this.getList()
    }  
  },

// 转发给朋友
onShareAppMessage(res) {
  return {
    title: app.globalData.shareTitle, //默认小程序标题
    path: app.globalData.sharePath
  }
},
//分享到朋友圈
onShareTimeline() {
  return {
    title: app.globalData.shareTitle, //默认小程序标题
    path: app.globalData.sharePath
  }
},
})