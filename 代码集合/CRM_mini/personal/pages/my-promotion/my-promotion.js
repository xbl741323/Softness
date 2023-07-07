// personal/pages/my-promotion/my-promotion.js
const app = getApp();
import Wxml2Canvas from 'wxml2canvas';
import drawQrcode from 'weapp-qrcode'
import {
  getWxInviteCode,
} from "../../../utils/api/wtClass"
import * as CodeMsg from "../../../utils/common/codeMsg";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    copyStatus: false, // 链接是否已赋值 true-是 false-否
    showStatus: false,
    wxRegisterBg: "https://static.wotao.com/icon/head/e79932d6c40148d1ba6a501415083554.png",
    wxMemberBg: "https://static.wotao.com/icon/head/5f51378fcb524def9ba43dcbfb1ecc71.png",
    shareRegisterUrl: "", // 生成的推广图url
    shareMemberUrl: "", // 生成的推广图url
    wxRegisterUrl: "", // 生成的微信注册推广码
    wxMemberUrl: "", // 生成的课堂会员推广码
    wxCode: "",
    cIndex: 0,
    webUrl: app.globalData.webUrl,
    promotionList: [{
        title: "卧涛商城小程序推广",
        value: ""
      },
      {
        title: "课堂会员推广",
        value: ""
      },
      {
        title: "卧涛网推广",
        value: "复制链接推广"
      }
    ]
  },
  // 关闭弹窗
  close() {
    this.setData({
      showStatus: false
    })
  },
  // 点击展示推广码
  changeTab(e) {
    let index = e.currentTarget.dataset.index
    if (index != 2) {
      this.setData({
        cIndex: index,
        showStatus: true
      })
      this.createCode(index)
    }
  },
  // 复制链接
  copyText() {
    let that = this
    let text = `${this.data.webUrl}?link=${this.data.wxCode}`
    wx.setClipboardData({
      data: text,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '链接已复制！'
            })
          }
        })
        that.setData({
          copyStatus: true
        })
      }
    })
  },
  // 获取微信邀请码
  getWxInvite() {
    getWxInviteCode().then(res => {
      if (res.code == CodeMsg.CODE_0) {
        this.setData({
          wxCode: res.data
        })
        this.createCode(0)
        this.createCode(1)
      }
    })
  },
  // 生成二维码
  createCode(type) {
    let wxCode = this.data.wxCode
    // type-0 获取小程序注册推广码信息
    // type-1 获取小程序会员推广码信息
    let text = type == 0 ? `https://www.wotao.com/mp?userId=${wxCode}` : `https://www.wotao.com/member?memberId=${wxCode}`;
    let that = this
    drawQrcode({
      width: 200,
      height: 200,
      padding: 0,
      canvasId: type == 0 ? 'registerQrcode' : 'memberQrcode',
      text: `${text}`,
      _this: that,
      callback: function (e) {
        setTimeout(() => {
          wx.canvasToTempFilePath({
            width: 400,
            height: 400,
            destWidth: 2000,
            destHeight: 2000,
            canvasId: type == 0 ? 'registerQrcode' : 'memberQrcode',
            success(res) {
              if (type == 0) {
                that.setData({
                  wxRegisterUrl: res.tempFilePath
                })
                that.drawCanvas(type)
              }
              if (type == 1) {
                that.setData({
                  wxMemberUrl: res.tempFilePath
                })
                that.drawCanvas(type)
              }
            },
            fail(res) {
              console.error(res)
            }
          })
        }, 500)
      }
    })
  },
  // 生成推广图
  drawCanvas(type) {
    console.log(type, "type")
    let that = this
    const query = wx.createSelectorQuery().in(this);
    query.select(type == 0 ? '#draw-register-contain' : '#draw-member-contain').fields({
      size: true,
      scrollOffset: true
    }, data => {
      let width = data.width;
      let height = data.height;
      this.width = width;
      this.height = height;
      that.draw(type)
    }).exec();
  },
  draw(type) {
    let that = this
    //创建wxml2canvas对象
    let drawImage = new Wxml2Canvas({
      element: type == 0 ? 'register-share' : 'member-share', // canvas节点的id,
      obj: that, // 在组件中使用时，需要传入当前组件的this
      width: this.width, // 宽高
      height: this.height * 2,
      background: '#ffffff', // 默认背景色
      progress(percent) { // 绘制进度
      },
      finish(url) {
        console.log(url, "url")
        if (type == 0) {
          that.setData({
            shareRegisterUrl: url
          })
        } else {
          that.setData({
            shareMemberUrl: url
          })
        }
      },
      error(res) {
        console.log(res);
      }
    }, this);
    let data = {
      //直接获取wxml数据
      list: [{
        type: 'wxml',
        class: '.register-cover, .register-bg, .register-code-box, .register-code, .register-desc',
        limit: '.register-cover',
        x: -13,
        y: 0
      }]
    }
    let data2 = {
      //直接获取wxml数据
      list: [{
        type: 'wxml',
        class: '.member-cover, .member-bg, .member-code-contain, .member-code-box, .member-code, .member-text',
        limit: '.member-cover',
        x: -5,
        y: 0
      }]
    }
    //传入数据，画制canvas图片
    drawImage.draw(type == 0 ? data : data2, this);
  },
  // 微信分享
  wxShare() {
    let cIndex = this.data.cIndex
    let shareRegisterUrl = this.data.shareRegisterUrl
    let shareMemberUrl = this.data.shareMemberUrl
    let url = cIndex == 0 ? shareRegisterUrl : shareMemberUrl
    wx.showShareImageMenu({
      path: url
    })
  },
  // 保存图片到相册
  saveImg() {
    let cIndex = this.data.cIndex
    let shareRegisterUrl = this.data.shareRegisterUrl
    let shareMemberUrl = this.data.shareMemberUrl
    let url = cIndex == 0 ? shareRegisterUrl : shareMemberUrl
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success: function (res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 1000
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '保存图片失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo')
    })
    this.getWxInvite()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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

  }
})