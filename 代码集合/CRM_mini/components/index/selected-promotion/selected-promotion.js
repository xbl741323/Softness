// components/index/selected-promotion/selected-promotion.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectedList: [{
        bgUrl: "/image/index/pic_gaoqi@2x.png",
        iconUrl: "/image/index/icon_gaoqi@2x.png",
        title: "高企认定",
        desc: "资金奖补，减免减税",
        path: "/product/pages/detail/detail?id=7020&type=0"
      },
      {
        bgUrl: "/image/index/pic_register@2x.png",
        iconUrl: "/image/index/icon_register@2x.png",
        title: "软件著作权登记",
        desc: "极速高效，服务优先",
        path: "/product/pages/detail/detail?id=15&type=1"
      },
      {
        bgUrl: "/image/index/pic_functional@2x.png",
        iconUrl: "/image/index/icon_functional@2x.png",
        title: "实用新型专利申请",
        desc: "微创新，快授权",
        path: "/product/pages/detail/detail?id=2&type=1"
      },
      {
        bgUrl: "/image/index/pic_invent@2x.png",
        iconUrl: "/image/index/icon_invent@2x.png",
        title: "发明专利申请",
        desc: "专业团队，优质服务",
        path: "/product/pages/detail/detail?id=1&type=1"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 页面跳转
    skipToPage(e) {
      let item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: item.path,
      })
    },
  }
})