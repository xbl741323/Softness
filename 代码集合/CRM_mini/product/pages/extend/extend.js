// product/pages/extend/extend.js
const app = getApp();
import Wxml2Canvas from 'wxml2canvas';
import drawQrcode from 'weapp-qrcode'
import {
  getDetail
} from "../../../utils/api/product.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCode: true,
    system: app.globalData.system,
    bgUrl: "https://static.wotao.com/icon/head/c5ce3a58394940fd91ae36b5dd18f156.png",
    showCanvas: false,
    id: "", //产品ID
    type: "", //产品类型
    showCode: true,
    webUrl: app.globalData.webUrl,
    shareImgUrl: "",
    shareFixUrl: "",
    detailInfo: {},
    tradeInfo: {},
    number: "", //员工工号
    depositFee: "",
    wxCode: "",
    coverImg: "",
    imageUrl: app.globalData.imageURL,
  },
  // 生成二维码
  createNewCode() {
    let that = this
    let id = that.data.id
    let type = that.data.type
    let code = that.data.wxCode
    let params = {
      spuId: id,
      spuType: type,
      proSpread: code
    }
    let data = JSON.stringify(params)
    drawQrcode({
      width: 200,
      height: 200,
      canvasId: 'myQrcode',
      text: `https://www.wotao.com/product?data=${data}`,
      image: {
        // imageResource: "/personal/image/my-order/wt_logo.png",
        dx: 80,
        dy: 80,
        dWidth: 40,
        dHeight: 40
      },
      callback: function (e) {
        setTimeout(() => {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 450,
            height: 450,
            destWidth: 2000,
            destHeight: 2000,
            canvasId: 'myQrcode',
            success(res) {
              that.setData({
                shareImgUrl: res.tempFilePath
              })
              that.drawCanvas()
            },
            fail(res) {
              console.error(res)
            }
          })
        }, 500)
      }
    })
  },
  //动态获取画制作元素的宽高
  drawCanvas() {
    const query = wx.createSelectorQuery().in(this);
    query.select('#code-contain').fields({
      size: true,
      scrollOffset: true
    }, data => {
      let width = data.width;
      let height = data.height;
      this.width = width;
      this.height = height;
      this.draw()
    }).exec();
  },
  draw() {
    let that = this
    //创建wxml2canvas对象
    let drawImage = new Wxml2Canvas({
      element: 'share', // canvas节点的id,
      obj: that, // 在组件中使用时，需要传入当前组件的this
      width: this.width, // 宽高
      height: this.height,
      background: '#ffffff', // 默认背景色
      progress(percent) { // 绘制进度
      },
      finish(url) {
        that.setData({
          shareFixUrl: url,
          showCanvas: true
        })
      },
      error(res) {
      }
    }, this);
    let data = {
      //直接获取wxml数据
      list: [{
        type: 'wxml',
        class: '.code-contain, .share-img-sty, .share-bg, .share-text-box, .share-title, .price-num-box, .price-num, .ios-share-text, .cover-img, .android-share-text',
        limit: '.code-contain',
        x: this.data.system == 'android' ? -3 : 0,
        y: 0
      }]
    }
    //传入数据，画制canvas图片
    drawImage.draw(data, this);
  },
  // 复制链接
  copyText() {
    let webUrl = this.data.webUrl
    let id = this.data.id
    let type = this.data.type
    let code = this.data.wxCode
    let text = `${webUrl}productdetails/details?spuId=${id}&type=${type}&link=${code}`
    wx.setClipboardData({
      data: text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              icon: "none",
              title: '网站地址已复制，分享码加载中，请稍等！',
              duration: 3000
            })
          }
        })
      }
    })
  },
  // 微信分享
  wxShare() {
    wx.showShareImageMenu({
      path: this.data.shareFixUrl
    })
  },
  // 保存图片到相册
  saveImg() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareFixUrl,
      success: function (res) {
        wx.showToast({
          title: '保存图片成功',
        })
      },
      fail: function (err) {
        wx.showToast({
          icon: 'none',
          title: '保存图片失败',
        })
      }
    })
  },
  // 关闭弹窗，回到产品详情页面
  closeSheet() {
    this.setData({
      showCode: false
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  // 获取产品详情
  getDetail() {
    getDetail({
      spuId: this.data.id
    }).then(res => {
      if (res.code == 0) {
        this.setData({
          detailInfo: res.data
        })
      }
    })
    this.createNewCode()
    this.copyText()
  },
  //获取交易信息
  getTradeInfo() {
    if (this.data.id == '7020' || this.data.id == '15' || this.data.id == '2' || this.data.id == '1') {
      this.setData({
        depositFee: this.data.id == '7020' ? '￥19800' : this.data.id == '15' ? '￥1800' : '面议'
      })
      return false
    }
    let productList = wx.getStorageSync('productInfo')
    if (productList) {
      let pro_list = productList.filter(item => item.id == this.data.id)
      pro_list.forEach(item => {
        let amount = ''
        if (item.isOnline) {
          item.spuMaxAmount = parseInt(item.spuMaxAmount * 100)
          item.spuMinAmount = parseInt(item.spuMinAmount * 100)
          item.spuMaxAmount < 10000000 ? item.spuMaxAmount = item.spuMaxAmount / 100 : item.spuMaxAmount = (item.spuMaxAmount / 1000000) + '万'
          item.spuMinAmount < 10000000 ? item.spuMinAmount = item.spuMinAmount / 100 : item.spuMinAmount = (item.spuMinAmount / 1000000) + '万'
          amount = item.spuMaxAmount != item.spuMinAmount ? '￥' + item.spuMinAmount + "起" : '￥' + item.spuMinAmount
          console.log(amount)
        } else {
          amount = '面议'
        }
        this.setData({
          depositFee: amount
        })
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      this.setData({
        id: options.id,
        type: options.type,
        wxCode: options.code,
        coverImg: options.coverImg
      })
    }
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        number: wx.getStorageSync('userInfo').number
      })
    }
    this.getDetail()
    this.getTradeInfo()
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

})