// components/product/footBar/footBar.js
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
		isLogin: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toIndex() {
      wx.switchTab({
        url: "/pages/index/index",
      })
    },
    checkLogin() {
			if (!wx.getStorageSync('userInfo')) {
				wx.showToast({
					title: '您还未登录,请先登录吧~',
					icon: 'none',
					duration: 1000
				})
				setTimeout(function () {
					wx.navigateTo({
						url: "/personal/pages/wxLogin/wxLogin"
					})
				}, 1000)
      }
		},
  },
  lifetimes: {
		attached: function () {
			// 在组件实例进入页面节点树时执行
			if (wx.getStorageSync('userInfo')) {
				this.setData({
					isLogin: true
				})
			}
		},
		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},
	},
})
