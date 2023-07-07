const app = getApp();
var WxParse = require('../wxParse/wxParse.js');
const getProjectDetail = require('../../../utils/api.js').getProjectDetail;
const deleteCollection = require('../../../utils/api.js').deleteCollection;
const addCollection = require('../../../utils/api.js').addCollection;
import {
  addCollect,
  batchDelCollect
} from "../../../utils/api/collect.js"
Page({
  data: {
    show: true,
    projectInfo: {},
    loading: false,
    title: "",
    slogan: "",
    coverUrl: "",
    imageUrl: app.globalData.imageURL,
    bannerList: [{
      id: "list0",
      name: "项目详情"
    }, {
      id: "list1",
      name: "项目参数"
    }, {
      id: "list2",
      name: "售后保障"
    }],
    isShowNavbar: false,
    showTop: false,
    articleArray: [],
    toViewid: 'list0',
    number: '',
    videoControl: false,
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    coverUrls: [],
    isCollected: 1,
    descList: ["快速响应", "专业代理", "品质服务", "无忧售后", ],
    categories: [],
    shareTitle: "",
    resourceTitle: "",
    iconList: [{
      name: "全程监督",
      url: "/search/image/details/icon01_label_details@2x.png"
    }, {
      name: "保障权益",
      url: "/search/image/details/icon02_label_details@2x.png"
    }, {
      name: "十年行业经验",
      url: "/search/image/details/icon03_label_details@2x.png"
    }]

  },
  changeShow() {
    this.setData({
      show: true
    })
  },
  // 展示价格panel
  showPanel() {
    this.setData({
      show: false
    })
  },
  // 回到首页
  toIndex() {
    wx.switchTab({
      url: "/pages/index/index",
    })
  },
  //收藏操作 
  handlCollection() {
    var that = this;
    let accountId = wx.getStorageSync('accountId')
    if (this.data.isCollected == 0) {
      let params = {
        number: this.data.number,
        resourceTitle: this.data.resourceTitle
      }
      deleteCollection(params).then(res => {
        if (res.code == 0) {
          wx.showToast({
            title: '已取消收藏',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            isCollected: 1
          })
        }
      })
    } else {
      let params = {
        number: this.data.number,
        resourceTitle: this.data.resourceTitle
      }
      addCollection(params).then(res => {
        if (res.code == 0) {
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            isCollected: 0
          })
        }
      })
    }
  },
  // 回到页面顶部
  toTop() {
    app.toTop()
  },
  //监听页面滑动
  onPageScroll(e) {
    var that = this;
    if (e.scrollTop > 0) {
      that.setData({
        showTop: true
      })
    } else {
      that.setData({
        showTop: false
      })
    }
    wx.createSelectorQuery().select('#productBox').boundingClientRect(function (rect) {
      if (rect.top <= 0) {
        that.setData({
          isShowNavbar: true
        })
      } else {
        that.setData({
          isShowNavbar: false
        })
      }
    }).exec()
  },
  changeNavBar(e) {
    let myid = e.currentTarget.dataset.myid;
    this.setData({
      toViewid: myid,
    })
    var query = wx.createSelectorQuery() //创建节点查询器    
    query.selectViewport().scrollOffset(); //节点的竖直滚动位置
    query.select(`#${myid}`).boundingClientRect() //动态获取id
    query.exec(function (res) { //执行请求
      wx.pageScrollTo({
        scrollTop: res[0].scrollTop + res[1].top, //滚动到页面节点的上边界坐标
        duration: 0 // 滚动动画的时长
      });
    })
  },
  getList() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    let params = {
      number: this.data.number,
      token: 3,
      type: 4
    }
    getProjectDetail(params).then(res => {
      if (res.code == 0) {
        let detail = res.data.detail
        that.setData({
          projectInfo: detail,
          title: detail.title,
          coverUrl: detail.coverUrl,
          categories: detail.categories,
          isCollected: res.data.isCollected,
          shareTitle: detail.title, //详情页面分享的title
          resourceTitle: detail.title
        })
        if (detail.coverUrls && detail.coverUrls.length > 0) {
          let urlList = [];
          detail.coverUrls.forEach((item, index) => {
            urlList[index] = Object.assign(item, {
              urlType: item.url.substr(item.url.lastIndexOf('.') + 1)
            })
          })
          that.setData({
            coverUrls: urlList,
          });
        }
        let articleArray = [];
        articleArray.push({
          title: "项目详情",
          content: detail.content
        });
        articleArray.push({
          title: "项目参数",
          content: detail.productParam ? detail.productParam : ''
        });
        articleArray.push({
          title: "项目保障",
          content: detail.saleProtection ? detail.saleProtection : ''
        });
        for (let i = 0; i < articleArray.length; i++) {
          WxParse.wxParse('article' + i, 'html', articleArray[i].content, that);
          if (i === articleArray.length - 1) {
            //最终this.data里的articleArray只是富文本片段
            WxParse.wxParseTemArray("articleArray", 'article', articleArray.length, that);
          }
          // console.log(that.data.articleArray,"articleArray")       
        }
        this.setData({
          loading: true
        })
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },
  // 转发给朋友
  onShareAppMessage(res) {
    return {
      title: this.data.shareTitle,
    }
  },
  //分享到朋友圈
  onShareTimeline() {
    return {
      title: this.data.shareTitle,
    }
  },
  onLoad: function (options) {
    this.setData({
      number: options.number
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})