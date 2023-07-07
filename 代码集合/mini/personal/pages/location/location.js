const switchProvince = require('../../../utils/api.js').switchProvince;
Page({
  data: {
    staticCity: "",
    cityList: "",
    cityName: "",
    searchCity: [],
  },
  reset() {
    this.setData({
      cityName: ""
    })
  },
  //获取搜索城市名称
  getCity(e) {
    this.setData({
      cityName: e.detail.value.trim()
    })
    let result = []
    for (let key in this.data.cityList) {
      this.data.cityList[key].forEach((value) => {
        if (value.spell.indexOf(this.data.cityName) > -1 ||
          value.name.indexOf(this.data.cityName) > -1) {
          result.push({
            id: value.id,
            name: value.name
          })
        }
      })
    }
    console.log(result, "result")
    if (result.length > 0) {
      this.setData({
        searchCity: result
      })
    } else {
      this.setData({
        searchCity: [{
          id: null,
          name: "暂无匹配信息"
        }]
      })
    }
  },
  bindconfirm(e) {
    console.log(this.data.cityName, "cityName")
    if (this.data.searchCity[0].id) {
      for (let key in this.data.cityList) {
        this.data.cityList[key].forEach((value) => {
          if (value.name.indexOf(this.data.cityName) > -1) {
            wx.setStorageSync('province', this.data.cityName);
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    }
  },
  //跳转至首页
  refreshTo(e) {
    if (e.currentTarget.dataset.type.id) {
      wx.setStorageSync('province', e.currentTarget.dataset.type.name);
      wx.setStorageSync('provinceId', e.currentTarget.dataset.type.id);
      wx.setStorageSync('areaFilter', true);
      wx.navigateBack({
        delta: 1
      })
    }
  },
  onLoad: function (options) {
    var that = this;
    switchProvince().then(res => {
      if (res.code == 0) {
        that.setData({
          cityList: res.data.cities
        })
      }
    })
  },
  onShow() {
    this.setData({
      staticCity: wx.getStorageSync('province'),
    });
  }
})