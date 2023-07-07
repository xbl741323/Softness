// components/index/areaItem/areaItem.js
import {
  getAreaNo,
} from "../../../utils/api"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    areaDialog: {
      type: Boolean,
      value: false
    },
    areaValue: {
      type: Array,
      value: []
    },
    region: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    province: '', //省
    provinceId: '', //省
    pIndex: 0,
    city: '', //市
    cityId: '', //市
    cIndex: 0,
    searchValue: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleDialog(){
      // this.setData({
      //   areaDialog: false
      // })
      this.triggerEvent('getCityName', '');
    },
    getArea(e){
      let val = e.currentTarget.dataset.value
      let data = this.data.region
      let index1 = val[0]
      let index2 = val[1]
      let province = this.data.province
      let provinceId = this.data.provinceId
      let city = this.data.city
      let cityId = this.data.cityId
      province = data[index1].name
      provinceId = data[index1].no
      if(data[index1].children.length > 0){
        city = data[index1].children[index2].name
        cityId = data[index1].children[index2].no
        wx.setStorageSync('province', city)
        wx.setStorageSync('provinceId', cityId)
      }else{
        city = data[index1].name
        cityId = data[index1].no
        wx.setStorageSync('province', city)
        wx.setStorageSync('provinceId', cityId)
      }
      this.setData({
        areaValue: [index1, index2],
        pIndex: index1,
        cIndex: index2,
        province: province,
        provinceId: provinceId,
        city: city,
        cityId: cityId
      })
      this.triggerEvent('getCityName', city);
      this.triggerEvent('updateAreaNo', cityId);
    },
    bindChange(e) {
      const val = e.detail.value
      this.setData({
        areaValue: val
      })
    },
    searchCity(e){
      this.setData({
        searchValue: e.detail.value.trim()
      })
    },
    clearSearchValue(){
      this.setData({
        searchValue: ''
      })
    },
    getAreaNo(val){
      let data = this.data.region
      let index1 = 0
      let index2 = 0
      getAreaNo({
        name: val,
        level: 2
      }).then(res => {
        if(res.data.code != 0){
          wx.showToast({
            icon: "none",
            title: '暂无匹配城市名称',
          })
          return false
        }
        if(res.data.data.no == undefined){
          wx.showToast({
            icon: "none",
            title: '暂无匹配城市名称',
          })
          return false
        }
        data.forEach(item => {
          item.children.map(function(citem, cindex){
              if(citem.no == res.data.data.no){
                index2 = cindex
              }
          })
        })
        data.map(function(item,index){
          if(item.no ==  res.data.data.parentNo){
            index1 = index
          }
        })
        this.setData({
          areaValue: [index1, index2]
        })
      })
    },
    goArea(){
      let val = this.data.searchValue
      if(val == ''){
        wx.showToast({
          icon: "none",
          title: '搜索内容不能为空',
        })
        return false
      }
      wx.navigateTo({
        url: `/personal/pages/toggleCity/toggleCity?searchValue=${val}`
      })
      this.triggerEvent('getCityName', this.data.city);
      this.setData({
        areaDialog: false,
        searchValue: ''
      })
    },
    cancel(){
      this.triggerEvent('getCityName', '');
    }
  },
})
