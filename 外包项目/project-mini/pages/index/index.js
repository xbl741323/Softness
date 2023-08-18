// index.js
import {
  getInfo,
  getInfoList
} from "../../utils/api/main"
Page({
  data: {
    keyWords: '',
    pageNum: 1,
    pageSize: 10,
    dataList: [],
    total: 0,
    reachStatus: false,
    id: '',
    info: {
      title: '',
      imgUrl: ''
    }
  },
  // 清空关键字信息
  clearKey() {
    this.setData({
      keyWords: ''
    })
    this.getAllList()
  },
  // 获取第一页列表数据
  getAllList() {
    this.setData({
      pageNum: 1
    })
    this.getList()
  },
  // 获取列表数据
  getList() {
    let params = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      key: this.data.keyWords
    }
    getInfoList(params).then(res => {
      if (res.code == 0) {
        let result = res.data
        let dataList = this.data.dataList
        let reachStatus = this.data.reachStatus
        this.setData({
          dataList: reachStatus ? dataList.concat(result.records) : result.records,
          total: result.totalRow,
          reachStatus: false
        })
      }
    })
  },
  // 获取扫码查询详情数据
  getDetail() {
    let id = this.data.id
    let that = this
    getInfo(id).then(res => {
      if (res.code == 0) {
        let result = res.data
        let info = this.data.info
        info.title = result.name
        info.imgUrl = result.descUrl
        this.setData({
          info: info
        })
        wx.showToast({
          icon: 'loading',
          title: '扫码成功！',
        })
        setTimeout(() => {
          that.toDetail()
        }, 500)
      } else {
        wx.showToast({
          icon: 'none',
          title: '查询结果为空！',
        })
      }
    })
  },
  // 条形码扫码事件
  scanChange() {
    let that = this
    wx.scanCode({
      success(res) {
        console.log(res, 'res')
        if (res.result) {
          that.setData({
            id: res.result
          })
          that.getDetail()
        }
      },
      fail(err) {
        wx.showToast({
          icon: 'none',
          title: '扫码失败，请确认条形码是否正确！',
        })
      }
    })
  },

  // 设置info值，并跳转到详情
  setInfo(e) {
    let result = e.currentTarget.dataset.info
    let info = this.data.info
    info.title = result.name
    info.imgUrl = result.descUrl
    this.setData({
      info: info
    })
    this.toDetail()
  },

  // 跳转到详情页
  toDetail() {
    let info = JSON.stringify(this.data.info)
    wx.navigateTo({
      url: `/pages/detail/detail?info=${info}`,
    })
  },
  // 输入框change事件
  changeInput(e) {
    this.setData({
      keyWords: e.detail.value.trim(),
    });
  },
  // 输入框enter回车事件
  onSearch() {
    this.getAllList()
  },
  // 查询按钮点击事件
  onClick() {
    this.getAllList()
  },
  onLoad() {
    this.getList()
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log('触底加载了！');
    let dataList = this.data.dataList
    let total = this.data.total
    let pageNum = this.data.pageNum
    if (dataList.length < total) {
      this.setData({
        reachStatus: true,
        pageNum: pageNum + 1,
      })
      this.getList()
    }
  },
  // 转发给朋友
  onShareAppMessage(res) {
    return {
      title: "烟草工具书", //默认小程序标题
      path: '/pages/index/index'
    }
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: "烟草工具书", //默认小程序标题
      path: '/pages/index/index'
    }
  },
})