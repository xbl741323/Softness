// additional/pages/take-photo/take-photo.js
const app = getApp();
import Wxml2Canvas from 'wxml2canvas';
import * as CodeMsg from "../../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: '',
    shareMemberUrl: '',
    name: '',
    accessInfo: {},
  },
  // 进行拍照
  choosePhoto() {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera'],
      sizeType: ['compressed'],
      camera: 'back',
      success(res) {
        that.setData({
          imgUrl: res.tempFiles[0].tempFilePath
        })
      },
      fail(err) {
        console.log(err)
        if (that.data.imgUrl == '') {
          that.submit()
        }
      },
      complete() {
        that.drawCanvas()
      }
    })
  },
  // 提交
  submit() {
    if (this.data.imgUrl != '') {
      wx.setStorageSync('followImg', this.data.shareMemberUrl)
    }
    wx.navigateBack({
      delta: 1,
    })
  },
  // 生成推广图
  drawCanvas() {
    let that = this
    const query = wx.createSelectorQuery().in(this);
    query.select('#draw-member-contain').fields({
      size: true,
      scrollOffset: true
    }, data => {
      let width = data.width;
      let height = data.height;
      this.width = width;
      this.height = height;
      that.draw()
    }).exec();
  },
  draw() {
    let that = this
    //创建wxml2canvas对象
    let drawImage = new Wxml2Canvas({
      element: 'member-share', // canvas节点的id,
      obj: that, // 在组件中使用时，需要传入当前组件的this
      width: this.width, // 宽高
      height: this.height,
      destZoom: 1.5,
      background: 'pink', // 默认背景色
      progress(percent) { // 绘制进度
      },
      finish(url) {
        that.uploadImage(url)
      },
      error(res) {
        console.log(res);
      }
    }, this);
    let data = {
      //直接获取wxml数据
      list: [{
        type: 'wxml',
        class: '.member-cover, .img-sty, .member-code-contain, .member-text',
        limit: '.member-cover',
        x: -37,
        y: 0
      }]
    }
    //传入数据，画制canvas图片
    drawImage.draw(data, this);
  },
  uploadImage(url) {
    let imgbase64 = 'data:image/png;base64,' + wx.getFileSystemManager().readFileSync(url, "base64")
    let that = this
    wx.uploadFile({
      filePath: url,
      name: 'multipartFiles', //后台接收图片的字段
      url: app.globalData.baseURL + "/wtcrm/clueFollow/upLoadClueFollowFile",
      method: "post",
      formData: imgbase64,
      header: {
        "Content-Type": "multipart/form-data",
        'Authorization': 'Bearer ' + that.data.accessInfo.access_token,
      },
      success(res) {
        let result = JSON.parse(res.data)
        if (result.code == CodeMsg.CODE_0) {
          that.setData({
            shareMemberUrl: result.data[0].url
          })
          wx.hideLoading({
            success: (res) => {},
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      accessInfo: wx.getStorageSync('accessInfo')
    })
    if (options.name) {
      this.setData({
        name: options.name
      })
    }
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