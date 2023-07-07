// personal/pages/my-clue/follow/follow.js
const app = getApp();
import {
  getMyLogList
} from "../../../../utils/api/myblogs";
import {
  editLog,
  addLog,
  getStateList
} from "../../../../utils/api/myblogs"
import {
  throttle
} from "../../../../utils/common/utils"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editDisabled: false,
    listdate: [],
    text: '',
    logstate: false,
    imageUrl: app.globalData.imageURL,
    userInfo: {},
    status: false,
    followId: "", // 编辑时的跟进id
    operateType: 0, // 0-创建 1-编辑
    fileList: [], // 上传附件列表
    uploadFileList: [], // 已上传文件列表
    showCalendar: false,
    followTypeList: [], // 跟进方式列表
    todayTheTime: null,
    detailObj: {
      content: "\n今日工作：\n\n\n\n明日计划：\n\n\n\n心得体会：",
      journalTime: null,
      productOther: ""
    },
    accessInfo: {},
    clueType: 2, // 线索类型
    clueInfo: {}, // 线索对象
    selectProduct: [],
    currentDate: new Date().getTime(),
    mydate: new Date().toString(),
    mylist: [],
    homeClick: false
  },
  handleDateClick: function ({
    detail: {
      date
    }
  }) {
    let detailObj = this.data.detailObj
    detailObj.journalTime = this.filetData(this.data.mydate, 0)
    this.setData({
      showCalendar: false,
      mydate: date,
      detailObj: detailObj,
      fileList: [],
      uploadFileList: []
    });
    let arr = this.data.selectProduct.filter(item => {
      return item.journalTime == this.filetData(this.data.mydate, 0)
    })
    if (arr.length > 0) {
      arr.forEach(item => {
        if (item.id) {
          this.filterArr(item.pictures)
          this.setData({
            detailObj: {
              content: item.content,
              productOther: "",
              journalTime: item.journalTime,
              id: item.id,
              isEdit: item.isEdit,
              isEffective: item.isEffective,
            },
            editDisabled: false
          })
        } else {
          let time = this.filetData(this.data.mydate, 0)
          this.setData({
            detailObj: {
              content: "\n今日工作：\n\n\n\n明日计划：\n\n\n\n心得体会：",
              productOther: "",
              journalTime: time,
              isEdit: item.isEdit,
              isEffective: item.isEffective,
            },
            editDisabled: false
          })
        }
      })
    } else {
      let detailObj = this.data.detailObj
      detailObj.journalTime = this.getFixDay(date)
      detailObj.content = ''
      detailObj.isEdit = 1
      this.setData({
        detailObj: detailObj,
        fileList: [],
        editDisabled: true
      })
    }
  },

  handleMonthClick: function ({
    detail: {
      date
    }
  }) {
    this.setData({
      mydate: date
    });
    this.getState(this.filetData(date, 1))
  },
  getState(date) {
    getStateList(date).then(res => {
      if (res.code == 0 && res.data) {
        this.filteArrDate(res.data)
        this.setData({
          selectProduct: res.data
        })
      }
    })
  },
  filteArrDate(arr) {
    let list = []
    arr.forEach(item => {
      list.push({
        id: item.id,
        day: Number(item.journalTime.substring(item.journalTime.length - 2)),
        isEdit: item.isEdit,
        isEffective: item.isEffective,
        journalTime: item.journalTime
      })
    })
    list.forEach(val => {
      if (val.isEffective == 3) {
        if (this.filterWeek(new Date(val.journalTime))) {} else {
          val.point = true
        }
      } else {
        val.point = true
      }
    })
    this.setData({
      mylist: list
    })
  },
  filterWeek(date) {
    if (date.getDay() === 6 || date.getDay() === 0) {
      return true;
    } else {
      return false;
    }
  },
  filetData(val, type) {
    const crtTime = new Date(val);
    let yyyy = crtTime.getFullYear();
    let MM = crtTime.getMonth() + 1;
    let dd = crtTime.getDate();
    MM = MM < 10 ? "0" + MM : MM;
    dd = dd < 10 ? "0" + dd : dd;
    if (type == 0) {
      return yyyy + "-" + MM + "-" + dd
    } else {
      return yyyy + "-" + MM
    }
  },
  filterArr(arr) {
    if (arr) {
      let r1 = arr.map(item => ({
        url: this.data.imageUrl + item.replace(/\s*/g, "")
      }))

      let r2 = []
      if (arr.length > 0) {
        arr.forEach(item => {
          r2.push({
            url: item
          })
        })
      }
      console.log(r1);
      this.setData({
        fileList: r1,
        uploadFileList: r2.length > 0 ? r2 : []
      })
    }
  },
  changeInput(e) {
    let type = e.currentTarget.dataset.type
    let val = e.detail.value.trim()
    let detailObj = this.data.detailObj
    type == 1 ? detailObj.content = val : detailObj.productOther = val
    this.setData({
      detailObj: detailObj
    })
  },
  throttleSubmit: throttle(function () {
    this.finalSubmit()
  }, 2000),
  // 提交跟进-防重复提交
  finalSubmit() {
    if (this.data.status) {
      let imgList = this.data.uploadFileList
      let imgData = []
      if (imgList.length > 0) {
        imgList.forEach(item => {
          imgData.push(item.url)
        })
      }
      let data = {
        content: this.data.detailObj.content,
        journalTime: this.data.detailObj.journalTime == null ? this.data.todayTheTime : this.data.detailObj.journalTime,
        pictures: imgData
      }
      if (this.data.detailObj.content.length == 0) {
        wx.showToast({
          icon: "none",
          title: '请填写内容',
        })
      } else {
        if (this.data.detailObj.id) {
          data.id = this.data.detailObj.id
          editLog(data).then(res => {
            if (res.code == 0) {
              wx.showToast({
                icon: "success",
                title: '操作成功！',
              })
              wx.setStorageSync('isLogSubmit', true)
              setTimeout(() => {
                wx.navigateBack()
              }, 500)
            }
          })
        } else {
          addLog(data).then(res => {
            if (res.code == 0) {
              wx.showToast({
                icon: "success",
                title: '发布成功！',
              })
              wx.setStorageSync('isLogSubmit', true)
              setTimeout(() => {
                wx.navigateBack()
              }, 500)
            }
          })
        }
      }
    }
    this.setData({
      status: true
    })
  },
  uploadImage(item, name) {
    let imgbase64 = 'data:image/png;base64,' + wx.getFileSystemManager().readFileSync(item.url, "base64")
    let uploadFileList = this.data.uploadFileList
    let that = this
    wx.uploadFile({
      filePath: item.url,
      name: 'file', //后台接收图片的字段
      url: app.globalData.baseURL + "/wtcrm/file/upload",
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
            url: result.data,
          })
          that.setData({
            uploadFileList: uploadFileList
          })
        }
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
  formatDate() {//日期转换
    let date = new Date();
    let year = date.getFullYear()
    let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    let day = String(date.getDate()).length == 1 ? '0' + date.getDate() : date.getDate()
    return `${year}-${month}-${day}`;
  },
  // 编辑数据回显
  setDefaultVal(options) {
    if (options.condition && options.detaildata) {
      this.setOriginalData(JSON.parse(options.detaildata))
      let detailObjJson = JSON.parse(options.detaildata)
      this.setData({
        status: options.condition,
        detailObj: detailObjJson,
      })
    } else if (options && options.condition) {
      this.setData({
        status: options.condition,
      })
    }else if(options.homeClick){//首页填写日志
      let params = {
        current: 1,
        size: 5
      }
      getMyLogList(params).then(res => {
        let records = res.data.records
        records.forEach(item => {
          item.time = item.createTime.slice(-8)
          item.picture = this.filtration(item.pictures)
          item.testList = this.filterPicture(item.pictures)
          item.week = this.showTime(item.journalTime)
          item.isEdit = 0
        })
        let arr;
        let currentDate = this.formatDate()
        if (records) {
          arr = records.filter(item => {
            console.log(item.journalTime == currentDate);
            return item.journalTime == currentDate
          })
          console.log(arr);
        }
        if(arr.length > 0){
          console.log(arr[0]);
          this.setData({
            detailObj:  arr[0],
          })
          this.setOriginalData(arr[0])
        }
        this.setData({
          status: arr.length > 0  ? false : (arr.length == 0 && options.homeClick ? true : false),
          homeClick: options.homeClick,//首页点击跳转过来
        })
        console.log(this.data.status);
      })
    }else {
      this.setOriginalData(JSON.parse(options.detaildata))
      let detailObjJson = JSON.parse(options.detaildata)
      this.setData({
        logstate: true,
        detailObj: detailObjJson
      })
    }
  },
  showTime(date) {
    let show_day = new Array(
      "星期一",
      "星期二",
      "星期三",
      "星期四",
      "星期五",
      "星期六",
      "星期日"
    );
    let time = new Date(date);
    let day = time.getDay();
    let now_time = show_day[day - 1]
    return now_time
  },
  filterPicture(arr){
    if (arr && arr[0]) {
      let r1 = arr.map(item => ({
        url: this.data.imageUrl + item.replace(/\s*/g, "")
      }))
      return r1
    }
    return []
  },
  filtration(arr) {
    if (arr && arr[0]) {
      return arr[0].replace(/\s*/g, "").split(',')
    }
  },
  // 初始值赋值
  setOriginalData(options) {
    if (options && options.pictures && options.pictures[0]) {
      let list = options.pictures
      let obj = []
      list.forEach(item => {
        obj.push({
          url: item
        })
      })
      let testList = options.testList
      this.setData({
        uploadFileList: obj,
        fileList: testList,
      })
    } else {
      this.setData({
        detailObj: options
      })
    }
  },
  getFixDay(temDate) {
    var date = new Date(temDate);
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  // 设置页面标题
  setPageTitle() {
    let status = this.data.status
    wx.setNavigationBarTitle({
      title: status ? '写日志' : '我的日志',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      todayTheTime: this.getFixDay(new Date()),
      userInfo: wx.getStorageSync('userInfo'),
      accessInfo: wx.getStorageSync('accessInfo'),
    })
    this.getState(this.filetData(this.getFixDay(new Date())))
    this.setDefaultVal(options)
    this.setPageTitle()
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