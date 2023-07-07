// additional/pages/meet-visit/meet-visit.js
const app = getApp();
import Wxml2Canvas from 'wxml2canvas';
const QQMapWX = require('../../../utils/common/qqmap-wx-jssdk.min.js'); // 引入SDK核心类
const qqmapsdk = new QQMapWX({
  key: '23YBZ-ATLCP-N3LDV-L6UZH-HNC5Q-EQB4C' // 卧涛腾讯KEY-实例化API核心类
});
import {
  returnCategory
} from "../../../utils/clue/clue"
import {
  addMeetVisit,
  getVisitClue
} from "../../../utils/api/meet-visit"
import * as CodeMsg from "../../../utils/common/codeMsg";
import {
  throttle
} from "../../../utils/common/utils"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: {
      reachStatus: false,
      total: 0,
      currentPage: 1,
      pageSize: 20,
    },
    showOverlay: false, // 控制遮罩显示
    isSelectStatus: false, // 是否是选择的客户
    valueArr: [0],
    customerList: [], // 查询到的客户集合
    originalFollowTypeId: '', // 初识跟进方式id
    // 展示拍照页面参数-起
    hideStatus: true,
    imgUrl: '',
    shareMemberUrl: '',
    watermarkName: '',
    // 展示拍照页面参数-尾
    showPhoto: false, // 展示拍照页面
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
      imgUrl: ''
    },
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
      operateEmpId: ""
    },
    accessInfo: {},
    clueInfo: {
      clueId: '',
      clueNo: '',
      clueName: '',
      clueType: ''
    }, // 线索对象
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
  // 捕获操作
  fetchOperate() {},
  // 获取关联客户名称线索
  getVisitConnectClue() {
    let page = this.data.page
    let reachStatus = page.reachStatus
    let params = {
      pageNo: page.currentPage,
      pageSize: page.pageSize,
      keywords: this.data.clueInfo.clueName
    }
    getVisitClue(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let result = res.data.records
        let customerList = this.data.customerList
        page.total = res.data.total
        page.reachStatus = false
        this.setData({
          customerList: reachStatus ? customerList.concat(result) : result,
          page: page,
          reachStatus: false
        })
      }
    })
  },
  // 显示遮罩
  showModel() {
    this.setData({
      showOverlay: true
    })
  },
  // 隐藏遮罩
  hideModel() {
    this.setData({
      showOverlay: false
    })
  },
  // 点击确认按钮，选择客户
  confirmSelectCoustomer() {
    let index = this.data.valueArr[0]
    let customerList = this.data.customerList
    let page = this.data.page
    page.currentPage = 1
    if (customerList.length > 0) {
      let obj = customerList[index]
      let clueInfo = this.data.clueInfo
      clueInfo.clueId = obj.clueId
      clueInfo.clueNo = obj.clueNo
      clueInfo.clueName = obj.clueName
      clueInfo.clueType = obj.clueType
      this.setData({
        clueInfo: clueInfo,
        showOverlay: false,
        isSelectStatus: true,
        page: page
      })
    } else {
      this.setData({
        isSelectStatus: false,
        page: page
      })
    }
  },
  // 修改客户名称
  changeClueInput(e) {
    let val = e.detail.value.trim()
    let clueInfo = this.data.clueInfo
    let page = this.data.page
    let valueArr = this.data.valueArr
    valueArr = [0]
    page.currentPage = 1
    let showOverlay = val != '' ? true : false
    clueInfo.clueName = val
    this.setData({
      page: page,
      clueInfo: clueInfo,
      showOverlay: showOverlay,
      valueArr: valueArr
    })
    this.getVisitConnectClue()
  },
  // 清空客户名称
  clearClueInput() {
    let clueInfo = this.data.clueInfo
    let valueArr = this.data.valueArr
    valueArr = [0]
    let page = this.data.page
    clueInfo.clueNo = ''
    clueInfo.clueId = ''
    clueInfo.clueName = ''
    clueInfo.clueType = ''
    page.currentPage = 1
    this.setData({
      clueInfo: clueInfo,
      showOverlay: false,
      isSelectStatus: false,
      page: page,
      valueArr: valueArr
    })
  },
  // 修改选择客户
  changePicker(e) {
    let customerList = this.data.customerList
    let page = this.data.page
    let cIndex = Number(e.detail.value) + 1
    if ((cIndex == customerList.length) && (page.total > customerList.length)) {
      page.currentPage = page.currentPage + 1
      page.reachStatus = true
      this.setData({
        page: page
      })
      this.getVisitConnectClue()
    }
    this.setData({
      valueArr: e.detail.value
    })
  },
  /**
   * 拍照页面-始
   */
  // 进行拍照
  choosePhoto() {
    let that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera'],
      sizeType: ['compressed'],
      camera: 'back',
      success(res) {
        that.setData({
          imgUrl: res.tempFiles[0].tempFilePath,
          hideStatus: true
        })
        wx.showLoading({
          title: '加载中，请稍等',
        })
        that.drawCanvas()
      },
      fail(err) {
        console.log(err)
        if (that.data.imgUrl == '') {
          that.submit()
        } else {
          that.setData({
            hideStatus: false
          })
        }
      },
      complete() {}
    })
  },
  // 提交
  submit() {
    let locationInfo = this.data.locationInfo
    locationInfo.imgUrl = this.data.shareMemberUrl
    this.setData({
      locationInfo: locationInfo,
      showPhoto: false
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
      background: '#ffffff', // 默认背景色
      progress(percent) { // 绘制进度
      },
      finish(url) {
        that.uploadPhotoImage(url)
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
  uploadPhotoImage(url) {
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
            shareMemberUrl: result.data[0].url,
            hideStatus: false
          })
          wx.hideLoading({
            success: (res) => {},
          })
        }
      }
    })
  },
  /**
   * 拍照页面-尾
   */
  // 位置权限授权
  checkLocation() {
    let that = this
    wx.getSetting({
      success: (res) => {
        console.log(res, 'res')
        if (res.authSetting['scope.userLocation'] === false) { // 非初始化进入该页面,且未授权(之前授权拒绝)
          wx.showModal({
            title: '是否授权当前位置',
            content: '请确认授权，您的位置信息将用于小程序打卡签到功能',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '授权失败',
                  icon: 'error',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    console.log(dataAu, 'dataAu')
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      that.setData({
                        isPermission: true
                      })
                      //再次授权，调用getLocationt的API
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'error',
                        duration: 1000
                      })
                      that.setData({
                        isPermission: false
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] === true) { // 初始化进入
          that.getLocation();
          that.setData({
            isPermission: true
          })
        } else if (!res.authSetting['scope.userLocation']) { // 初始化进入
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.showToast({
                title: '授权成功',
                icon: 'success',
                duration: 1000
              })
              that.setData({
                isPermission: true
              })
              //再次授权，调用getLocationt的API
              that.getLocation();
            },
            fail() {
              wx.showToast({
                title: '授权失败',
                icon: 'error',
                duration: 1000
              })
              that.setData({
                isPermission: false
              })
            }
          })
        }
      }
    });
  },
  // 获取当前业务员位置信息
  getLocation() {
    let that = this
    qqmapsdk.reverseGeocoder({
      success: function (res) {
        let r = res.result
        let locationInfo = that.data.locationInfo
        locationInfo.addressName = r.address_component.street_number || r.formatted_addresses.recommend
        locationInfo.addressDetail = r.formatted_addresses.recommend
        that.setData({
          locationInfo: locationInfo,
          defaultInfo: res.result
        })
        console.log(that.data.defaultInfo, '业务员当前默认定位信息')
      },
      fail: function (res) {},
      complete: function (res) {}
    })
  },
  checkOperateFollow() {
    this.chooseLocation()
  },
  // 获取业务员选择的定位信息
  chooseLocation() {
    if (this.data.isPermission) {
      let that = this
      wx.chooseLocation({
        success: (res) => {
          that.setData({
            chooseInfo: res
          })
          let lat1 = that.data.chooseInfo.latitude
          let lon1 = that.data.chooseInfo.longitude
          let lat2 = that.data.defaultInfo.location.lat
          let lon2 = that.data.defaultInfo.location.lng
          let locationInfo = that.data.locationInfo
          locationInfo.addressName = res.name
          locationInfo.addressDetail = res.address
          that.getDistances(lat1, lon1, lat2, lon2)
          console.log(that.data.chooseInfo, "业务员选择的定位信息")
        }
      })
    } else {
      this.checkLocation()
    }
  },
  // 打卡拍照预检查
  checkTakePhoto() {
    if (this.data.isPermission) {
      this.takePhoto()
    } else {
      this.checkLocation()
    }
  },
  // 打卡拍照
  takePhoto() {
    let locationInfo = this.data.locationInfo
    if (locationInfo.imgUrl != '') {
      wx.previewImage({
        urls: [this.data.imageURL + locationInfo.imgUrl] // 需要预览的图片http链接列表
      })
    } else {
      let locationInfo = this.data.locationInfo
      if (locationInfo.distance >= 800) {
        wx.showToast({
          icon: 'none',
          title: '请选择800米范围内的定位地址！',
        })
      } else {
        let name = this.data.chooseInfo.name
        let defaultName = this.data.defaultInfo.formatted_addresses.recommend
        this.setData({
          showPhoto: true,
          watermarkName: name != null ? name : defaultName
        })
        this.choosePhoto()
      }
    }
  },
  // 根据经纬度计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
  getDistances(lat1, lng1, lat2, lng2) {
    let that = this
    qqmapsdk.calculateDistance({
      // mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      mode: 'walking',
      // 获取表单提交的经纬度并设置from和to参数（示例为string格式）
      from: lat1 + ',' + lng1, // 若起点有数据则采用起点坐标，若为空默认当前地址
      to: lat2 + ',' + lng2, // 终点坐标
      success: function (res) {
        let locationInfo = that.data.locationInfo
        locationInfo.distance = res.result.elements[0].distance
        that.setData({
          locationInfo: locationInfo
        })
        console.log(that.data.locationInfo, "输出定位对象")
      }
    }, )
  },
  // 删除打卡图片
  deleteLocationImg() {
    let locationInfo = this.data.locationInfo
    locationInfo.imgUrl = ''
    this.setData({
      locationInfo: locationInfo,
      imgUrl: '',
      shareMemberUrl: '',
      watermarkName: ''
    })
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
    let clueInfo = this.data.clueInfo
    console.log(clueInfo)
    if (clueInfo.clueName === '') {
      wx.showToast({
        icon: 'none',
        title: '请输入客户名称！',
      })
    } else {
      this.checkSubmit()
    }
  }, 2000),
  // 见面拜访必填项校验
  checkSubmit() {
    let locationInfo = this.data.locationInfo
    if (locationInfo.addressName == '' || locationInfo.imgUrl == '' || locationInfo.distance >= 800) {
      wx.showToast({
        icon: 'none',
        title: locationInfo.addressName == '' ? '请选择定位信息！' : locationInfo.distance >= 800 ? '请选择800米范围内的定位地址！' : '请拍照打卡，上传位置图片！',
      })
    } else {
      this.submitOperate()
    }
  },
  // 获取指定产品格式
  getProInfo() {
    let selectProduct = this.data.selectProduct
    let result = []
    selectProduct.forEach(item => {
      result.push({
        spuId: item.id, // 产品ID
        followSpuCode: item.spuCode, // 跟进产品编号
        followSpuName: item.spuTitle, // 跟进产品名称
      })
    })
    return result;
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
    let clueInfo = this.data.clueInfo
    let followInfo = this.data.followInfo
    let locationInfo = this.data.locationInfo
    let selectProduct = this.data.selectProduct
    let params = {
      followTypeId: followInfo.followTypeId, // 跟进方式id
      followContent: followInfo.followContent, // 跟进内容
      nextFollowTime: followInfo.followTime == '' ? null : followInfo.followTime, // 下次跟进时间
      otherSpu: followInfo.productOther, // 其他产品
      clueFollowSpuList: selectProduct.length > 0 ? this.getProInfo() : null, // 跟进产品列表 max-3
      clueFollowFileList: null, // 跟进附件列表 max-5
      locationName: locationInfo.addressName, // 位置名称
      locationDetail: locationInfo.addressDetail, // 具体位置
      clockPictureUrl: locationInfo.imgUrl, // 打开拍照图片地址
      customerName: clueInfo.clueName // 客户名称
    }
    if (clueInfo.clueId != '') {
      params.clueId = clueInfo.clueId // 线索ID
      params.clueNo = clueInfo.clueNo // 线索ID
      params.clueType = clueInfo.clueType // 线索类型 1-个人 2-单位
      params.clueName = clueInfo.clueName
    }
    if (fileList.length > 0) {
      params.clueFollowFileList = this.data.uploadFileList
    }
    return params
  },
  submitOperate() {
    let followInfo = this.data.followInfo
    if (followInfo.followContent == "") {
      wx.showToast({
        icon: "none",
        title: '请填写跟进内容！',
      })
    } else {
      let params = this.fixParams()
      addMeetVisit(params).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          wx.showToast({
            icon: "success",
            title: '跟进成功！',
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
  // 时间格式操作
  formatDate(date) {
    date = new Date(date);
    let year = date.getFullYear()
    let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    let day = String(date.getDate()).length == 1 ? '0' + date.getDate() : date.getDate()
    return `${year}-${month}-${day}`;
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
  // 去产品显示页面
  toSelect() {
    wx.navigateTo({
      url: `/personal/pages/my-order/select-product/select-product?pageFrom=${1}`,
    })
  },
  // 选择产品后回显产品
  setSelectedPro() {
    if ((wx.getStorageSync('selectedPro') && this.data.selectProduct.length == 0) || wx.getStorageSync('addNewPro')) {
      wx.removeStorageSync('addNewPro')
      let selectedPro = wx.getStorageSync('selectedPro')
      this.setData({
        selectProduct: selectedPro,
      })
    }
  },
  // 设置线索信息
  setClueInfo() {
    let env = this.data.env
    let followInfo = this.data.followInfo
    followInfo.followTypeId = (env == 'develop' ? 109 : env == 'trial' ? 58 : 58)
    followInfo.followType = '见面拜访'
    this.setData({
      followInfo: followInfo
    })
    this.checkLocation()
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
      accessInfo: wx.getStorageSync('accessInfo')
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
  onShow() {
    this.setSelectedPro()
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