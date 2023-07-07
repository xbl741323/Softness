// classRoom/pages/detail/info/info.js
const app = getApp()
import {
  getNoticeDetail,
  getIndustryDetail,
  recommendProducts,
  delCollect,
  addCollect,
  selectIsCollect
} from "../../../../utils/api/search"
const crypto  = require('../../../../utils/cryptoPro.js');
const WxParse = require('../wxParse/wxParse.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: null,
    number: null,//文章编号
    id: null,//文章id
    sort: '',//文章排序规则
    dataList: {},//文章详情数据
    isCollected: null,//收藏状态
    prods: [],//产品ID
    prodList: [],//产品列表
    imageUrl: app.globalData.imageURL,
    iconUrl: {
      pdf: '../../../../image/file/icon_pdf.png',
      doc: '../../../../image/file/icon-word.png',
      docx: '../../../../image/file/icon-word.png',
      xls: '../../../../image/file/icon_xls.png',
      xlsx: '../../../../image/file/icon_xls.png',
      ppt: '../../../../image/file/icon_ppt.png',
      pptx: '../../../../image/file/icon_ppt.png',
    },
    fileTypeArr: ['doc', 'docx', 'ppt', 'pptx', 'pdf', 'xls', 'xlsx']
  },
  // 通知公告
  getNoticeDetail(){
    let params = {
      number: this.data.number,
      type: 0,
      id: this.data.id
    }
    getNoticeDetail(params).then(res => {
      if(res.code == 1000){
        let str = crypto.aesDecode(res.data.detail.content)
        res.data.detail.content = str
        let that = this
        let articleArray = [{
          content: res.data.detail.content
        }];
         for (let i = 0; i < articleArray.length; i++) {
          WxParse.wxParse('article' + i, 'html', articleArray[i].content, that);
          if (i === articleArray.length - 1) {
            WxParse.wxParseTemArray("articleArray", 'article', articleArray.length, that);
          }
        }
        that.setData({
          dataList: res.data.detail,
          prods: res.data.detail.prods,
        })
        if(res.data.detail.prods&&res.data.detail.prods.length>0){
          that.getProdList()
        }
      }
    })
  },
  // 行业资讯
  getIndustryDetail(){
    getIndustryDetail(this.data.number).then(res => {
      if(res.code == 0){
        let that = this
        let articleArray = [{
          content: res.data.content
        }];
         for (let i = 0; i < articleArray.length; i++) {
          WxParse.wxParse('article' + i, 'html', articleArray[i].content, that);
          if (i === articleArray.length - 1) {
            WxParse.wxParseTemArray("articleArray", 'article', articleArray.length, that);
          }
        }
        that.setData({
          dataList: res.data,
        })
      }
    })
  },
  // 获取推荐产品
  getProdList(){
    let params = {
      spuIds: []
    }
    if(this.data.prods&&this.data.prods.length>0){
      this.data.prods.forEach(item => {
        params.spuIds.push(item.spuId)
      })
      recommendProducts(params).then(res => {
        if(res.code == 0){
          this.setData({
            prodList: res.data
          })
        }
      })
    }
  },
  // 跳转到产品详情页面
  skipToSpecial(e) {
    if (wx.getStorageSync('userInfo')) {
      let item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: `/search/pages/productdetails/productdetails?id=${item.id}&type=${item.categoryId}`
      })
    } else {
      wx.showToast({
        title: '您还未登录,请先登录吧~',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function () {
        wx.navigateTo({
          url: "/personal/pages/wxLogin/wxLogin"
        })
      }, 500)
    }
  },
  // 跳转卧涛文档详情
  toFileDetail(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/personal/pages/wtFile/fileDetail/fileDetail?fileId=${item.id}`,
    })
  },
  //收藏
  handleCollect() {
    let isCollected = this.data.isCollected
    let userInfo = wx.getStorageSync('userInfo')
    let parmas = {
      type: this.data.index == 0 ? 1 : 2,
      infoId: this.data.id,
      infoNo: this.data.number,
      infoIds: [this.data.id],
      userId: userInfo.userId,
      collectSource: 3,
    }
    if (isCollected) {
      delCollect(parmas).then(res => {
        if (res.data == 0) {
          wx.showToast({
            title: res.msg,
            icon: "success"
          })
        }
      })
    } else {
      addCollect(parmas).then(res => {
        if (res.data == 0) {
          wx.showToast({
            title: res.msg,
            icon: "success"
          })
        }
      })
    }
    setTimeout(() => {
      this.getIsCollect()
    }, 1000)
  },
  //查询是否收藏
  getIsCollect() {
    let userInfo = wx.getStorageSync('userInfo')
    let parmas = {
      infoId: this.data.id,
      userId: userInfo.userId
    }
    selectIsCollect(parmas).then(res => {
      if (res.code == 0) {
        this.setData({
          isCollected: res.data,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: "error",
        })
      }
    })
  },
  getData(index){
    if(this.data.id){
      if(index == 0){
        this.getNoticeDetail()
      }else{
        this.getIndustryDetail()
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.number){
      this.setData({
        number: options.number,
        id: options.id,
        sort: options.sort,
        index: options.index
      })
    } else {
      if (wx.getStorageSync('policyInfo')) {
        let policyInfo = wx.getStorageSync('policyInfo');
        this.setData({
          id: policyInfo.policyId,
          number: policyInfo.number,
          index: policyInfo.index,
        })
      }
    }
    this.getData(this.data.index)
    this.getIsCollect()
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