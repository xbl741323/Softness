// personal/pages/wtFile/fileDetail/fileDetail.js
const app = getApp();
import {
  docDetail,
  docDownload,
  docPreview
} from '../../../../utils/api/file'
import {
  delCollect,
  addCollect,
  selectIsCollect
} from "../../../../utils/api/search"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    fileDetail: {},
    imageUrl: app.globalData.imageURL,
    urlList: [],
    viewPage: 0,
    total: 0,
    pageSize: 5,
    pageNo: 1,
    reachStatus: false,
    isCollected: null,//收藏状态
    payed: false,
  },

  //文档详情
  getDocDetail() {
    let params = {
      id: this.data.id
    }
    docDetail(params).then(res => {
      if (res.code == 0) {
        let fileDetail = res.data
        fileDetail.createTime = fileDetail.createTime.slice(0,10)
        fileDetail.areaName = fileDetail.areaName.slice(0,10)
        this.setData({
          fileDetail: res.data
        })
      }
    })
  },
  getDocPreview() {
    let userInfo = wx.getStorageSync('userInfo')
    let params = {
      id: this.data.id,
      userId: userInfo.userId,
      pageSize: this.data.pageSize,
      pageNo: this.data.pageNo,
    }
    docPreview(params).then(res => {
      if (res.code == 0) {
        let reachStatus = this.data.reachStatus
        let urlList = this.data.urlList
        let result = res.data.urls ? res.data.urls : []
        urlList = reachStatus == true ? [...urlList, ...result] : result
        if (urlList.length > res.data.viewPage) {
          urlList = urlList.slice(0, res.data.viewPage)
        }
        this.setData({
          urlList: urlList,
          total: res.data.total,
          viewPage: res.data.viewPage,
          payed: res.data.payed
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none"
        })
      }
    })
  },
  //收藏
  handleCollect() {
    let isCollected = this.data.isCollected
    let userInfo = wx.getStorageSync('userInfo')
    let parmas = {
      type: 3,
      infoId: this.data.id,
      infoIds: [this.data.id],
      infoNo: this.data.fileDetail.fileNo,
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
  //下载
  handleDownload() {
    let fileDetail = this.data.fileDetail
    if (fileDetail.pages == 0) {
      let url = this.data.imageUrl + fileDetail.fileSourceUrl
      this.downloadAndSaveFile(url)
    } else {
      let userInfo = wx.getStorageSync('userInfo')
      let params = {
        id: this.data.id,
        userId: userInfo.userId
      }
      docDownload(params).then(res => {
        if(res.code == 0) {
          this.downloadAndSaveFile(res.data)
        } else {
          return wx.showToast({
            title: res.msg,
            icon: "none"
          })
        }
      })
    }
  },
  downloadAndSaveFile(url) {
    let that = this
    wx.downloadFile({
      // 示例 url，并非真实存在
      url: url,
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fileType: that.data.fileDetail.fileType,
          showMenu: true,
          success: function (res) {
            console.log(res);
            console.log('打开文档成功')
          },
          fail: function (error) {
            console.log(error);
            wx.showToast({
                icon: 'none',
                title: '打开文件失败'
            });
          },
        })
      }
    })
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
  //去付款
  toPay() {
    wx.navigateTo({
      url: `../../../pages/orderFile/payDetail/payDetail?id=${this.data.id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if(options.fileId){
      this.setData({
        id: options.fileId
      })
    } else {
      if (wx.getStorageSync('fileInfo')) {
        let fileInfo = wx.getStorageSync('fileInfo');
        this.setData({
          id: fileInfo.fileId,
        })
      }
    }
    this.getDocDetail()
    this.getDocPreview()
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
    if (this.data.total > this.data.urlList.length) {
      this.setData({
        reachStatus: true,
        pageNo: this.data.pageNo + 1
      })
      this.getDocPreview()
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