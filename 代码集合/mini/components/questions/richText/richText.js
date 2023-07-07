// components/questions/richText/richText.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    item: {},
    hidden: false,
    showDialog: false,
    imageUrl: app.globalData.imageURL,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleMore() {
      this.setData({
        showDialog: true,
      })
    },
    closeDialog() {
      this.setData({
        showDialog: false
      })
    },
  },
  lifetimes: {
    attached() {
      let that = this
      var query = wx.createSelectorQuery().in(this);
        //选择id
        query.select('#text').boundingClientRect()
        query.exec(function(res) {
          //res就是 所有标签为mjltest的元素的信息 的数组
          if (res[0].height > 190) {
            that.setData({
              hidden: true
            })
          }
        })
    },
  }
})
