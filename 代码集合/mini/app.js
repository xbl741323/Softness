import {
  checkEmpCode
} from "./utils/api/emp"
App({
  onLaunch() {
    console.log("onlaunch")
    //判断是什么环境
    var env = __wxConfig.envVersion;
    switch (env) {
      case "develop": // 本地开发环境
        // this.globalData.baseURL = "https://www.wotao.com/applet";
        // this.globalData.imageURL = "https://static.wotao.com/";
        // this.globalData.approveUrl = 'https://realnameverify01.fadada.com';
        // this.globalData.signUrl = 'https://textapi02.fadada.com/api2/';
        this.globalData.baseURL = "http://192.168.1.107:6064";
        this.globalData.baseURL = "http://192.168.1.11:6569";
        this.globalData.imageURL = "https://static-tst.wotao.com/";
        this.globalData.approveUrl = 'https://realnameverify-test02.fadada.com';
        this.globalData.signUrl = 'https://testapi02.fadada.com/api/';
        break;
      case "trial": // 测试环境
        // this.globalData.baseURL = "https://www.wotao.com/applet";
        // this.globalData.imageURL = "https://static.wotao.com/";
        // this.globalData.approveUrl = 'https://realnameverify01.fadada.com';
        // this.globalData.signUrl = 'https://textapi02.fadada.com/api2/';
        this.globalData.baseURL = "http://192.168.1.11:6569";
        this.globalData.imageURL = "https://static-tst.wotao.com/";  
        this.globalData.approveUrl = 'https://realnameverify-test02.fadada.com';
        this.globalData.signUrl = 'https://testapi02.fadada.com/api/';
        break;
      case "release": // 线上环境
        this.globalData.baseURL = "https://www.wotao.com/applet";
        this.globalData.imageURL = "https://static.wotao.com/";
        this.globalData.approveUrl = 'https://realnameverify01.fadada.com';
        this.globalData.signUrl = 'https://textapi02.fadada.com/api2/';
        break;
    }
  },
  onShow() {
    // 热启动
    this.getSystemData()
    this.updateEdition()
    this.getLinkId()
  },
  //获取自定义导航栏信息 "navigationStyle": "custom"  
  getSystemData() {
    const {
      system,
      statusBarHeight,
      platform,
      screenWidth,
      screenHeight,
      windowHeight
    } = wx.getSystemInfoSync();
    console.log(system,'systemsystemsystemsystemsystemsystemsystemsystem')
    this.globalData.system = system.indexOf('iOS') != -1 ? 'ios' : 'android';
    console.log(this.globalData.system, "this.globalData.system")
    console.log(wx.getSystemInfoSync(), "wx.getSystemInfoSync()")
    wx.setStorageSync('screenHeight', screenHeight)
    wx.setStorageSync('windowHeight', windowHeight)
    const {
      top,
      height
    } = wx.getMenuButtonBoundingClientRect()
    // 状态栏高度
    wx.setStorageSync('statusBarHeight', statusBarHeight)
    // 胶囊按钮高度 一般是32 如果获取不到就使用32
    wx.setStorageSync('menuButtonHeight', height ? height : 32)
    // 判断胶囊按钮信息是否成功获取
    if (top && top !== 0 && height && height !== 0) {
      const navigationBarHeight = (top - statusBarHeight) * 2 + height
      // 导航栏高度
      wx.setStorageSync('navigationBarHeight', navigationBarHeight)
    } else {
      wx.setStorageSync(
        'navigationBarHeight',
        platform === 'android' ? 48 : 40
      )
    }
    wx.setStorageSync('screenWidth', screenWidth)
    wx.setStorageSync('header-top', wx.getStorageSync('statusBarHeight') + wx.getStorageSync('navigationBarHeight') + 'px')
    wx.setStorageSync('width-background', (64 / 750) * screenWidth + wx.getStorageSync('statusBarHeight') + wx.getStorageSync('navigationBarHeight') + 12);
    // 获取自定义navbar高度
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top, //胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2; //导航高度
        this.globalData.navHeight = navHeight;
        this.globalData.navTop = navTop;
        this.globalData.windowHeight = res.windowHeight;
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  // 小程序版本更新提示
  updateEdition() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.clearStorageSync()
            updateManager.applyUpdate()
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  // 用于未登录状态下登录返回判断
  checkCodeStatus() {
    if (!wx.getStorageSync('userInfo')) {
      wx.setStorageSync('codeStatus', true)
    }
  },
  // 获取扫码过来的linkId
  getLinkId() {
    let codeObj = wx.getEnterOptionsSync()
    let codeUrl = decodeURIComponent(codeObj.query.q);
    if (this.globalData.wxFoucusCode) {
      this.globalData.wxFoucusCode = false;
    }
    console.log(codeUrl, "输出码")
    let startIndex = codeUrl.indexOf('=')
    let linkId = codeUrl.slice(startIndex + 1)
    console.log(linkId, 'linkId');
    console.log(codeUrl, 'codeUrl');
    if (codeObj.query.q && codeObj.query.q !== '') {
      // 存储推广注册码
      if (codeObj.query.q.indexOf('userId') != -1) {
        wx.setStorageSync('linkId', linkId)

      }
      // 存储会员推广码
      if (codeObj.query.q.indexOf('memberId') != -1) {
        wx.setStorageSync('memberId', linkId)
        wx.setStorageSync('linkId', linkId)
      }
      //存储订单
      if (codeObj.query.q.indexOf('orderCodeInfo') != -1) {
        wx.setStorageSync('orderId', JSON.parse(linkId))
        wx.setStorageSync('linkId', JSON.parse(linkId).code)
        this.checkEmpId(2, JSON.parse(linkId).code)
      }
      //存储产品推广信息
      if (codeObj.query.q.indexOf('spuId') != -1) {
        wx.setStorageSync('spuInfo', JSON.parse(linkId))
        wx.setStorageSync('linkId', JSON.parse(linkId).proSpread)
        wx.setStorageSync('spuLinkId', JSON.parse(linkId).proSpread)
        this.checkEmpId(0, JSON.parse(linkId).proSpread, JSON.parse(linkId))
      }
      // 存储课程推广码
      if (codeObj.query.q.indexOf('classId') != -1) {
        let sIndex = linkId.indexOf('&courseId=')
        let newClassId = linkId.slice(0, sIndex)
        let newLinkId = linkId.slice(sIndex + 10)
        wx.setStorageSync('courseId', newLinkId)
        wx.setStorageSync('linkId', newClassId)
        wx.setStorageSync('courseLinkId', newClassId)
        this.checkEmpId(1, newClassId, newLinkId)
      }
      // 存储通知公告/行业资讯推广码
      if (codeObj.query.q.indexOf('policyId') != -1) {
        wx.setStorageSync('policyInfo', JSON.parse(linkId))
        wx.setStorageSync('linkId', JSON.parse(linkId).policySpread)
        this.checkEmpId(3, JSON.parse(linkId).policySpread, JSON.parse(linkId))
      }
      // 存储卧涛文档推广码
      if (codeObj.query.q.indexOf('fileId') != -1) {
        wx.setStorageSync('fileInfo', JSON.parse(linkId))
        wx.setStorageSync('linkId', JSON.parse(linkId).fileSpread)
        wx.setStorageSync('fileLinkId', JSON.parse(linkId).fileSpread)
        this.checkEmpId(4, JSON.parse(linkId).fileSpread, JSON.parse(linkId))
      }
      this.checkCodeStatus()
    }
  },
  // 判断扫码员工推广码是否需要覆盖
  checkEmpId(checkType, empId, obj) {
    let status = false // true 扫码为同一人 false 扫码为不同人
    let params = {
      code: empId
    }
    checkEmpCode(params).then(res => {
      if (res.code == 0) {
        if (wx.getStorageSync('empId')) {
          let cEmpId = wx.getStorageSync('empId')
          let rEmpId = res.data
          status = cEmpId == rEmpId ? true : false
          this.switchCheck(checkType, status, obj)
          wx.setStorageSync('empId', res.data)
        } else {
          this.switchCheck(checkType, status, obj)
          wx.setStorageSync('empId', res.data)
        }
      }
    })
  },
  // 扫码类型判断
  switchCheck(checkType, status, obj) {
    console.log(status, 'statusstatusstatusstatus')
    switch (checkType) {
      case 0:
        this.saveProList(obj, status)
        break;
      case 1:
        this.saveCourseList(obj, status)
        break;
      case 3:
        this.savePolicyList(obj, status)
        break;
      case 4:
        this.saveFileList(obj, status)
        break;
      default:
        this.saveOrderInfo(status)
    }
  },
  // 发起订单判断
  saveOrderInfo(status) {
    if (!status) {
      if (wx.getStorageSync('spuInfo')) {
        wx.removeStorageSync('spuInfo')
      }
      if (wx.getStorageSync('courseId')) {
        wx.removeStorageSync('courseId')
      }
      if (wx.getStorageSync('courseIdArr')) {
        wx.removeStorageSync('courseIdArr')
      }
      if (wx.getStorageSync('spuInfoArr')) {
        wx.removeStorageSync('spuInfoArr')
      }
    }
  },
  // 存储课程数组
  saveCourseList(courseId, status) {
    if (wx.getStorageSync('courseIdArr') && status) {
      let courseIdArr = wx.getStorageSync('courseIdArr')
      if (courseIdArr.indexOf(Number(courseId)) == -1) {
        courseIdArr.push(Number(courseId))
        wx.setStorageSync('courseIdArr', courseIdArr)
      }
    } else {
      let r = [Number(courseId)]
      wx.setStorageSync('courseIdArr', r)
    }
  },
  // 存储产品数组
  saveProList(spuInfo, status) {
    if (wx.getStorageSync('spuInfoArr') && status) {
      let spuInfoArr = wx.getStorageSync('spuInfoArr')
      let result = spuInfoArr.filter(item => {
        return item.spuId == spuInfo.spuId
      })
      if (result.length == 0) {
        spuInfoArr.push({
          spuId: spuInfo.spuId,
          spuType: spuInfo.spuType
        })
        wx.setStorageSync('spuInfoArr', spuInfoArr)
      }
    } else {
      let r = [{
        spuId: spuInfo.spuId,
        spuType: spuInfo.spuType
      }]
      wx.setStorageSync('spuInfoArr', r)
    }
  },
  // 存储通知公告/行业资讯数组
  savePolicyList(policyInfo, status) {
    if (wx.getStorageSync('policyInfoArr') && status) {
      let policyInfoArr = wx.getStorageSync('policyInfoArr')
      let result = policyInfoArr.filter(item => {
        return item.id == policyInfo.policyId
      })
      if (result.length == 0) {
        policyInfoArr.push({
          id: policyInfo.policyId,
          number: policyInfo.number,
          index: policyInfo.index
        })
        wx.setStorageSync('policyInfoArr', policyInfoArr)
      }
    } else {
      let r = [{
        id: policyInfo.policyId,
        number: policyInfo.number,
        index: policyInfo.index
      }]
      wx.setStorageSync('policyInfoArr', r)
    }
  },
  // 存储卧涛文档数组
  saveFileList(fileInfo, status) {
    if (wx.getStorageSync('fileInfoArr') && status) {
      let fileInfoArr = wx.getStorageSync('fileInfoArr')
      let result = fileInfoArr.filter(item => {
        return item.id == fileInfo.fileId
      })
      if (result.length == 0) {
        fileInfoArr.push({
          id: fileInfo.fileId,
        })
        wx.setStorageSync('fileInfoArr', fileInfoArr)
      }
    } else {
      let r = [{
        id: fileInfo.fileId,
      }]
      wx.setStorageSync('fileInfoArr', r)
    }
  },
  //监听页面滑动
  onPageScroll(e) {
    var that = this;
    if (e.scrollTop > 0) {
      that.globalData.showTop = true;
    } else {
      that.globalData.showTop = false;
    }
  },
  // 回到页面顶部
  toTop: function () {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  // 检查登录
  checkLogin(val) {
    if (!wx.getStorageSync('userInfo')) {
      return wx.navigateTo({
        url: "/personal/pages/wxLogin/wxLogin"
      })
    } else {
      if (val) return wx.getStorageSync('userInfo')
    }
  },
  toastBox(title, status, time) {
    wx.showToast({
      title: title,
      icon: status ? status : 'none',
      duration: time ? time : 1500
    })
  },
  modalBox(title, content, cancel, func) {
    wx.showModal({
      title: title ? title : '操作提示',
      content: content,
      showCancel: cancel ? cancel : true,
      success: function (res) {
        if (res.confirm) {
          return func(true)
        } else {
          return func(false)
        }
      }
    })

  },
  toGoalUrl(url) {
    wx.navigateTo({
      url: url
    })
  },
  toReUrl(url) {
    wx.redirectTo({
      url: url
    })
  },
  toTabUrl(url) {
    wx.switchTab({
      url: url,
    })
  },

  globalData: {
    navHeight: "", //自定义导航栏高度
    navTop: "",
    windowHeight: "",
    baseURL: "",
    imageURL: "",
    approveUrl: '',
    signUrl: '',
    shareTitle: "卧涛商城", //小程序转发标题
    sharePath: '/pages/index/index', //小程序转发路径
    selectedIndex: 0,
    wxFoucusCode: false,
    showTop: false,
    system: ""
  }
})