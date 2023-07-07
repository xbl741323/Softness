// personal/pages/baoPay/baoPay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cPay: "",
    payStatus: false, // true 已支付 false 待支付
    from:'',
    urls:'',
    orderFrom:null,
  },
  setBaoInfo(val) {
    let env = __wxConfig.envVersion;
    let releaseUrl = 'https://m.wotao.com'
    let developUrl = 'http://web-mobile.wotao.com'
    if (env == 'release') {
      this.setData({
        cPay: `${releaseUrl}/wx-open/pay?orderNo=${val.orderNo}&addressId=${val.addressId}` // 正式环境
      })
    } else {
      this.setData({
        cPay: `${developUrl}/wx-open/pay?orderNo=${val.orderNo}&addressId=${val.addressId}` // 测试和开发环境
      })
    }
  },
  // 复制链接
  copyText() {
    let that = this
    wx.setClipboardData({
      data: that.data.cPay,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  // 判断页面来源
  judgeUrl(){
    if(this.data.orderFrom == 'class') returnthis.setData({
      from: 'class-order',
      urls: `/personal/pages/orderIndex/order?index=${1}`
    });
    let pages = getCurrentPages();
    let currPage = null;
    if(pages.length){
      currPage = pages[pages.length-2]
    };
    let route = currPage.route;
    if(route == 'personal/pages/orderIndex/order') return this.setData({
      from: 'order',
      urls: `/personal/pages/orderIndex/order?type=${2}`
    });
    if(route == 'classRoom/pages/detail/course/course') return this.setData({
      from: 'class',
      urls: `/personal/pages/orderIndex/order?index=${1}`
    });
    if(route == 'classRoom/pages/order/order') return this.setData({
      from: 'class-order',
      urls: `/personal/pages/orderIndex/order?index=${1}`
    });
    if(route == 'personal/pages/class/member') return this.setData({
      from: 'member',
      urls: `/personal/pages/class/member?buy=${1}`
    });
  },
  // 离开页面弹框（手势离开）
  leaveEnable() {
      let that = this;
      wx.enableAlertBeforeUnload({
      message: '确定放弃支付，离开此页面？',
      success: (res) => {
        console.log(res);
        // wx.navigateTo({
        //   url: that.data.urls,
        // })
      },
    })
  },
  // 离开页面后检查支付状态
  checkPayStatus() {
    if (this.data.payStatus) {
      let that = this;
      wx.disableAlertBeforeUnload({
        success: (res) => {
          wx.navigateTo({
            url: that.data.urls,
          })
        },
      })
      wx.showToast({
        title: '支付成功！',
        duration: 5000,
      })
      setTimeout(() => {
        wx.navigateTo({
          url: that.data.urls,
        })
      }, 5000)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type){
      this.setData({
        orderFrom: options.type
      })
    }
    this.setBaoInfo(options)
    this.leaveEnable()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('监听页面初次渲染完成')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('监听页面显示')
    this.judgeUrl();
    this.checkPayStatus()
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
    wx.navigateTo({
      url: this.data.urls,
    })
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