// components/wtFile/fileItem/fileItem.js
const app = getApp();
var WxParse = require('../../information/wxParse/wxParse.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fileInfo: {
      type: Object
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    fileInfo: {},
    imageUrl: app.globalData.imageURL,
    isShow: 0,
    iconUrl: {
      pdf: '../../../image/file/icon_pdf.png',
      doc: '../../../image/file/icon-word.png',
      docx: '../../../image/file/icon-word.png',
      xls: '../../../image/file/icon_xls.png',
      xlsx: '../../../image/file/icon_xls.png',
      ppt: '../../../image/file/icon_ppt.png',
      pptx: '../../../image/file/icon_ppt.png',
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getData(){
      if(this.data.fileInfo&&Object.keys(this.data.fileInfo).length>0){
        let that = this
          let articleArray = [{
            content: this.data.fileInfo.file_name
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
