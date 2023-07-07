// components/index/focusTip/focusTip.js
import {
  getWxFocus
} from "../../../utils/api/order"
import {
  getUserInfos
} from "../../../utils/common/userDeal"
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    officialFocus: true,
    accountId: "",
    imgUrl: "",
    timer: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取二维码
    getFocus() {
      let imgUrl = this.data.imgUrl
      wx.previewImage({
        current: imgUrl,
        urls: [
          imgUrl
        ]
      })
      app.globalData.wxFoucusCode = true;
      this.setData({
        timer: setInterval(() => {
          this.setTimeCount()
        }, 2000)
      })
    },
    //定时调用关注状态
    setTimeCount() {
      let that = this;
      console.log(app.globalData.wxFoucusCode, 'wxFoucusCode');
      if (!app.globalData.wxFoucusCode) return clearInterval(that.data.timer);
      getUserInfos(false, function (res) {
        if (res.wxSubscribeFlag) {
          clearInterval(that.data.timer);
        }
      })
    },
    // 跳转到卧涛科技公众号页面
    toOfficial() {
      let params = {
        accountId: this.data.accountId
      }
      getWxFocus(params).then(res => {
        if (res.code == 0) {
          this.setData({
            imgUrl: res.data
          })
          this.getFocus()
        }
      })
    },
    // 获取用户信息
    getUserData() {
      if (wx.getStorageSync('userInfo')) {
        getUserInfos(false, function (res) {})
        let info = wx.getStorageSync('userInfo');
        if (info) {
          this.setData({
            accountId: info.accountId,
            officialFocus: info.wxSubscribeFlag ? true : false
          })
        } else {
          this.setData({
            officialFocus: true
          })
        }
      }
    },
    // 启动定时器60后关闭关注微信公众号弹窗
    closeOfficial(e) {    
      let that = this
      if(e) return this.setData({
        officialFocus:true
      })
      setTimeout(() => {
        that.setData({
          officialFocus: true
        })
      }, 60000);      
    },
  },
  lifetimes: {
    attached: function () {
      this.closeOfficial()
    }
  }
})