// personal/components/my-collection/money-item/money-item.js
const app = getApp();
import {
  getExamineImg,
} from '../../../../utils/api/collection'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderInfo: {
      type: Object
    },
    clueType: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    baseUrl: app.globalData.imageURL,
    show: false,
    ImageUrl: null,
    conceal: false,
    orderNo: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 查看转账
    examineImg(e) {
      console.log(e);
      let taskNo = e.target.dataset.taskno
      getExamineImg(taskNo).then(res => {
        console.log(res);
        this.setData({
          conceal: true,
          ImageUrl: res.data.voucherUrl
        })
      })
    },
    // 复制链接
    copyText(e) {
      let text = e.currentTarget.dataset.text
      wx.setClipboardData({
        data: text,
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
    showPopup() {
      this.setData({
        show: true,
      });
    },
    onClose() {
      this.setData({
        show: false
      });
    },
    Close() {
      this.setData({
        conceal: false
      });
    },
  }
})