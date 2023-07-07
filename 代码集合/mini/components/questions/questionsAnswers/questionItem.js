// components/questionsAnswers/questionItem.js
var WxParse = require('../../information/wxParse/wxParse.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    questionInfo: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    questionInfo: {},
    isShow: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getData(){
      if(this.data.questionInfo&&Object.keys(this.data.questionInfo).length>0){
        let that = this
          let articleArray = [{
            content: this.data.questionInfo.title
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
