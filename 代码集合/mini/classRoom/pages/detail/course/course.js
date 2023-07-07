// classRoom/pages/detail/course/course.js
const app = getApp();
import {
  getClassDetail,
  getClassTree,
  addClass,
  cancelClass,
  getCollectStatus,
  getVideoUrl,
  freeCourseStudy,
  recordStudyProgress,
  addPlayNum,
  addBrowseNum
} from "../../../../utils/api/wtClass"
import {
  getOpenId,
  layout
} from "../../../../utils/api"
import {
  getUserInfo
} from "../../../../utils/api"
import {
  throttle
} from "../../../../utils/common/utils"
var WxParse = require('../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRecord: false,
    isPlayVideo: false, // false-
    chapterChild: "", // 子章节对象
    isVip: false, // 是否开通会员
    VideoRateBtn: false,
    videoRateStatus: false,
    showVideo: false,
    isCollect: false,
    courseNum: 0, // 课程总章节数量
    courseId: "",
    courseInfo: {},
    articleArray: [],
    imageUrl: app.globalData.imageURL,
    cVideoUrl: "",
    tabList: ['课程介绍', '课程目录'],
    cIndex: 0,
    catalogueList: [],
    vipFree: false,
  },
  bindcontrolstoggle(e) {
    this.setData({
      VideoRateBtn: e.detail.show
    })
  },
  // 显示倍速按钮
  showVideoRate() {
    this.setData({
      videoRateStatus: !this.data.videoRateStatus,
    })

  },
  // 改变倍速
  changeRate(e) {
    let num = Number(e.currentTarget.dataset.num)
    this.videoContext = wx.createVideoContext('myVideo')
    this.videoContext.playbackRate(num)
    this.videoContext.play()
    this.setData({
      videoRateStatus: false
    })
  },
  // 切换显示页
  changeTab(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      cIndex: index
    })
  },
  // 切换主章节
  changeCatalogue(e) {
    let index = e.currentTarget.dataset.index
    let catalogueList = this.data.catalogueList
    catalogueList[index].showChildren = !catalogueList[index].showChildren
    this.setData({
      catalogueList: catalogueList
    })
  },
  // 购买vip会员
  buyVip() {
    wx.navigateTo({
      url: '/personal/pages/class/member'
    })
  },
  getDetailData() {
    wx.showLoading({
      title: '加载中',
    })
    let params = {
      id: this.data.courseId
    }
    getClassDetail(params).then(res => {
      if (res.code == 0) {
        this.setData({
          courseInfo: res.data
        })
        // 获取章节树
        this.getTree()
        this.computePrice();
        let that = this
        let articleArray = [{
          content: res.data.instruction
        }];
        for (let i = 0; i < articleArray.length; i++) {
          WxParse.wxParse('article' + i, 'html', articleArray[i].content, that);
          if (i === articleArray.length - 1) {
            WxParse.wxParseTemArray("articleArray", 'article', articleArray.length, that);
          }
        }
        wx.hideLoading({
          success: (res) => {
            that.setData({

            })
          },
        })
      }
    })
  },
  // 树结构
  getTree() {
    let params = {
      classId: this.data.courseId
    }
    getClassTree(params).then(res => {
      if (res.code == 0) {
        let catalogueList = res.data
        let courseNum = 0
        catalogueList.forEach((item, index) => {
          item.showChildren = index == 0 ? true : false
          courseNum = courseNum + item.child.length
          item.child.forEach(cItem => {
            cItem.showVideo = false
          })
        })
        this.setData({
          catalogueList: catalogueList,
          courseNum: courseNum
        })
        let courseInfo = this.data.courseInfo
        if (courseInfo.latestWatchSection && Number(courseInfo.latestWatchSection) != 0) {
          // 跳转到上一次播放记录
          this.skipToSeek(courseInfo.latestWatchSection)
        }
      }
    })
  },
  // 回到首页
  toIndex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 添加收藏
  addCollectData() {
    let params = {
      classId: this.data.courseId
    }
    addClass(params).then(res => {
      if (res.code == 0) {
        wx.showToast({
          icon: "success",
          title: '收藏成功！',
        })
        this.getCollectData()
      }
    })
  },
  // 取消收藏
  cancelCollectData() {
    let params = {
      classId: this.data.courseId
    }
    cancelClass(params).then(res => {
      if (res.code == 0) {
        wx.showToast({
          icon: "success",
          title: '取消成功！',
        })
        this.getCollectData()
      }
    })
  },
  // 获取收藏状态
  getCollectData() {
    let params = {
      classId: this.data.courseId
    }
    getCollectStatus(params).then(res => {
      if (res.code == 0) {
        this.setData({
          isCollect: res.data
        })
      }
    })
  },
  // 计算视频总时间
  fixTotalTime(videoTime) {
    let list = videoTime.split(":");
    let hour = Number(list[0]);
    let minute = Number(list[1]);
    let second = Number(list[2]);
    let totalTime = hour * 3600 + minute * 60 + second;
    return totalTime
  },
  // 子章节切换
  changeChildCatalogue(e) {
    let courseInfo = this.data.courseInfo
    let result = e.currentTarget.dataset.info
    console.log(result)
    if (courseInfo.tradingChargeType == 1 && !courseInfo.subscribed) {
      wx.showToast({
        icon: "none",
        title: "请先报名，再进行观看！"
      })
      return false
    }
    this.setData({
      chapterChild: result
    })
    let catalogueList = this.data.catalogueList
    catalogueList.forEach(item => {
      if (item.id == result.parentId) {
        item.child.forEach(cItem => {
          cItem.showVideo = cItem.id == result.id ? true : false
        })
      } else {
        item.child.forEach(cItem => {
          cItem.showVideo = false
        })
      }
    })
    this.setData({
      catalogueList: catalogueList
    })
    this.getVideoInfo(e)
  },
  // 获取对应子章节视频信息
  getVideoInfo(e) {
    let trySeeState = e.currentTarget.dataset.info.trySeeState
    let item = this.data.courseInfo
    if (this.data.courseInfo.subscribed || item.tradingChargeType == 1) {
      let result = e.currentTarget.dataset.info
      // 调用获取视频url信息
      this.getVideoData(result.playVideoId, 0)
      this.setData({
        showVideo: result.videoId == 0 ? false : true,
      })
    } else {
      if (trySeeState == 1) {
        let result = e.currentTarget.dataset.info
        if (result.videoId == 0) {
          wx.showToast({
            icon: "none",
            title: '该章节还未上传视频，请看看其他章节吧~',
          })
        } else {
          let videoTime = this.fixTotalTime(result.trySeeTime)
          // 调用获取视频url信息-待对接
          this.getVideoData(result.playVideoId, videoTime)
        }
        // 展示video状态
        this.setData({
          showVideo: result.videoId == 0 ? false : true
        })
      }
    }

  },
  // 获取视频url
  getVideoData(videoId, seconds) {
    let isPlayVideo = this.data.isPlayVideo
    let chapterChild = this.data.chapterChild
    let params = {
      videoId: videoId,
      courseId: this.data.courseId
    }
    if (seconds > 0) {
      params.seconds = seconds // 单位 -> s（秒）
    }
    getVideoUrl(params).then(res => {
      if (res.code == 0) {
        let r = JSON.parse(res.data)
        if (!isPlayVideo) {
          // 只调用一次
          this.addPlayNum()
        }
        this.setData({
          cVideoUrl: r.playInfoList[0].playURL,
          isPlayVideo: true
        })
        this.videoContext = wx.createVideoContext('myVideo')
        this.videoContext.stop()
        let that = this
        setTimeout(() => {
          that.videoContext.play()
          that.videoContext.seek(chapterChild.seconds)
        }, 100)
      }
    })
  },
  //计算vip费用
  computePrice() {
    let vipInfo = wx.getStorageSync('vipInfo') ? wx.getStorageSync('vipInfo') : null;
    if (vipInfo) {
      let vipDate = new Date(vipInfo.vipExpireDate); // 到期时间
      let useful = new Date().getTime() <= new Date(vipDate).getTime() + 24 * 60 * 60 * 1000 - 1 ? true : false;
      if (this.data.courseInfo.tradingChargeType == 2 && useful) {
        this.setData({
          vipFree: true
        })
      }
      if (useful) {
        this.setData({
          isVip: true
        })
      }
    }
  },
  checkLogin(e) {
    let that = this;
    wx.login({
      success: function (res) {
        let params = {
          code: res.code,
          accountId: wx.getStorageSync('accountId')
        }
        getOpenId(params).then(res => {
          if (res.code == 0) {
            if (that.data.vipFree) return that.buyNow(e)
          } else {
            // 调用注销接口强制退出
            that.layoutAccount()
          }
        })
      }
    })
  },
  // 注销退出
  layoutAccount() {
    wx.showToast({
      title: '账号登录异常，请重新登录！',
      icon: "error",
      duration: 1000,
    })
    setTimeout(() => {
      wx.login({
        success: function (res) {
          layout({
            code: res.code
          }).then(res => {
            if (res.code == 0) {
              // 清除所有storageSync
              wx.clearStorageSync()
              wx.setStorageSync('hasLogo', false);
              wx.redirectTo({
                url: "/personal/pages/wxLogin/wxLogin"
              })
            }
          })
        }
      })
    }, 1500)
  },
  signUp(e) {
    if (this.data.vipFree) return this.buyNow(e)
  },
  //立即下单
  buyNow(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/classRoom/pages/order/order?id=${id}`,
    })
  },
  // 课程id赋值
  setCourseId(options) {
    if (options.id) {
      let id = options.id
      this.setData({
        courseId: id
      })
    } else {
      if (wx.getStorageSync('courseId')) {
        this.setData({
          courseId: wx.getStorageSync('courseId')
        })
      }
    }
  },
  // 跳转到上一次的播放位置
  skipToSeek(cId) {
    let pId = '' // 父章节id
    let playVideoId = ''
    let catalogueList = this.data.catalogueList
    catalogueList.forEach((pItem) => {
      pItem.child.forEach(cItem => {
        if (cItem.id == cId) {
          cItem.showVideo = true
          pId = cItem.parentId
          playVideoId = cItem.playVideoId
          this.setData({
            chapterChild: cItem
          })
        }
      })
    })
    catalogueList.forEach((pItem) => {
      if (pItem.id == pId) {
        pItem.showChildren = true
      } else {
        pItem.showChildren = false
      }
      this.setData({
        catalogueList: catalogueList
      })
    })
    this.setData({
      showVideo: true,
      cIndex: 1 // 切换到课程目录
    })
    // 调用获取视频url信息
    this.getVideoData(playVideoId, 0)
  },
  // 完全免费报名
  buyFreeCourse() {
    let params = {
      courseId: this.data.courseInfo.id
    }
    freeCourseStudy(params).then(res => {
      if (res.code == 0) {
        setTimeout(() => {
          wx.showToast({
            icon: "success",
            title: '报名成功！'
          })
        }, 500)
        this.getDetailData()
        this.setData({
          cIndex: 1
        })
      }
    })
  },
  // 设置学习记录-防抖操作
  throttleCourseRecords: throttle(function (seconds, completedStatus) {
    this.setCourseRecords(seconds, completedStatus)
  }, 2000),
  // 设置学习记录
  setCourseRecords(seconds, completedStatus) {
    let courseInfo = this.data.courseInfo
    let chapterChild = this.data.chapterChild
    let params = {
      courseId: courseInfo.id,
      sectionId: chapterChild.id,
      playVideoId: chapterChild.playVideoId,
      seconds: seconds,
      completed: completedStatus
    }
    // 只有已订阅状态的课程才调用记录课程进度接口
    if (courseInfo.subscribed) {
      recordStudyProgress(params).then(res => {})
    }
  },
  // 触发频率 250ms 一次
  bindtimeupdate(e) {
    let {
      currentTime,
      duration
    } = e.detail
    let that = this
    if ((currentTime == duration)) {
      that.setCourseRecords(parseInt(currentTime), 1)
    } else {
      parseInt(currentTime) > 0 ? that.throttleCourseRecords(parseInt(currentTime), 0) : ''
    }
  },
  // 添加播放记录
  addPlayNum() {
    let courseId = this.data.courseId
    let params = {
      courseId: courseId
    }
    addPlayNum(params).then(res => {})
  },
  // 添加浏览记录
  addBrowseNum() {
    let courseId = this.data.courseId
    let params = {
      courseId: courseId
    }
    addBrowseNum(params).then(res => {})
    this.setData({
      isRecord: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setCourseId(options)
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
    if (wx.getStorageSync('userInfo')) {
      this.getDetailData()
      this.getCollectData()
      if (!this.data.isRecord) {
        this.addBrowseNum()
      }
    } else {
      wx.navigateTo({
        url: "/personal/pages/wxLogin/wxLogin"
      })
    }
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