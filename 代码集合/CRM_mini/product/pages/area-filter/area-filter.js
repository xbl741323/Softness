// product/pages/area-filter/area-filter.js
import {
  getNewArea
} from "../../../utils/api/product"
import * as CodeMsg from "../../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    staticCity: "",
    provinceList: [],
    keyWords: '',
    isShow: false,
    province: '',
    index: 0,
    district: [],
    bindSource: [], //绑定到页面的数据，根据用户输入动态变化
    hideScroll: true,
  },
  //当键盘输入时，触发input事件
  bindinput: function (e) {
    var prefix = e.detail.value.trim()
    var newSource = []
    if (prefix != "") { 
      this.data.provinceList.forEach(item => {
          if (item.name.indexOf(prefix) != -1) {
            newSource.push(item)
          }
      })
    };
    if (newSource.length != 0) {
      this.setData({
        hideScroll: false,
        bindSource: newSource,
      })
    } else {
      this.setData({
        hideScroll: true,
        bindSource: []
      })
    }
  },

  // 用户点击选择某个联想字符串时，获取该联想词，并清空提醒联想词数组
  itemtap: function (e) {
    let item = e.target.dataset.item
    this.setData({
      keyWords: item.name,
      hideScroll: true,
      bindSource: [],
      province: item.name,
      provinceId: item.no,
    })
    wx.setStorageSync('province', item.name);
    wx.setStorageSync('provinceId', item.no);
    wx.setStorageSync('cityList', item.children);
    wx.setStorageSync('areaFilter', true);
    wx.navigateBack({
      delta: 1
    })
  },
  // 省市搜索
  searchProvince(){

  },
  // 返回产品页
  refreshTo(e) {
    let item = e.currentTarget.dataset.item
    this.setData({
      isShow: true,
      province: item.name,
      provinceId: item.no,
    })
    wx.setStorageSync('cityList', item.children)
  },
  // 获取地区数据
  getAreaList() {
    if(wx.getStorageSync('district')){
      this.setData({
        provinceList: wx.getStorageSync('district')
      })
    }else{
      getNewArea().then(res => {
        if (res.code == CodeMsg.CODE_0) {
          this.setData({
            provinceList: res.data
          })
        }
      })
    }
  },
  // 取消
  cancelChoice(){
    this.setData({
      isShow: false,
      province: ''
    })
  },
  // 确认
  confirmChoice(){
    let province = this.data.province
    let provinceId = this.data.provinceId
    this.setData({
      isShow: false,
      staticCity: province
    })
    wx.setStorageSync('province', province);
    wx.setStorageSync('provinceId', provinceId);
    wx.setStorageSync('areaFilter', true);
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getAreaList()
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
    if (wx.getStorageSync('province')) {
      this.setData({
        staticCity: wx.getStorageSync('province'),
      });
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})