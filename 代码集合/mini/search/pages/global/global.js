// search/pages/global/global.js
import { getHotWords } from "../../../utils/api/product"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyWords: "",
    searchHistory: [],
    hotWords: []
  },
  // keyWords赋值
  changeKeyWords(e) {
    let val = e.detail.value
    this.setData({
      keyWords: val
    })
  },
  // 清空关键词
  clearKeyWords() {
    this.setData({
      keyWords: ""
    })
  },
  // 清除所有历史搜索
  clearHistory() {
    if (wx.getStorageSync('searchHistory')) {
      wx.removeStorageSync('searchHistory')
    }
    this.setData({
      searchHistory: []
    })
  },
  // 跳转到全局搜索数据显示页面
  skipToGlobal(e) {
    console.log(e);
    let searchHistory = this.data.searchHistory
    let keyWords = this.data.keyWords
    if (searchHistory.indexOf(keyWords) == -1 && keyWords.trim() !== '') {
      searchHistory.push(this.data.keyWords)
      this.setData({
        searchHistory: searchHistory
      })
      wx.setStorageSync('searchHistory', searchHistory)
    }
    this.toSearchList();
  },
  toSearchList(){
    wx.navigateTo({
      url: '/search/pages/globalSearch/globalSearch?keyWords=' + this.data.keyWords
    })
  },
  historyClick(e){
    this.setData({
      keyWords: e.target.dataset.key
    });
    this.skipToGlobal(e)
  },
  // 获取热搜词
  getHotWords(){
    getHotWords(5).then(res=>{
      if(res.code == 1000){
        this.setData({
          hotWords: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('searchHistory')) {
      this.setData({
        searchHistory: wx.getStorageSync('searchHistory')
      })
    };
    this.setData({
      keyWords:options.keywords
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getHotWords()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})