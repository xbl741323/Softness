// classRoom/pages/detail/course/course.js
const app = getApp();
import {
  getClassDetail,
  getClassTree,
  getWxInviteCode,
  getVideoUrl,
  getChapterInfo
} from "../../../utils/api/wtClass"
import * as CodeMsg from "../../../utils/common/codeMsg";
import Wxml2Canvas from 'wxml2canvas';
import drawQrcode from 'weapp-qrcode'
var WxParse = require('../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareBgUrl: "https://static.wotao.com/icon/head/3f01787265bd485ca04933de1dfe053f.png",
    VideoRateBtn: false,
    videoRateStatus: false,
    showAll: false,
    showVideo: false,
    isCollect: false,
    courseNum: 0, // 课程总章节数量
    courseId: "",
    courseInfo: {},
    accessInfo: "",
    articleArray: [],
    imageUrl: app.globalData.imageURL,
    cVideoUrl: "",
    tabList: ['课程介绍', '课程目录'],
    cIndex: 0,
    catalogueList: [],
    vipFree: false,
    extensionDialog: false,
    showCanvas: false,
    show: false,
    wxCode: "", //微信邀请码
    shareCodeUrl: "", // 二维码图片url
    shareImgUrl: "", // 生成的截图url
    treeData: [],
    userNo: "", //员工工号
    courseIntro: "",
    status: false //课程状态
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
        this.computePrice();
        let that = this
        let articleArray = [{
          content: res.data.instruction
        }];
        for (let i = 0; i < articleArray.length; i++) {
          let a = articleArray[i].content.indexOf('>') + 1
          let b = articleArray[i].content.lastIndexOf('<')
          let str = articleArray[i].content.slice(a, b)
          this.setData({
            courseIntro: str.slice(0, 15) + '...'
          })
          WxParse.wxParse('article' + i, 'html', articleArray[i].content, that);
          if (i === articleArray.length - 1) {
            WxParse.wxParseTemArray("articleArray", 'article', articleArray.length, that);
          }
        }
        wx.hideLoading({
          success: (res) => {}
        })
      }
    })
  },
  // 树结构
  getTree() {
    let params = {
      classId: this.data.courseId,
      id: 0,
    }
    getClassTree(params).then(res => {
      if (res.code == 0) {
        let catalogueList = res.data
        let courseNum = 0
        catalogueList.forEach(item => {
          item.showChildren = false
          courseNum = courseNum + item.child.length
        })
        this.setData({
          catalogueList: catalogueList,
          courseNum: courseNum
        })
        this.checkChild(this.data.catalogueList)
      }
    })
  },
  // 章节树赋值（只显示5条子章节）
  checkChild(result) {
    let childLength = 0;
    result.forEach((item, index) => {
      item.index = index + 1
      item.showChild = false
      if (item.child.length > 0) {
        item.child.forEach((cItem, cIndex) => {
          if (childLength < 6) {
            childLength = childLength + 1;
            cItem.showChild = true;
            cItem.index = cIndex + 1;
            item.showChild = true
          }
        });
      }
    });
    this.setData({
      treeData: result
    })
  },
  // 回到首页
  toIndex() {
    wx.switchTab({
      url: '/pages/index/index',
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
  // 获取对应子章节视频信息
  getVideoInfo(e) {
    let result = e.currentTarget.dataset.info
    console.log(result)
    if (result.trySeeState != 1) {
      return false
    }
    if (result.videoId == 0) {
      wx.showToast({
        icon: "none",
        title: '该章节还未上传视频，请看看其他章节吧~',
      })
    } else {
      let videoTime = this.fixTotalTime(result.trySeeTime)
      this.getChapterInfo(result.id, videoTime)
    }
    // 展示video状态
    this.setData({
      showVideo: result.videoId == 0 ? false : true
    })
  },
  // 调用获取视频url信息
  getChapterInfo(id, videoTime) {
    getChapterInfo({
      id: id
    }).then(res => {
      this.getVideoData(res.data.classVideoVo.playVideoId, videoTime)
    })
  },
  // 获取视频url
  getVideoData(videoId, seconds) {
    let that = this
    that.setData({
      accessInfo: wx.getStorageSync('accessInfo'),
    })
    let params = {
      videoId: videoId,
    }
    if (seconds > 0) {
      params.seconds = seconds // 单位 -> s（秒）
    }
    getVideoUrl(params).then(res => {
      if (res.code && res.code == CodeMsg.CODE_2001) {
        wx.showToast({
          icon: "none",
          title: '视频正在解码中，请稍后再试！',
        })
      } else {
        that.setData({
          cVideoUrl: res.playInfoList[0].playURL
        })
      }
    })
  },
  //计算vip费用
  computePrice() {
    let vipExpireDate = wx.getStorageSync('vipExpireDate');
    if (wx.getStorageSync('userInfo').vipInfo || vipExpireDate) {
      let vipInfo = wx.getStorageSync('userInfo').vipInfo;
      let vipDate = vipInfo ? new Date(vipInfo.vipExpireDate) : vipExpireDate; // 到期时间
      let useful = new Date() <= vipDate.getTime() + 24 * 60 * 60 * 1000 - 1 ? true : false;
      if (this.data.courseInfo.tradingChargeType == 2 && useful) return this.setData({
        vipFree: true
      })
    }
  },
  //推广
  toExtension() {
    this.setData({
      extensionDialog: true
    })
    this.createCode()
  },
  signUp(e) {
    if (this.data.vipFree) return this.buyNow(e)
  },
  // 生成二维码
  createCode() {
    let that = this
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      text: `https://www.wotao.com/class?classId=${that.data.wxCode}&courseId=${that.data.courseId}`,
      callback: function (e) {
        setTimeout(() => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 450,
            height: 450,
            destWidth: 2000,
            destHeight: 2000,
            canvasId: 'myQrcode',
            success(res) {
              that.setData({
                shareCodeUrl: res.tempFilePath
              })
              that.drawCanvas()
            },
            fail(res) {
              console.error(res)
            }
          })
        }, 500)
      }
    })
  },
  //动态获取画制作元素的宽高
  drawCanvas() {
    const query = wx.createSelectorQuery().in(this);
    query.select('#draw-contain').fields({
      size: true,
      scrollOffset: true
    }, data => {
      let width = data.width;
      let height = data.height;
      this.width = width;
      this.height = height;
      this.draw()
    }).exec();
  },
  draw() {
    let that = this
    console.log(this.width, this.height)
    //创建wxml2canvas对象
    let drawImage = new Wxml2Canvas({
      element: 'share', // canvas节点的id,
      obj: that, // 在组件中使用时，需要传入当前组件的this
      width: this.width, // 宽高
      height: this.height,
      background: '#ffffff', // 默认背景色
      progress(percent) { // 绘制进度
      },
      finish(url) {
        console.log(url)
        that.setData({
          shareImgUrl: url,
          showCanvas: true
        })
      },
      error(res) {
        console.log(res);
      }
    }, this);
    let data = {
      //直接获取wxml数据
      list: [{
        type: 'wxml',
        class: '.draw-contain, .draw-bg, .title-sty, .draw-canvas, .draw-code-img, .cour-content, .cover-url, .cour-name, .cour-index, .cour-title, .cour-section, .cour-no, .cour-dot',
        limit: '.draw-contain',
        x: 0,
        y: 0
      }]
    }
    //传入数据，画制canvas图片
    drawImage.draw(data, this);
  },
  // 保存图片到相册
  saveImg() {
    let that = this
    console.log(that.data.shareImgUrl)
    wx.saveImageToPhotosAlbum({
      filePath: that.data.shareImgUrl,
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: '保存图片成功',
        })
      },
      fail: function (err) {
        console.log(err)
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
          console.log("当初用户拒绝，再次发起授权")
          wx.showModal({
            title: '提示',
            content: '需要您授权保存相册',
            showCancel: false,
            success: () => {
              wx.openSetting({
                success(settingdata) {
                  console.log("settingdata", settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限成功,再次点击图片即可保存',
                      showCancel: false,
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '获取权限失败，将无法保存到相册哦~',
                      showCancel: false,
                    })
                  }
                },
                fail(failData) {
                  wx.showToast({
                    title: '保存图片失败',
                  })
                  console.log("failData", failData)
                },
                complete(finishData) {
                  console.log("finishData", finishData)
                }
              })
            }
          })
        }
        if (err.errMsg === "saveImageToPhotosAlbum:fail cancel") {
          wx.showToast({
            title: '已取消图片保存',
            icon: 'none'
          })
        }
      }
    })
  },
  // 微信分享
  wxShare() {
    let that = this
    console.log(that.data.shareImgUrl)
    wx.showShareImageMenu({
      path: that.data.shareImgUrl
    })
  },
  // 获取微信邀请码
  getWxInviteCode() {
    getWxInviteCode().then(res => {
      this.setData({
        wxCode: res.data
      })
    })
  },
  // 取消
  cancel() {
    this.setData({
      extensionDialog: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let status = options.status
    this.setData({
      courseId: id,
      status: status == 3 ? true : false
    })
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userNo: wx.getStorageSync('userInfo').number
      })
    }
    this.getDetailData()
    this.getTree()
    this.getWxInviteCode()
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

})