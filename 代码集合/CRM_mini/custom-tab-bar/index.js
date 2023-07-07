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
        selectImgUrl: "/image/tabbar/btn_home_h@2x.png",
        imgUrl: "/image/tabbar/btn_home_n@2x.png",
        path: "/pages/index/index"
      },
      {
        id: 1,
        title: "产品",
        selectImgUrl: "/image/tabbar/btn_product_h@2x.png",
        imgUrl: "/image/tabbar/btn_product_n@2x.png",
        path: "/pages/product/product"
      },
      {
        id: 2,
        title: "课堂",
        selectImgUrl: "/image/tabbar/btn_course_h@2x.png",
        imgUrl: "/image/tabbar/btn_course_n@2x.png",
        path: "/pages/wtClass/wtClass"
      },
      {
        id: 3,
        title: "我的",
        selectImgUrl: "/image/tabbar/btn_centre_h@2x.png",
        imgUrl: "/image/tabbar/btn_centre_n@2x.png",
        path: "/pages/personal/personal"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeTab(e) {
      let item = e.currentTarget.dataset.item
      wx.switchTab({
        url: item.path,
      });
    }
  },
})