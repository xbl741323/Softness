const app = getApp();
var WxParse = require('../wxParse/wxParse.js');
import {
  addPageViews,
  pageWeightSpu,
  pageInfo,
  getNewProduct
} from "../../../utils/api/product.js"
import {
  allFactor
} from "../../../utils/api"
import {
  filterArea
} from "../../../utils/common/cacheDatas"
import {
  getProductInfo,
  isCollected,
  addcollect,
  cancelcollect
} from "../../../utils/api/productdetails.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotList: [],
    videoControl: false,
    spuId: '',
    belong: null,
    goodsIdgoodsId: '',
    proType: '',
    navBarIndex: 0, // 导航头下标
    showTabStatus: false, // 控制导航头显示
    imageUrl: app.globalData.imageURL,
    articleTitleArray: [],
    articleArray: [], //富文本
    coverUrls: [], //轮播图
    iconList: [{
      name: "全程监督",
      url: "/search/image/productdetails/quanchengjiandu_icon@2x.png"
    }, {
      name: "保障权益",
      url: "/search/image/productdetails/baozhangquanyi_icon@2x.png"
    }, {
      name: "十年行业经验",
      url: "/search/image/productdetails/shinianjingyan_icon@2x.png"
    }],
    baseInfo: {},
    attributeList: [], //属性规格
    transactionList: [], //后台配置可交易选项
    activeKey: null, // 默认选中规格
    flag: null, //是否为单层属性
    productNum: 1, //数量
    collectStatus: false,
    dialogImgList: [], //弹框里面内容
    choiceAttribute: {}, // 选中的规格（动态）
    attributeText: null, // 选中的文案（动态）
    showDialog: false,
    area: '',
    noPriceIndex: [],
    skuIndexArr: [],
    noSetPrice: false,

  },
  // 导航头选择并滑动到指定区域
  changeNav(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      navBarIndex: index
    })
    var query = wx.createSelectorQuery() // 创建节点查询器    
    query.selectViewport().scrollOffset(); // 节点的竖直滚动位置
    query.select(`#pc-item${index}`).boundingClientRect() // 动态获取id
    query.exec(function (res) { // 执行请求
      wx.pageScrollTo({
        scrollTop: res[0].scrollTop + res[1].top - 46, // 滚动到页面节点的上边界坐标
        duration: 0 // 滚动动画的时长
      });
    })
  },
  // 获取产品详情
  getDetail(spuId) {
    console.log(this.data.spuId, 'getDetail');
    wx.showLoading({
      title: '加载中',
    })
    getProductInfo({
      spuId
    }).then(res => {
      if (res.code == 0) {
        wx.hideLoading({
          success: (res) => {}
        })
        let data = res.data
        //轮播图
        if (data.baseInfo.imageList && data.baseInfo.imageList.length) {
          let urlList = []
          data.baseInfo.imageList.forEach((item, index) => {
            urlList[index] = Object.assign(item, {
              urlType: item.imageUrl.substr(item.imageUrl.lastIndexOf('.') + 1)
            })
          })
          this.setData({
            coverUrls: urlList
          })
        }
        if (data.baseInfo.categoryId == 1) {
          let areas = [];
          let aItem = data.baseInfo.generateAttributeList.find(item => item.attributeName == '地区');
          let belongs = data.baseInfo.generateAttributeList.find(item => item.attributeId == 2);
          areas[0] = Number(aItem.attributeValueDesc)
          areas[1] = Number(aItem.attributeValue)
          this.setData({
            areas: aItem.attributeValueDesc, //filterArea(areas),
            belong: belongs.attributeValueDesc
          })
        }
        //富文本
        let articleArray = [];
        data.detailInfoList.forEach(item => {
          articleArray.push({
            title: item.tagName,
            content: item.text
          })
        })
        this.setData({
          articleTitleArray: articleArray
        })
        let that = this
        for (let i = 0; i < articleArray.length; i++) {
          WxParse.wxParse('article' + i, 'html', articleArray[i].content, that);
          if (i === articleArray.length - 1) {
            WxParse.wxParseTemArray("articleArray", 'article', articleArray.length, that);
          }
        }
        console.log(this.data.articleArray, 'articleArray')
        // 弹框内容
        let dialogImgList = data.baseInfo.imageList.filter(item => item.isDefault == true)
        let imgList = []
        dialogImgList.forEach((item, index) => {
          imgList[index] = Object.assign(item, {
            urlType: item.imageUrl.substr(item.imageUrl.lastIndexOf('.') + 1)
          })
        })
        //是否为单层属性
        let flag = data.tradeInfo.skuList.some(item => item.skuIndex.indexOf('_') > -1)
        this.setData({
          baseInfo: data.baseInfo,
          dialogImgList: imgList,
          transactionList: data.tradeInfo.skuList,
          activeKey: data.tradeInfo.skuList[0].skuIndex,
          flag
        });
        let skuIndexs = this.data.transactionList.map(x => {
          return x.skuIndex
        });
        this.setData({
          skuIndexArr: skuIndexs
        });
        //去除没有搭配的属性
        let filterattributeList = data.tradeInfo.dynamicAttributeList.map(item => ({
          key: Object.keys(item)[0],
          value: Object.values(item)[0]
        }))
        let recordArr = []
        let doublerecordArr = []
        data.tradeInfo.skuList.forEach(element => {
          if (element.skuIndex.length == 1) {
            recordArr.push(Number(element.skuIndex))
          } else {
            recordArr.push(Number(element.skuIndex.substr(0, 1)))
            doublerecordArr.push(Number(element.skuIndex.substr(2)))
          }
        })
        // Array.from(filterattributeList)[0].value = Array.from(filterattributeList)[0].value.filter((item,index)=>Array.from(new Set(recordArr)).includes(index))
        let difference = Array.from(filterattributeList)[0].value.filter((item, index) => !new Set(recordArr).has(index));
        this.setData({
          noPriceIndex: difference
        })
        // if(flag){
        //     Array.from(filterattributeList)[1].value = Array.from(filterattributeList)[1].value.filter((item,index)=>Array.from(new Set(doublerecordArr)).includes(index))
        // }
        this.setData({
          attributeList: filterattributeList
        })
        this.handlechoiceAttribute()
        this.handleattributeText()
        if (data.baseInfo.categoryId == 1) {
          let para = this.fixFiler()
          this.getHotList(data.baseInfo.categoryId, para, spuId)
        } else {
          this.getHotList(data.baseInfo.categoryId, [], spuId)
        }
      }
    })
  },
  // 传参修改
  fixFiler() {
    let list = []
    this.data.baseInfo.generateAttributeList.forEach(item => {
      list.push({
        attributeId: item.attributeId,
        attributeValueList: [item.attributeValue]
      })
    })
    return list
  },
  // 总价计算
  totalFix() {
    let optionList = this.data.projectInfo.policyGovfeeTypeList
    let count = this.data.productCount // 选择的产品数量
    let earnestMoney = this.data.projectInfo.earnestMoney // earnestMoney 定金
    if (optionList.length == 0) {
      return count * (Number(earnestMoney))
    } else {
      let index = this.data.agencyFeeType // 官费代缴选择下标
      let governmentFee = optionList[index].typeFee // governmentFee 此处仅表示官费代缴费用
      return count * (Number(earnestMoney) + Number(governmentFee))
    }
  },
  showPriceDialog() {
    if (!this.data.showDialog) return this.setData({
      showDialog: true
    })
    this.toSubmit()
  },
  toSubmit() {
    if (this.data.noSetPrice) return;
    let choiceAttribute = this.data.choiceAttribute;
    let params = {
      pageFrom: 1, // 1 代表从产品页面进
      contractScope: this.data.baseInfo.contractScope,
      id: this.data.spuId, // 产品id
      attributeText: this.data.attributeText,
      goodsId: this.data.goodsId, //商品id
      categoryId: this.data.baseInfo.categoryId, //产品类型
      type: this.data.proType,
      number: this.data.baseInfo.spuCode, // 产品number
      choiceAttribute: choiceAttribute,
      coverUrlInfo: this.data.dialogImgList[0] ? this.data.dialogImgList[0].imageUrl : null, // 封面对象
      productName: this.data.baseInfo.spuTitle, // 产品名称
      productCount: this.data.productNum, // 选择的产品数量
      tailstatusPayFlag: false // 是否支付尾款
    }
    console.log(params, '---------');
    let data = JSON.stringify(params)
    wx.navigateTo({
      url: `/order/pages/submitOrder/projectOrder/projectOrder?data=${data}`,
    })
  },
  //切换规格
  handleClick(event) {
    let parentIndex = event.currentTarget.dataset.parentindex
    let childIndex = event.currentTarget.dataset.childindex
    if (parentIndex == 0) {
      if (this.data.flag) {
        let activeKey = childIndex + '_' + this.data.activeKey.substr(2)
        this.setData({
          activeKey
        })
      } else {
        this.setData({
          activeKey: String(childIndex)
        })
      }
    } else {
      let activeKey = this.data.activeKey.substr(0, 1) + '_' + childIndex
      this.setData({
        activeKey
      })
    }
    this.handlechoiceAttribute()
    this.handleattributeText()
  },
  //数量选择
  checkNum(event) {
    let type = event.currentTarget.dataset.index
    if (type == '1') {
      if (this.data.productNum == 99) {
        return
      }
      this.setData({
        productNum: ++this.data.productNum
      })
    } else {
      if (this.data.productNum == 1) {
        return
      }
      this.setData({
        productNum: --this.data.productNum
      })
    }
  },
  handlechoiceAttribute() {
    if (!this.data.skuIndexArr.includes(this.data.activeKey)) {
      this.setData({
        noSetPrice: true,
      })
      return app.toastBox('该类型尚未设置价格', 'error', 1000)
    }
    this.setData({
      noSetPrice: false,
    });
    console.log(this.data.activeKey);
    console.log(this.data.transactionList, 'pppppppppp');
    if (this.data.activeKey && this.data.transactionList.length > 0) {
      if (this.data.transactionList.filter(item => item.skuIndex == this.data.activeKey).length) {
        let choiceAttribute = this.data.transactionList.filter(item => item.skuIndex == this.data.activeKey)[0].skuPayTypeList
        let goodsId = this.data.transactionList.filter(item => item.skuIndex == this.data.activeKey)[0].id
        this.setData({
          choiceAttribute: choiceAttribute,
          goodsId: goodsId
        })
      } else {
        this.setData({
          choiceAttribute: {
            noAttritube: true
          }
        })
      }

    } else {
      this.setData({
        choiceAttribute: {}
      })
    }
  },
  handleattributeText() {
    if (this.data.activeKey) {
      if (this.data.activeKey.length == 1) {
        let attributeText = this.data.attributeList[0].value[Number(this.data.activeKey)]
        this.setData({
          attributeText
        })
      } else {
        let attributeText = this.data.attributeList[0].value[Number(this.data.activeKey.substr(0, 1))] + ',' + this.data.attributeList[1].value[Number(this.data.activeKey.substr(2, 3))]
        this.setData({
          attributeText
        })
      }
    } else {
      this.setData({
        attributeText: null
      })
    }
  },
  //是否收藏  
  judgeCollectStatus() {
    isCollected({
      userId: wx.getStorageSync('accountId'),
      spuId: this.data.spuId
    }).then(res => {
      if (res.code == 0) {
        this.setData({
          collectStatus: res.data
        })
      }
    })
  },
  //收藏
  handleCollect() {
    let type = this.data.collectStatus
    if (wx.getStorageSync('accountId')) {
      if (type == false) {
        addcollect({
          spuId: this.data.spuId,
          userId: wx.getStorageSync('accountId'),
          collectSource: 3
        }).then(res => {
          if (res.code == 0) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 2000
            })
            this.judgeCollectStatus()
          }
        })
      } else {
        cancelcollect({
          spuIds: [this.data.spuId],
          userId: wx.getStorageSync('accountId')
        }).then(res => {
          if (res.code == 0) {
            wx.showToast({
              title: '取消收藏成功',
              icon: 'success',
              duration: 2000
            })
            this.judgeCollectStatus()
          }
        })
      }
    } else {

    }
  },
  handleDialog() {
    if (this.data.showDialog == false) {
      this.setData({
        showDialog: true
      })
    } else {
      this.setData({
        showDialog: false
      })
    }
  },
  //监听页面滑动
  onPageScroll(e) {
    let that = this
    wx.createSelectorQuery().select('#productBox').boundingClientRect(function (rect) {
      if (rect.top <= 70) {
        that.setData({
          showTabStatus: true
        })
      } else {
        that.setData({
          showTabStatus: false
        })
      }
    }).exec()
  },
  // 添加浏览量
  addViews() {
    let params = {
      id: this.data.spuId,
      type: this.data.proType
    }
    addPageViews(params).then(res => {})
  },
  setProData(options) {
    console.log(options, 'ssssssssssssssssssss');
    if (options.id) {
      this.setData({
        spuId: options.id,
        proType: options.type
      })
    } else {
      if (wx.getStorageSync('spuInfo')) {
        let spuInfo = wx.getStorageSync('spuInfo');
        this.setData({
          spuId: spuInfo.spuId,
          proType: spuInfo.spuType,
        })
      }
    }
  },
  // 获取热点列表
  getHotList(categoryId, list, id) {
    let params = {
      pageNo: 1,
      pageSize: 8,
      categoryId: categoryId,
      generateAttributeList: list,
      id: Number(this.data.spuId),
    }
    let url = categoryId == 1 ? pageWeightSpu : pageInfo
    url(params).then(res => {
      if (res.code == 0) {
        this.setData({
          hotList: res.data.records,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setProData(options)
  },
  // 检查登录状态
  checkLoginStatus() {
    if (wx.getStorageSync('userInfo')) {
      // this.addViews()
      if (!wx.getStorageSync('area')) {
        wx.showLoading({
          title: '加载中',
        })
        allFactor(4).then(res => {
          if (res.code == 0) {
            wx.hideLoading()
            wx.setStorageSync('area', res.data.area);
            this.getDetail(this.data.spuId)
          }
        })
      } else {
        this.getDetail(this.data.spuId)
      }
    } else {
      this.getDetail(this.data.spuId)
      wx.navigateTo({
        url: "/personal/pages/wxLogin/wxLogin"
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(this.data.spuId);
    if (wx.getStorageSync('accountId')) {
      this.judgeCollectStatus()
    }
    this.checkLoginStatus()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
})