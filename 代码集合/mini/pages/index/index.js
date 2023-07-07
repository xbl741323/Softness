// personal/pages/orderIndex/order.js
const app = getApp();
import {
  getClassNonLogin,
  getSVideoNonLogin
} from "../../utils/api/wtClass"
import {
  getAreaNo,
} from "../../utils/api"
import {
  getNewProduct
} from "../../utils/api/product"
import {
  getDistrict
} from "../../utils/api/search"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minProjectHight: (wx.getStorageSync('windowHeight')) + 'px',
    headerBack: wx.getStorageSync('width-background') + 'px',
    productBoxLocation: "", //首页项目申报固定顶部距离
    isShowNavbar: false,
    isShowSearchbar: false,
    showTop: false,
    keywords: '高新技术企业',
    loadingStatus: false,
    onReachStatus: false,
    imageUrl: app.globalData.imageURL,
    total: 0,
    page: 1,
    pageSize: 10,
    province: wx.getStorageSync('province'),
    provinceId: wx.getStorageSync('provinceId'),
    bgUrl: "//static-tst.wotao.com/filebase/c168c4c36196435b8829d899c999315e.png",
    newIndex: 0,
    newProductList: [],
    eightList: [{
        imgUrl: "../../image/index/wotao_project.png",
        title: "项目申报",
        classType: 0
      },
      {
        imgUrl: "../../image/index/wotao_zhichan.png",
        title: "知识产权",
        classType: 1
      },
      {
        imgUrl: "../../image/index/wotao_gongshang.png",
        title: "工商财税",
        classType: 2
      },
      {
        imgUrl: "../../image/index/wotao_rongzi.png",
        title: "融资上市",
        classType: 3
      },
      {
        imgUrl: "../../image/index/wotao_falv.png",
        title: "法律服务",
        classType: 4
      },
      {
        imgUrl: "../../image/index/wotao_ruanjian.png",
        title: "软件开发",
        classType: 5
      },
      {
        imgUrl: "../../image/index/wotaoketang_icon.png",
        title: "卧涛课堂",
        classType: 99
      },
      {
        imgUrl: "../../image/index/wotao_gengduo.png",
        title: "更多",
        classType: 0
      }
    ],
    specialList: [{
        title: "高新技术企业认定",
        desc: "资金补助、减税、招投...",
        bgUrl: "//static-tst.wotao.com/filebase/cbd891dc9fe540c7b89fdfb17dabc0b4.png",
        id: 7020,
        type: 1
      },
      {
        title: "发明专利申请",
        desc: "全程根据，专业高效",
        bgUrl: "//static-tst.wotao.com/filebase/19ac91a959384aadaffa30162053a084.png",
        id: 1,
        type: 2
      },
      {
        title: "公司注册",
        desc: "专业顾问团队、咨询指导",
        bgUrl: "//static-tst.wotao.com/filebase/3e76b7622a93418297bd2e5f77ceb8f8.png",
        id: 301,
        type: 7
      },
      {
        title: "科技成果评价",
        desc: "权威科技成果评价机构",
        bgUrl: "//static-tst.wotao.com/filebase/2dfe8dc6beb64252b39ed9f1fcc00d91.png",
        id: 7069,
        type: 1
      }
    ],
    categoryId: 1, //会影响产品详情地区显示
    newList: [{
      title: "项目申报",
      type: 1
    }, {
      title: "知识产权",
      type: 2
    }, {
      title: "工商财税",
      type: 7
    }, {
      title: "融资上市",
      type: 9
    }, {
      title: "法律服务",
      type: 10
    }, {
      title: "软件开发",
      type: 11
    }],
    vipFreeList: [], // vip免费
    shortUrl: {},
    areaDialog: false,
    areaValue: [],
    region: [],
    isLocal: false
  },
  // 获取课程列表
  getClassData() {
    let params = {
      pageSize: 3,
      pageNo: 1,
      baseShowState: 1,
      getTrySeeSectionNumber: true,
      tradingChargeType: 2, // 1-完全免费 2-vip免费 3-单独收费
    }
    getClassNonLogin(params).then(res => {
      if (res.code == 0 && res.data && res.data.data && res.data.data.records) {
        this.setData({
          vipFreeList: res.data.data.records.slice(0, 2)
        })
      }
    })
  },
  // 获取短视频列表
  getShortList() {
    let params = {
      pageSize: 1,
      pageNo: 1
    }
    getSVideoNonLogin(params).then(res => {
      if (res.code == 0) {
        this.setData({
          shortUrl: res.data.records[0]
        })
      }
    })
  },
  // 跳转短视频详情
  toShortDetail() {
    app.checkLogin();
    wx.navigateTo({
      url: `/classRoom/pages/detail/shortVideo/shortVideo?id=${this.data.shortUrl.id}`,
    })
  },
  // 跳转课程详情
  toCourseDetail(e) {
    app.checkLogin();
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/classRoom/pages/detail/course/course?id=${id}`,
    })
  },
  //去会员首页
  toMember() {
    wx.navigateTo({
      url: '/personal/pages/class/member'
    })
  },
  // 回到页面顶部
  toTop() {
    app.toTop()
  },
  // 跳转到地区选择页
  skipToArea() {
    this.setData({
      areaDialog: !this.data.areaDialog
    })
  },
  // 去课堂首页
  toClass() {
    wx.switchTab({
      url: '/pages/classRoom/classRoom'
    })
  },
  // 跳转到分类页面
  skipToClassify(e) {
    let item = e.currentTarget.dataset.item
    let urls = item.classType == 99 ? '/pages/classRoom/classRoom' : '/pages/classify/classify?type=' + item.classType
    wx.reLaunch({
      url: urls
    })
  },
  inputCom(e) {
    this.setData({
      keywords: e.detail.value
    })
  },
  // 跳转到全局搜索页面
  skipToGlobal(e) {
    let info = e.currentTarget.dataset.to;
    let urls = '';
    if (info != undefined) {
      urls = '/search/pages/globalSearch/globalSearch?keyWords='
    } else {
      urls = '/search/pages/global/global?keywords='
    }
    if (wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: urls + this.data.keywords,
      })
    } else {
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
  // 跳转到精选服务详情页面
  skipToSpecial(e) {
    if (wx.getStorageSync('userInfo')) {
      let item = e.currentTarget.dataset.item
      wx.navigateTo({
        url: `/search/pages/productdetails/productdetails?id=${item.id}&type=${item.type}`
      })
    } else {
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
  // 转发给朋友
  onShareAppMessage(res) {
    return {
      title: "卧涛商城", //默认小程序标题
      path: '/pages/index/index'
    }
  },
  //分享到朋友圈
  onShareTimeline() {
    return {
      title: "卧涛商城", //默认小程序标题
      path: '/pages/index/index'
    }
  },
  //调用微信位置经纬度转化接口
  getLocation() {
    var that = this
    wx.getLocation({
      success: function (res) {
        // 引入SDK核心类，将“wgs84”转中文
        var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
        // 实例化API核心类
        var qqmapsdk = new QQMapWX({
          key: '23YBZ-ATLCP-N3LDV-L6UZH-HNC5Q-EQB4C' // 卧涛腾讯KEY
        });
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            let city = res.result.address_component.city
            wx.setStorageSync('province', city)
            wx.setStorageSync('city', city)
            that.getLocationId(city)
          },
          fail: function (res) {
            wx.setStorageSync('city', "合肥市")
            wx.setStorageSync('province', "合肥市")
            wx.setStorageSync('provinceId', "340100")
            that.setData({
              province: wx.getStorageSync('province'),
              provinceId: wx.getStorageSync('provinceId')
            })
          },
          complete: function (completeres) {
            that.setData({
              province: wx.getStorageSync('province'),
            })
            that.getLocationId(wx.getStorageSync('province'))
            that.getData()

          }
        })
      },
      fail: function (res) {
        wx.setStorageSync('city', "合肥市")
        wx.setStorageSync('province', "合肥市")
        wx.setStorageSync('provinceId', "340100")
        that.getData()
        that.setData({
          province: wx.getStorageSync('province'),
          provinceId: wx.getStorageSync('provinceId')
        })
      },
    })
  },
  // 位置授权
  setDefaultArea() {
    let that = this
    that.setData({
      isLocal: true
    })
    that.getData()
    that.setData({
      province: wx.getStorageSync('province'),
      provinceId: wx.getStorageSync('provinceId')
    })
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] === false) { //非初始化进入该页面,且未授权(之前授权拒绝)
          wx.showModal({
            title: '是否授权当前位置',
            content: '请确认授权，我们将为您提供更准确的服务',
            success: function (res) {
              if (res.cancel) {
                wx.setStorageSync('city', "合肥市")
                wx.setStorageSync('province', "合肥市")
                wx.setStorageSync('provinceId', "340100")
                that.getData()
                that.setData({
                  province: wx.getStorageSync('province'),
                  provinceId: wx.getStorageSync('provinceId')
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用getLocationt的API
                      that.getLocation();
                    } else {
                      wx.setStorageSync('city', "合肥市")
                      wx.setStorageSync('province', "合肥市")
                      wx.setStorageSync('provinceId', "340100")
                      that.getData()
                      that.setData({
                        province: wx.getStorageSync('province'),
                        provinceId: wx.getStorageSync('provinceId')
                      })
                    }
                  }
                })
              }
            },
          })
        } else if (res.authSetting['scope.userLocation'] === undefined) { //初始化进入
          that.getLocation();
        }
      },
      fail: (res) => {
        wx.setStorageSync('city', "合肥市")
        wx.setStorageSync('province', "合肥市")
        wx.setStorageSync('provinceId', "340100")
        that.getData()
        that.setData({
          province: wx.getStorageSync('province'),
          provinceId: wx.getStorageSync('provinceId')
        })
      }
    });
  },
  // 获取定位数据
  getLocationId(val) {
    if (val != '') {
      getAreaNo({
        name: val,
        level: 2
      }).then(res => {
        if (res.data.code == 0) {
          wx.setStorageSync('provinceId', res.data.data.no);
          this.setData({
            provinceId: res.data.data.no,
          })
        }
      })
    }
  },
  // 获取新产品列表数据
  getNewProduct() {
    let newIndex = this.data.newIndex
    let type = this.data.newList[newIndex].type
    let onReachStatus = this.data.onReachStatus
    let strProvinceId = String(this.data.provinceId)
    let finalProvinceId = strProvinceId.slice(0, strProvinceId.length - 1) + '1'
    let params = {
      pageNo: this.data.page,
      pageSize: this.data.pageSize,
      categoryIdList: type == 2 ? [3, 4, 5, 6] : [type],
      spuArea: '',
      spuKinds: '',
      spuLevel: '全部'
    }
    if (newIndex == 0) {
      if (wx.getStorageSync('provinceId')) {
        let val = wx.getStorageSync('provinceId')
        params.spuArea = val
      }
      // params.generateAttributeList = [{
      //   attributeId: 1,
      //   attributeValueList: ["100001", finalProvinceId]
      // }]
    }
    getNewProduct(params).then(res => {
      if (res.code == 0) {
        let newProductList = this.data.newProductList
        this.setData({
          newProductList: onReachStatus == true ? newProductList.concat(res.data.records) : res.data.records,
          onReachStatus: false,
          total: res.data.total,
          loadingStatus: false
        })
      }
    })
  },
  // 获取列表数据总入口
  getNewList() {
    this.setData({
      loadingStatus: true
    })
    this.getNewProduct()
  },

  // 新产品类型选择
  changeNew(e) {
    let index = e.currentTarget.dataset.index;
    let list = this.data.newList;
    this.setData({
      newIndex: index,
      page: 1,
      categoryId: list[index].type,
      // newProductList: [],
      onReachStatus: false,
    })
    wx.pageScrollTo({
      scrollTop: this.data.productBoxLocation, //页面滚动的距离
      duration: 0, //页面滚动速度 单位ms
      success: function (e) { //成功函数          
      }
    });
    this.getNewList()
  },
  //监听页面滑动
  onPageScroll(e) {
    var that = this;
    that.setData({
      showTop: e.scrollTop > 200 ? true : false,
      isShowNavbar: e.scrollTop >= this.data.productBoxLocation ? true : false,
      isShowSearchbar: e.scrollTop > 190 ? true : false,
    })
  },
  // 修改tabbar index
  changeTabbar() {
    let islogin = wx.getStorageSync('userInfo') ? true : false
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
        isLogin: islogin
      })
    }
  },
  // 获取选择的地区
  getSelectArea() {
    let provinceId = this.data.provinceId
    if (wx.getStorageSync('provinceId')) {
      if (wx.getStorageSync('provinceId') != provinceId) {
        this.setData({
          provinceId: wx.getStorageSync('provinceId')
        })
        this.getNewList()
      } else {
        this.setData({
          provinceId: wx.getStorageSync('provinceId')
        })
      }
    } else {
      this.setData({
        provinceId: 340100
      })
    }
    if (wx.getStorageSync('province')) {
      this.setData({
        province: wx.getStorageSync('province')
      })
    } else {
      this.setData({
        province: "合肥市"
      })
    }
    wx.removeStorageSync('areaFilter')
  },

  // 获取子组件传值
  getCityName(e) {
    if (e.detail != '') {
      this.setData({
        province: e.detail,
        areaDialog: false
      })
      this.getNewList()
    } else {
      this.setData({
        areaDialog: false
      })
    }
  },
  getData() {
    getDistrict().then(res => {
      if (res.data.code == 0) {
        let data = res.data.data
        wx.setStorageSync('district', data)
        let cityId = this.data.provinceId
        let index1 = 0
        let index2 = 0
        let parentno = ''
        data.forEach((item) => {
          item.children.map(function (citem, cindex) {
            if (citem.no == cityId) {
              parentno = citem.parentNo
              index2 = cindex
            }
          })
        })
        data.map(function (item, index) {
          if (item.no == parentno) {
            index1 = index
          }
        })
        this.setData({
          areaValue: [index1, index2],
          region: wx.getStorageSync('district')
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.createSelectorQuery().select('#productBox').boundingClientRect(function (rect) {
      that.setData({
        productBoxLocation: rect.top
      })
    }).exec()
    this.getShortList();
    this.getClassData();
    this.getNewList()
    this.setDefaultArea()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.data.isLocal) {
      this.setDefaultArea()
    }
    this.changeTabbar();
    if (wx.getStorageSync('areaFilter')) {
      this.setData({
        page: 1,
        newProductList: []
      })
      // 获取当前定位地区数据
      this.getSelectArea()
    } else {
      this.getSelectArea()
    }
    if (this.selectComponent("#wx")) {
      this.selectComponent("#wx").getUserData()
    }
    if (this.data.province != wx.getStorageSync('province')) {
      this.setData({
        province: wx.getStorageSync('province'),
        provinceId: wx.getStorageSync('provinceId')
      })
    }
    this.getLocationId(wx.getStorageSync('province'))
    this.getData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let total = this.data.total
    let newProductList = this.data.newProductList
    this.setData({
      onReachStatus: true
    })
    if (this.data.onReachStatus && newProductList.length < total) {
      this.setData({
        page: this.data.page + 1
      })
      this.getNewList()
    }
  },
})