// personal/pages/address/address.js
import {
  getAddressList,
  deleteAddress,
  setDefaultAddress
} from "../../../utils/api/address"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    pageFrom: 0, // 来源 0：提交订单 1：账户设置
    cIndex: 999,
    addressList: []
  },
  // 选择收件地址
  selectOption(e) {
    if (this.data.pageFrom != 1) {
      let index = e.currentTarget.dataset.index
      let addressList = this.data.addressList
      addressList.forEach(item => {
        item.isSelect = false
      })
      addressList[index].isSelect = true
      this.setData({
        addressList: addressList
      })
      wx.setStorageSync('addressId', addressList[index].id)
      wx.navigateBack({
        delta: 1
      })
    }
  },
  // 设置默认地址操作
  setDefault(e) {
    let id = e.currentTarget.dataset.id
    setDefaultAddress(id).then(res => {
      if (res.code == 0) {
        this.getList()
      }
    })
  },
  // 删除操作
  delOperate(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: "是否删除该条数据？",
      cancelColor: "#36A6FE",
      cancelText: "取消",
      confirmColor: "#999999",
      confirmText: "确认",
      success(res) {
        if (res.confirm) {
          deleteAddress(id).then(res => {
            if (res.code == 0) {
              that.getList()
            }
          })
        } else if (res.cancel) {}
      },
    })
  },
  // 关闭遮罩弹窗
  cancelOperate(e) {
    let index = e.currentTarget.dataset.index
    let cIndex = this.data.cIndex
    if (index !== cIndex) {
      let addressList = this.data.addressList
      addressList.forEach(item => {
        item.showModel = false
      })
      this.setData({
        addressList: addressList,
        cIndex: 999
      })
    }
  },
  // 长按显示设为默认或删除操作按钮
  showOperate(e) {
    let index = e.currentTarget.dataset.index
    let cIndex = this.data.cIndex
    let addressList = this.data.addressList
    if (cIndex !== 999) {
      let addressList = this.data.addressList
      addressList.forEach(item => {
        item.showModel = false
      })
      this.setData({
        addressList: addressList,
        cIndex: 999
      })
    }
    addressList[index].showModel = true
    this.setData({
      addressList: addressList,
      cIndex: index
    })
  },

  // 跳转到编辑收件地址
  toSetAddress(e) {
    let type = e.currentTarget.dataset.type
    if (this.data.addressList.length > 9 && type == 1) {
      // wx.showToast({
      //   icon: "none",
      //   title: '收件地址最多添加10条！',
      // })
    } else {
      let info = JSON.stringify(e.currentTarget.dataset.info)
      wx.navigateTo({
        url: `/personal/pages/setAddress/setAddress?type=${type}&info=${info}`,
      })
    }
  },
  // 接收来源页面赋值
  setBeform(val) {
    this.setData({
      pageFrom: val.type
    })
    console.log(this.data.pageFrom, "来源页面")
  },
  // 获取收件地址列表
  getList() {
    let id = this.data.userInfo.accountId
    let params = {
      accountId: id
    }
    getAddressList(params).then(res => {
      if (res.code == 0) {
        res.data.forEach((item) => {
          item.showModel = false
          // isSelect用来显示选中图标 true：选中 false：未选中
          if (wx.getStorageSync('addressId')) {
            let id = wx.getStorageSync('addressId')
            if (id == item.id) {
              item.isSelect = true
            }
          } else {
            item.isSelect = item.isDefault == 1 ? true : false
          }
        })
        this.setData({
          addressList: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setBeform(options)
    this.getList()
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
    }
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
    this.getList()
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