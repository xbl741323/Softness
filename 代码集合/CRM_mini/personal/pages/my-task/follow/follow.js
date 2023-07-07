// personal/pages/my-clue/follow/follow.js
const app = getApp();
const QQMapWX = require('../../../../utils/common/qqmap-wx-jssdk.min.js'); // 引入SDK核心类

import {
  returnCategory
} from "../../../../utils/clue/clue"
import {
  followCustomer
} from "../../../../utils/api/mytask"
import * as CodeMsg from "../../../../utils/common/codeMsg";
import {
  throttle
} from "../../../../utils/common/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numState: 0,
    followId: "", // 编辑时的跟进id
    env: __wxConfig.envVersion,
    imageURL: app.globalData.imageURL,
    isPermission: false, // 位置权限是否授权
    defaultInfo: {}, // 业务员当前位置信息
    chooseInfo: {}, // 业务员选择的位置信息
    locationInfo: { // 定位打卡info
      addressName: '',
      addressDetail: '',
      distance: 0,
      imgUrl: '',
      clueFollowId: null
    },
    operateType: 0, // 0-创建 1-编辑
    fileList: [], // 上传附件列表
    uploadFileList: [], // 已上传文件列表
    showCalendar: false,
    followTypeList: [], // 跟进方式列表
    followInfo: {
      followType: null,
      followTypeId: null,
      followContent: "",
      followTime: "",
      productOther: "",
      id: null,
      orderTaskId: null
    },
    accessInfo: {},
    clueType: 2, // 线索类型
    taskInfo: {}, // 线索对象
    selectProduct: [], // 选择跟进产品列表
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
      return value;
    },
  },
  checkOperateFollow() {
    let operateType = this.data.operateType
    if (operateType == 0) {
      this.chooseLocation()
    }
  },
  // 提交跟进-防重复提交
  throttleSubmit: throttle(function () {
    this.checkSubmit()
  }, 2000),
  // 见面拜访必填项校验
  checkSubmit() {
    this.submitOperate()
  },
  uploadImage(item, name) {
    let imgbase64 = 'data:image/png;base64,' + wx.getFileSystemManager().readFileSync(item.url, "base64")
    let uploadFileList = this.data.uploadFileList
    let that = this
    wx.uploadFile({
      filePath: item.url,
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
    let taskInfo = this.data.taskInfo
    let followInfo = this.data.followInfo
    let params
    if (this.data.operateType == 0) {
      params = {
        followTypeName: this.data.taskInfo.spuName,
        orderTaskId: taskInfo.id + '', // 线索ID
        followType: followInfo.followTypeId, // 跟进方式id
        followContent: followInfo.followContent, // 跟进内容
        followTypeName: followInfo.followType,
        taskNo: this.data.taskInfo.taskNo,
        taskFollowFileList: this.data.uploadFileList
      }



    } else {
      params = {
        clueFollowId: followInfo.clueFollowId,
        followContent: followInfo.followContent, // 跟进内容
        orderTaskId: followInfo.orderTaskId + '',
        followType: followInfo.followTypeId, // 跟进方式id
        id: followInfo.id,
        // orderTaskId: followInfo.orderTaskId,
        spuName: this.data.taskInfo.spuName,
        taskNo: this.data.taskInfo.taskNo,
        taskFollowFileList: this.data.uploadFileList
      }
    }
    return params
  },
  submitOperate() {
    let followInfo = this.data.followInfo
    if (followInfo.followTypeId == null || followInfo.followContent == "") {
      wx.showToast({
        icon: "none",
        title: followInfo.followTypeId == null ? '请选择跟进方式！' : '请填写跟进内容！',
      })
    } else {


      let obj = this.fixParams()
      followCustomer(obj, this.data.operateType).then(res => {
        let operateType = this.data.operateType
        if (res.code == 0) {
          wx.showToast({
            icon: "success",
            title: operateType == 0 ? '跟进成功！' : '编辑成功！',
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 500)
        }
      })
    }
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

  changeInput(e) {
    let followInfo = this.data.followInfo
    followInfo.followContent = e.detail.value
    this.setData({
      followInfo
    })
  },
  // 设置线索信息
  setClueInfo(options) {
    if (options.taskInfo) {
      let r = JSON.parse(options.taskInfo)
      this.setData({
        clueType: options.clueType,
        taskInfo: r
      })
    }
    if (options.followInfo) {
      let locationInfo = this.data.locationInfo
      let r = JSON.parse(options.followInfo)
      locationInfo.addressName = r.locationName
      locationInfo.addressDetail = r.locationDetail
      locationInfo.imgUrl = r.pictureUrl
      this.setFollowInfo(r)
      this.setData({
        locationInfo: locationInfo
      })
    }
  },
  // 跟进线索编辑回显
  setFollowInfo(r) {
    wx.setNavigationBarTitle({
      title: '跟进编辑',
    })
    let followInfo = this.data.followInfo
    let selectProduct = this.data.selectProduct
    let taskInfo = this.data.taskInfo
    if (r && r.taskFollowFileList) {
      r.taskFollowFileList.forEach(item => {
        selectProduct.push({
          id: item.spuId,
          spuCode: item.followSpuCode,
          spuTitle: item.followSpuName
        })
      })
    }
    let clueFollowFileList = []
    if (r && r.taskFollowFileList) {
      r.taskFollowFileList.forEach(item => {
        clueFollowFileList.push({
          name: item.name,
          url: app.globalData.imageURL + item.url
        })
      })
    }
    followInfo.followTypeId = r.followType
    followInfo.followType = r.followTypeName
    followInfo.followContent = r.followContent
    followInfo.followTime = r.nextFollowTime
    followInfo.productOther = r.otherSpu
    followInfo.orderTaskId = r.orderTaskId
    followInfo.id = r.id
    followInfo.clueFollowId = r.clueFollowId
    taskInfo.spuName = r.orderSpuName
    taskInfo.taskNo = r.taskNo
    let arr = []
    if (r.taskFollowFileList) {
      arr = r.taskFollowFileList.map(item => ({
        name: item.name,
        url: item.url
      }))
    }
    this.setData({
      taskInfo: taskInfo,
      followInfo: followInfo,
      selectProduct: selectProduct,
      operateType: 1,
      followId: r.id,
      fileList: clueFollowFileList,
      uploadFileList: arr,
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
    this.setFollowType()
    this.setClueInfo(options)
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
  onUnload() {},

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