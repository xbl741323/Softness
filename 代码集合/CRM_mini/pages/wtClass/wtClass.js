// pages/classRoom/classRoom.js
import {
  getPlateList,
  getPlateClass
} from "../../utils/api/wtClass"
import * as CodeMsg from "../../utils/common/codeMsg";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabNo: 11,
    optionList: [],
    dataList: [],
    pageNo: 1,
    pageSize: 10,
    total: 0,
    isLoading: true, //防抖开关 防止用户不停的下拉
    baseUrl: app.globalData.imageURL
  },
  // 修改tabbar index
  changeTabbar() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2,
      })
    }
  },
  // tab切换
  changeTab(e) {
    this.setData({
      tabNo: e.currentTarget.dataset.id,
      pageNo: 1
    })
    this.getList()
  },
  // 获取专业分类列表
  getOptionList() {
    let params = {
      pageNo: 1,
      pageSize: 10
    }
    getPlateList(params).then(res => {
      if(res.code == CodeMsg.CODE_0){
        this.setData({
          tabNo: res.data.records[0].id, // 初始化tab值
          optionList: res.data.records
        })
      }
    })
    this.getList()
  },
  // 获取课程列表
  getList() {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let params = {
      plateId: that.data.tabNo,
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize
    }
    getPlateClass(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        var list = that.data.dataList
        if (that.data.pageNo == 1) {
          list = []
        }
        list = [...list, ...res.data.records]
        if (list.length < res.data.total) {
          that.setData({
            pageNo: that.data.pageNo + 1,
            isLoading: true
          })
        } else {
          that.setData({
            isLoading: false
          })
        }
        that.setData({
          dataList: list,
          total: res.data.total
        })
      }
      wx.hideLoading({success: (res) => {}})
    })
  },
  // 跳转课程详情
  toCourseDetail(e) {
    let perssions = wx.getStorageSync('userInfo').authorities;
    let coursePerssions = perssions.filter(item => item.authority == 'sys_wt_course_detail');
    if(coursePerssions.length > 0){
      let id = e.currentTarget.dataset.id
      let status = e.currentTarget.dataset.baseshowstate
      wx.navigateTo({
        url: `/wtClass/pages/detail/detail?id=${id}&status=${status}`,
      })
    }else{
      wx.showToast({
        title: '权限不足！',
        icon: 'error'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getOptionList()
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
    this.changeTabbar()
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
    if (this.data.isLoading) {
      this.setData({
        isLoading: false
      })
      this.getList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  
})