// custom-tab-bar/index.js
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
    system: app.globalData.system,
    selected: 0,
    isLogin: false,
    tabList: [{
        id: 0,
        title: "首页",
        selectImgUrl: "../image/tabbar/home_icon@2x.png",
        imgUrl: "../image/tabbar/home_icon_hui@2x.png",
        path: "/pages/index/index"
      },
      {
        id: 1,
        title: "分类",
        selectImgUrl: "../image/tabbar/fenlei_icon@2x.png",
        imgUrl: "../image/tabbar/fenlei_icon_hui@2x.png",
        path: "/pages/classify/classify"
      },
      {
        id: 2,
        imgUrl: "../image/tabbar/zixun.png",
      },
      {
        id: 3,
        title: "广场",
        selectImgUrl: "../image/tabbar/square_icon@2x.png",
        imgUrl: "../image/tabbar/square_icon_hui@2x.png",
        path: "/pages/square/square"
      },
      {
        id: 4,
        title: "我的",
        selectImgUrl: "../image/tabbar/me_icon@2x.png",
        imgUrl: "../image/tabbar/me_icon_hui@2x.png",
        path: "/pages/me/me"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeTab(e) {
      let item = e.currentTarget.dataset.item
      if (item.id == 2) return wx.navigateTo({
        url: "/personal/pages/wxLogin/wxLogin"
      });
      wx.switchTab({
        url: item.path,
      });
    }
  },
})