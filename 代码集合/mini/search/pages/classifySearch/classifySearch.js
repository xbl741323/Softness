// search/pages/classifySearch/classifySearch.js
const app = getApp();
const getProjectList = require('../../../utils/api.js').getProjectList;
const getPropertyList = require('../../../utils/api.js').getPropertyList;
const getPolicyAreaOptions = require('../../../utils/api.js').getPolicyAreaOptions;
Page({
  data: {
    isGlobal: false,
    screenHight: wx.getStorageSync('windowHeight') - (235 / 750) * wx.getStorageSync('screenWidth') + 'px',
    searchCode: "0", //0-项目申报；1-知产
    inputValue: "",
    optionId: "",
    isShow: false,
    areaName: wx.getStorageSync('province'),
    projectList: [],
    propertyList: [],
    imageUrl: app.globalData.imageURL,
    page: 1,
    total: 1,
    flag: true, //判断数据是否加载完成 
    noData: false,
    showTop: "",
    videoControl: false,
    cityChoosed: "noArea", //地区编号,"noArea"表示全国
    bannerList: [{
      type: 1,
      id: "noArea",
      name: "地区"
    }, {
      type: 2,
      id: "noDepart",
      name: "归口"
    }, {
      type: 3,
      name: "排序"
    }] //初始化在父组件中定义，值由子组件传送
  },
  //跳转到全局搜索页
  toSearch() {
    wx.redirectTo({
      url: '/search/pages/global/global?kerWords=' + this.inputValue,
    })
  },
  //分类搜索
  confirmSearch() {
    this.setData({
      page: 1,
      projectList: []
    });
    this.getList();
  },
  cancelInput() {
    this.setData({
      inputValue: '',
      page: 1,
      projectList: []
    });
    this.getList();
  },
  //接收子组件参数变化
  // 监听isShow
  numChange(e) {
    this.setData({
      isShow: e.detail
    })
  },
  // 监听地区选择编号
  cityChange(e) {
    this.setData({
      cityChoosed: e.detail
    })
  },
  // 监听banner(地区、归口、排序)切换
  bannerChange(e) {
    console.log(e, "wxz")
    this.setData({
      bannerList: e.detail,
      projectList: [],
      page: 1
    })
    this.getList()
  },
  hide() {
    if (this.data.isShow) {
      this.setData({
        isShow: false,
      })
    }
  },
  toTop() {
    app.toTop()
  },
  onPageScroll(e) {
    if (e.scrollTop > 0) {
      this.setData({
        showTop: true
      })
    } else {
      this.setData({
        showTop: false
      })
    }
  },
  toProjectDetail(e) {
    let number = e.currentTarget.dataset.number;
    wx.navigateTo({
      url: "/search/pages/projectDetail/projectDetail?number=" + number
    })
  },
  toPropertyDetail(e) {
    let number = e.currentTarget.dataset.number;
    wx.navigateTo({
      url: "/search/pages/propertyDetail/propertyDetail?propertyId=" + number
    })
  },
  getInputValue(e) {
    // console.log(e.detail.value,this.data.inputValue)
    this.setData({
      inputValue: e.detail.value
    });
  },
  getPropertyList() { //知产列表
    var that = this;
    let params = {
      keyword: that.data.inputValue,
      token: wx.getStorageSync('token'),
      pageNum: that.data.page,
      pageSize: 10
    }
    if (that.data.flag) {
      wx.showLoading({
        title: '加载中！',
      })
      getPropertyList(params).then(res => {
        if (res.code == 0) {
          that.setData({
            propertyList: that.data.propertyList.concat(res.data.list),
            page: that.data.page + 1,
            flag: true,
            total: res.data.pages
          })
          if (that.data.propertyList.length == 0) {
            that.setData({
              noData: true
            })
          }
          wx.hideLoading({
            success: (res) => {},
          })
        }
      })
    } else {
      setTimeout(function () {
        getPropertyList(params).then(res => {
          if (res.code == 0) {
            that.setData({
              propertyList: that.data.propertyList.concat(res.data.list),
              page: that.data.page + 1,
              flag: true,
            })
          }
        })
      }, 1000);
    }
  },
  getList() { //项目申报列表
    console.log(this.data.cityChoosed, "cityChoosed")
    var that = this
    let params = {
      size: 10,
      type: 4,
      isTitle: true,
      isContent: true,
      keyWords: that.data.inputValue,
      loginToken: wx.getStorageSync('token'),
      start: that.data.page
    }
    if (this.data.cityChoosed == 'noArea') {
      params.areaNos = [];
    } else if (this.data.cityChoosed == "100000") {
      params.areaNos = ["100000", "100001", "100001"];
    } else if (this.data.cityChoosed == "100001") {
      params.areaNos = ["100001", "100001"];
    } else {
      params.areaNos = this.data.cityChoosed.split(',');
    }
    if (that.data.bannerList[1].id) {
      let categories = [];
      if (that.data.bannerList[1].id == "noDepart") {
        categories.push({
          id: 2,
          name: "归口",
          optionIds: []
        })
      } else {
        categories.push({
          id: 2,
          name: "归口",
          optionIds: [that.data.bannerList[1].id]
        })
      }
      params.categories = categories;
    }
    if (that.data.bannerList[2].id == "lastest") {
      params.isNewest = true;
      params.isHotSpot = false;
    } else if (that.data.bannerList[2].id == "hottest") {
      params.isNewest = false;
      params.isHotSpot = true;
    } else {
      params.isNewest = false;
      params.isHotSpot = false;
    }
    if (that.data.flag) {
      wx.showLoading({
        title: '加载中！',
      })
      getProjectList(params).then(res => {
        if (res.code == 0) {
          let policesList = [];
          res.data.policyList.list.forEach((item, index) => {
            if (item.coverUrls.length > 0) {
              item.coverUrls.forEach(urlItem => {
                if (urlItem.isCover == 1) {
                  item.coverUrl = urlItem.spUrl ? urlItem.spUrl : urlItem.url;
                }
              })
            }
            policesList[index] = Object.assign(item, {
              urlType: item.coverUrl ? item.coverUrl.substr(item.coverUrl.lastIndexOf('.') + 1) : ''
            })
          })
          that.setData({
            projectList: that.data.projectList.concat(policesList),
            page: that.data.page + 1,
            flag: true,
            total: res.data.policyList.pages
          })
          if (that.data.projectList.length == 0) {
            that.setData({
              noData: true
            })
          } else {
            that.setData({
              noData: false
            })
          }
          wx.hideLoading({
            success: (res) => {},
          })
        }
      })
    } else {
      setTimeout(function () {
        getProjectList(params).then(res => {
          if (res.code == 0) {
            let policesList = [];
            res.data.policyList.list.forEach((item, index) => {
              if (item.coverUrls.length > 0) {
                item.coverUrls.forEach(urlItem => {
                  if (urlItem.isCover == 1) {
                    item.coverUrl = urlItem.spUrl ? urlItem.spUrl : urlItem.url;
                  }
                })
              }
              policesList[index] = Object.assign(item, {
                urlType: item.coverUrl ? item.coverUrl.substr(item.coverUrl.lastIndexOf('.') + 1) : ''
              })
            })
            that.setData({
              projectList: that.data.projectList.concat(policesList),
              page: that.data.page + 1,
              flag: true,
            })
          }
        })
      }, 1000);
    }
  },
  // 转发给朋友
  onShareAppMessage(res) {
    return {
      title: app.globalData.shareTitle, //默认小程序标题
      path: app.globalData.sharePath
    }
  },
  //分享到朋友圈
  onShareTimeline() {
    return {
      title: app.globalData.shareTitle, //默认小程序标题
      path: app.globalData.sharePath
    }
  },
  onLoad: function (options) {
    console.log(options.inputValue, "inputValue")
    console.log(options.searchCode, " options.searchCode")
    console.log(options.optionId, "大大大大大多多多多")
    if (options && options.optionId) {
      let bannerList = this.data.bannerList
      bannerList[1].id = options.optionId
      this.setData({
        optionId: options.optionId,
        bannerList: bannerList
      });
    }
    if (options && options.searchCode) this.setData({
      searchCode: options.searchCode
    });
    if (options && options.inputValue !== '' && options.inputValue !== 'undefined') this.setData({
      inputValue: options.inputValue
    });
    if (options && options.isGlobal) this.setData({
      isGlobal: options.isGlobal
    });
    // 进入页面带入地区代码  
    if (this.data.searchCode == 0) { //项目申报
      var that = this;
      if (wx.getStorageSync('province') != "全国") {
        let bannerList = this.data.bannerList.concat([])
        // bannerList[0]={type:1,idflag:"sheng",name:wx.getStorageSync('province')}//idflag用来区分带入的地区
        getPolicyAreaOptions({
          type: 4
        }).then(res => {
          if (res.code == 0) {
            for (let i = 0; i < res.data.area.length; i++) {
              let item = res.data.area[i];
              if (wx.getStorageSync('province') == item.label || wx.getStorageSync('provinceId') == item.value) { //带入的省级                   
                let allCode = [item.children[0].value, item.children[1].value, item.value].join(',') //各省底下的"全部"传值：国家级、省级、省
                bannerList[0] = {
                  type: 1,
                  id: allCode,
                  name: "地区"
                };
                // bannerList[0].id="id"
                that.setData({
                  bannerList: bannerList,
                  cityChoosed: allCode
                })
                break;
              }
            }
            this.getList();
          }
        })
      } else {
        this.getList();
      }
    } else {
      this.getPropertyList()
    }
  },
  onShow: function () {},
  // 上拉刷新
  onReachBottom: function () {
    if (this.data.flag && this.data.page <= this.data.total) {
      this.setData({
        flag: false
      })
      if (this.data.searchCode == 1) {
        this.getPropertyList()
      } else {
        this.getList()
      }
    }
  },
})