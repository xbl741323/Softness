// components/information/infoItem/infoItem.js
const app = getApp();
var WxParse = require('../wxParse/wxParse.js');
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    policyInfo: {
      type: Object,
      value: {}
    },
    listIndex: {
      type: Number,
      value: 0
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageUrl: app.globalData.imageURL,
    isShow: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getData(){
      if(this.data.policyInfo&&Object.keys(this.data.policyInfo).length>0){
        let that = this
        // if(this.data.policyInfo.title.indexOf('<')!=-1){
          let articleArray = [{
            content: this.data.policyInfo.title
          }];
          for (let i = 0; i < articleArray.length; i++) {
            WxParse.wxParse('article' + i, 'html', articleArray[i].content, that);
            if (i === articleArray.length - 1) {
              WxParse.wxParseTemArray("articleArray", 'article', articleArray.length, that);
            }
          }
          that.setData({
            isShow: 1
          })
      }
    }
  },
  lifetimes: {
    attached: function () {
      this.getData()
    }
  }
})