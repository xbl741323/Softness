// personal/pages/my-user/follow/follow.js
const app = getApp();
import {
  returnCategory
} from "../../../../utils/clue/clue"
import {
  followOperate,
  userFollowEdit
} from "../../../../utils/api/user"
import * as CodeMsg from "../../../../utils/common/codeMsg";
import {
  throttle
} from "../../../../utils/common/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    followData: {},
    userId: null,
    userType: null,
    followId: "", // 编辑时的跟进id
    fileList: [], // 上传附件列表
    uploadFileList: [], // 已上传文件列表
    showCalendar: false,
    followTypeList: [], // 跟进方式列表
    followInfo: {
      followType: null,
      followTypeId: null,
      followContent: "",
      followTime: "",
    },
    isEdit: false,
    accessInfo: {},
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
      if (type === 'hour') {
        return `${value}时`;
      }
      if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    },
  },
  // 初始值赋值
  setOriginalData(options) {
    if (options.userId) {
      this.setData({
        userId: options.userId,
        userType: options.userType
      })
    }
    if (options.data) {
      let data = JSON.parse(options.data)
      let followInfo = this.data.followInfo
      let fileList = this.data.fileList
      followInfo.followType = data.followTypeName
      followInfo.followTypeId = data.followTypeId
      followInfo.followContent = data.followContent
      followInfo.followTime = data.nextFollowTime
      let uploadFileList = this.data.uploadFileList
      let file1 = []
      uploadFileList = data.files
      data.files.forEach(item => {
        file1.push({
          name: item.name,
          url: app.globalData.imageURL + item.url
        })
      })
      this.setData({
        userId: options.userId,
        userType: options.userType,
        followInfo: followInfo,
        followData: data,
        fileList: file1,
        uploadFileList: uploadFileList,
        isEdit: true
      })
    }
  },
  // 修改跟进内容/其他产品 type: 0-其他产品 1-跟进内容
  changeInput(e) {
    let type = e.currentTarget.dataset.type
    let val = e.detail.value.trim()
    let followInfo = this.data.followInfo
    type == 1 ? followInfo.followContent = val : followInfo.productOther = val
    this.setData({
      followInfo: followInfo
    })
  },
  // 提交跟进-防重复提交
  throttleSubmit: throttle(function () {
    if (this.data.isEdit) {
      this.userFollowEdit()
    } else {
      this.submitOperate()
    }
  }, 2000),
  uploadImage(item, name) {
    let imgbase64 = 'data:image/png;base64,' + wx.getFileSystemManager().readFileSync(item.url, "base64")
    let that = this
    let uploadFileList = that.data.uploadFileList
    wx.uploadFile({
      filePath: item.url,
      name: 'multipartFiles', //后台接收图片的字段
      url: app.globalData.baseURL + "/wtuims/tmuserfollow/upLoadUserFollowFile",
      method: "post",
      formData: imgbase64,
      header: {
        "Content-Type": "multipart/form-data",
        'Authorization': 'Bearer ' + that.data.accessInfo.access_token,
      },
      success(res) {
        let result = JSON.parse(res.data)
        if (result.code == CodeMsg.CODE_0) {
          uploadFileList.push({
            name: name,
            url: result.data[0].url,
          })
          that.setData({
            uploadFileList: uploadFileList
          })
        }
      }
    })
  },
  // 上传文件
  fixParams() {
    let fileList = this.data.fileList
    let followInfo = this.data.followInfo
    let isEdit = this.data.isEdit
    let uploadFileList = this.data.uploadFileList
    let params = {
      userId: parseInt(this.data.userId),
      followTypeId: followInfo.followTypeId, // 跟进方式id
      followTypeName: followInfo.followType, // 跟进方式
      followContent: followInfo.followContent, // 跟进内容
    }
    if (followInfo.followTime) {
      followInfo.followTime = isEdit ? followInfo.followTime.slice(0, 16) : followInfo.followTime
      params.nextFollowTime = followInfo.followTime
    } else {
      params.nextFollowTime = null
    }
    if (fileList.length > 0) {
      params.files = uploadFileList
    } else {
      params.files = []
    }
    return params
  },
  // 用户跟进
  submitOperate() {
    let followInfo = this.data.followInfo
    if (followInfo.followTypeId == null || followInfo.followContent == "") {
      wx.showToast({
        icon: "none",
        title: followInfo.followTypeId == null ? '请选择跟进方式！' : '请填写跟进内容！',
      })
      return false
    }
    let params = this.fixParams()
    let userId = this.data.userId
    let userType = this.data.userType
    followOperate(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        wx.showToast({
          icon: "success",
          title: '跟进成功！',
          duration: 1500
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 500)
      } else {
        wx.showToast({
          icon: "none",
          title: res.msg,
          duration: 1500
        })
      }
    })
  },
  // 用户跟进编辑
  userFollowEdit() {
    let followInfo = this.data.followInfo
    if (followInfo.followTypeId == null || followInfo.followContent == "") {
      wx.showToast({
        icon: "none",
        title: followInfo.followTypeId == null ? '请选择跟进方式！' : '请填写跟进内容！',
      })
      return false
    }
    let params = this.fixParams()
    params.id = this.data.followData.id
    let userId = this.data.userId
    let userType = this.data.userType
    userFollowEdit(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        wx.showToast({
          icon: "success",
          title: '跟进编辑成功！',
          duration: 1500
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 500)
      } else {
        wx.showToast({
          icon: "none",
          title: res.msg,
          duration: 1500
        })
      }
    })
  },
  // 删除图片
  deleteFile(e) {
    let index = e.detail.index
    let fileList = this.data.fileList
    let uploadFileList = this.data.uploadFileList
    fileList.splice(index, 1)
    uploadFileList.splice(index, 1)
    this.setData({
      fileList: fileList,
      uploadFileList: uploadFileList
    })
  },
  afterRead(e) {
    let fileList = this.data.fileList
    let temFileList = e.detail.file
    temFileList.forEach(item => {
      fileList.push({
        url: item.url,
        name: item.url.slice(11),
      })
      this.uploadImage(item, item.url.slice(11))
    })
    this.setData({
      fileList: fileList
    })
  },
  // 时间格式操作
  formatDate(date) {
    date = new Date(date);
    let year = date.getFullYear()
    let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    let day = String(date.getDate()).length == 1 ? '0' + date.getDate() : date.getDate()
    let hour = String(date.getHours()).length == 1 ? '0' + date.getHours() : date.getHours()
    let minute = String(date.getMinutes()).length == 1 ? '0' + date.getMinutes() : date.getMinutes()
    return `${year}-${month}-${day} ${hour}:${minute}`;
  },
  // 确定选择时间
  onConfirm(e) {
    let date = e.detail
    let followInfo = this.data.followInfo
    followInfo.followTime = this.formatDate(date)
    this.setData({
      followInfo: followInfo
    })
    this.onClose()
  },
  // 关闭时间弹窗
  onClose() {
    this.setData({
      showCalendar: false
    })
  },
  // 展示时间弹窗
  bindShow() {
    this.setData({
      showCalendar: true
    })
  },
  // 修改跟进方式
  changeFollowType(e) {
    let index = Number(e.detail.value)
    let followInfo = this.data.followInfo
    let followTypeList = this.data.followTypeList
    followInfo.followType = followTypeList[index].name
    followInfo.followTypeId = followTypeList[index].id
    this.setData({
      followInfo: followInfo
    })
  },
  // 设置跟进方式
  setFollowType() {
    let optionList = returnCategory()[9].optionList
    this.setData({
      followTypeList: optionList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      accessInfo: wx.getStorageSync('accessInfo'),
    })
    this.setOriginalData(options)
    this.setFollowType()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // 页面卸载时移除选择产品
    wx.removeStorageSync('selectedPro')
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

})