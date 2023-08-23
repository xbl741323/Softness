// app.js
App({
  // 冷启动
  onLaunch() {
    this.getEnvUrl()
  },
  // 热启动
  onShow() {
    this.getSystemData()
    this.updateEdition()
  },
  // 配置环境信息
  getEnvUrl() {
    var env = __wxConfig.envVersion;
    switch (env) {
      case "develop": // 本地开发环境
        this.globalData.baseURL = "https://www.xzycshouce.com/api";
        break;
      case "trial": // 测试环境
        this.globalData.baseURL = "https://www.xzycshouce.com/api";
        break;
      case "release": // 线上环境
        this.globalData.baseURL = "https://www.xzycshouce.com/api";
        break;
    }
  },
  //获取自定义导航栏信息 "navigationStyle": "custom"  
  getSystemData() {
    const {
      system
    } = wx.getSystemInfoSync();
    this.globalData.system = system.indexOf('iOS') != -1 ? 'ios' : 'android';
    console.log(this.globalData.system, "当前手机系统")
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
  globalData: {
    system: ""
  }
})
