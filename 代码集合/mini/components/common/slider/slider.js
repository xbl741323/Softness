// components/common/slider/slider.js
var coord
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spaceWidth:{ //百分百宽度，需减去两边margin和padding间距
      type: Number,
      value:0
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    x: 0,
    area_width: 100,   //可滑动区域的宽，单位是百分比，设置好后自动居中
    box_width: 100,   //滑块的宽,单位是 rpx
    maxNum: 0, 
    status:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    drag(e) {
      var that = this;
      coord = e.detail.x;  //根据bindchange 事件获取detail的x轴
    },
    dragOver(e) {     //根据触摸 手指触摸动作结束    判断 当前的x轴 是否大于预设值的值 
      var that = this;
      console.log(coord,that.data.maxNum);
      if (coord >= that.data.maxNum) {
        wx.showToast({
          title: '验证成功',
          icon: 'success',
          duration: 2000
        });
        that.setData({
          status: true
        })
        this.triggerEvent('sliderStatus', true);
        //验证成功之后的代码
      } else {      // 如果不大于 则设置 x周的距离为0
        that.setData({
          x: 0,
        })
      }
    },
  },
  lifetimes: {
    attached: function () {
      var that = this;
      console.log(that.data.spaceWidth);
      wx.getSystemInfo({  //获取系统信息 设置预设值
        success: function (res) {
          console.log(res.windowWidth);
          var n = Math.floor(res.windowWidth * that.data.area_width / 100 - (that.data.box_width+that.data.spaceWidth)*(wx.getSystemInfoSync().windowWidth / 750))
          console.log(n)
          that.setData({
            maxNum: n,
          })
        }
      })
    },
  }
})
