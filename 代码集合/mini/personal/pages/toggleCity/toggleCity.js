// personal/pages/toggleCity/toggleCity.js
import {
  searchCity
} from "../../../utils/api/search.js"
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
    let data = e.detail.value.trim()
    this.setData({
      cityName: data
    })
    this.queryCity(data)
  },
  //跳转至首页
  refreshTo(e) {
    let item = e.currentTarget.dataset.type
    if (item.name) {
      let arr = item.name.split('-')
      wx.setStorageSync('province', arr[1]);
      wx.setStorageSync('provinceId', item.no);
      // wx.setStorageSync('areaFilter', true);
      wx.navigateBack({
        delta: 1
      })
    }
  },
  queryCity(data){
    searchCity({name: data}).then(res => {
      if(res.data.code != 0){
        this.setData({
          searchCity: [{
            id: null,
            name: "暂无匹配城市名称"
          }]
        })
        return false
      }
      let result = []
      result = res.data.data
      if (result.length > 0) {
        this.setData({
          searchCity: result
        })
      } else {
        this.setData({
          searchCity: [{
            id: null,
            name: "暂无匹配城市名称"
          }]
        })
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      cityName: options.searchValue
    })
    this.queryCity(this.data.cityName)
  },
  onShow() {
    this.setData({
      staticCity: wx.getStorageSync('province'),
    });
  }
})