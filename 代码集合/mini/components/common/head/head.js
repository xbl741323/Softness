// components/head/head.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    backPage() {
      console.log(111111111111111111111);
      if (this.data.title == '基本信息') return app.toTabUrl('/pages/me/me')
      if (this.data.title == '确认订单信息') return app.toTabUrl('/pages/index/index')
      let pages = getCurrentPages();
      if (pages[0].route == 'personal/pages/wxLogin/wxLogin' || pages[0].route == 'personal/pages/class/member' || pages[0].route == 'personal/pages/wtFile/fileDetail/fileDetail') {
        wx.switchTab({
          url: '/pages/index/index',
        })
      } else {
        wx.navigateBack({
          delta: 1,
        })
      }
    }
  }
})