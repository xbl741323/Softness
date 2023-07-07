// product/pages/detail/detail.js
const app = getApp();
var WxParse = require('../wxParse/wxParse.js');
import {
  getTradeInfo,
  getDetail,
  getDetailInfo
} from "../../../utils/api/product.js"
import {
  filterArea
} from "../../../utils/common/cacheDatas.js"
import {
  getWxInviteCode
} from "../../../utils/api/wtClass"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoControl: false,
    spuId: '',
    goodsId: '',
    proType: '',
    navBarIndex: 0, // 导航头下标
    showTabStatus: false, // 控制导航头显示
    imageUrl: app.globalData.imageURL,
    articleTitleArray: [],
    articleArray: [], //富文本
    coverUrls: [], //轮播图
    iconList: [{
      name: "全程监督",
      url: "/product/image/quanchengjiandu_icon@2x.png"
    }, {
      name: "保障权益",
      url: "/product/image/baozhangquanyi_icon@2x.png"
    }, {
      name: "十年行业经验",
      url: "/product/image/shinianjingyan_icon@2x.png"
    }],
    baseInfo: {},
    tradeInfo: {},
    detailInfoList: {},
    attributeList: [], //属性规格
    transactionList: [], //后台配置可交易选项
    activeKey: null, // 默认选中规格
    flag: null, //是否为单层属性
    productNum: 1, //数量
    collectStatus: false,
    dialogImgList: [], //弹框里面内容
    choiceAttribute: {}, // 选中的规格（动态）
    attributeText: "", // 选中的文案（动态）
    showDialog: false,
    areas: '',
    guikou: '',
    noPriceIndex: [],
    skuIndexArr: [],
    noSetPrice: false,
    wxCode: "",
    coverImg: ""
  },
  // 获取微信邀请码
  getWxInviteCode() {
    getWxInviteCode().then(res => {
      this.setData({
        wxCode: res.data
      })
    })
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
    wx.showLoading({
      title: '加载中',
    })
    getDetail({
      spuId: spuId
    }).then(res => {
      if (res.code == 0) {
        this.setData({
          baseInfo: res.data
        })
        let data = res.data
        //轮播图
        if (data.imageList && data.imageList.length) {
          let urlList = []
          let arr = []
          data.imageList.forEach((item, index) => {
            urlList[index] = Object.assign(item, {
              urlType: item.imageUrl.substr(item.imageUrl.lastIndexOf('.') + 1)
            })
            console.log(urlList)
            urlList.forEach(item => {
              if (item.urlType == 'jpg' || 'png' || 'jpeg') {
                arr.push(item.imageUrl)
              }
            })
            console.log(arr[0])
            this.setData({
              coverImg: arr[0]
            })
          })
          this.setData({
            coverUrls: urlList,
          })
        }
        if (this.data.proType == 0) {
          let arr1 = data.generateAttributeList.filter(item => {
            return item.attributeId == 1
          })
          let areaResult = arr1.length > 0 ? filterArea(arr1[0].attributeValueDesc) : ''
          let arr2 = data.generateAttributeList.filter(item => {
            return item.attributeId == 2
          })
          let guikouResult = arr2.length > 0 ? arr2[0].attributeValueDesc : ''
          this.setData({
            areas: areaResult,
            guikou: guikouResult
          })
        }
        this.getDetailInfo(spuId)
        wx.hideLoading({
          success: (res) => {}
        })
      }
    })
  },
  // 获取详情信息
  getDetailInfo(spuId) {
    getDetailInfo({
      spuId: spuId
    }).then(res => {
      this.setData({
        detailInfoList: res.data
      })
      this.getTradeInfo(spuId)
    })
  },
  // 获取产品交易信息
  getTradeInfo(spuId) {
    getTradeInfo({
      spuId: spuId
    }).then(res => {
      let data = res.data
      //富文本
      let articleArray = [];
      this.data.detailInfoList.forEach(item => {
        articleArray.push({
          title: item.tagName,
          content: item.text
        })
      })
      let reg = /[\u4e00-\u9fa5]/g
      articleArray.forEach(item => {
        if (Object.values(item)[0] == '产品参数' || Object.values(item)[0] == '服务介绍') {
          let text = Object.values(item)[1]
          let texts = text.match(reg).join("")
          item.content = "<view style='letter-spacing:4rpx;text-indent:70rpx;font-family:simsun,serif;line-height:55rpx'>" + texts + "</view>"
        }
      })

      this.setData({
        articleTitleArray: articleArray,
        tradeInfo: data
      })
      let that = this
      for (let i = 0; i < articleArray.length; i++) {
        WxParse.wxParse('article' + i, 'html', articleArray[i].content, that);
        if (i === articleArray.length - 1) {
          WxParse.wxParseTemArray("articleArray", 'article', articleArray.length, that);
        }
      }
      // 弹框内容
      let dialogImgList = that.data.baseInfo.imageList.filter(item => item.isDefault == true)
      let imgList = []
      dialogImgList.forEach((item, index) => {
        imgList[index] = Object.assign(item, {
          urlType: item.imageUrl.substr(item.imageUrl.lastIndexOf('.') + 1)
        })
      })
      //是否为单层属性
      let flag = data.skuList.some(item => item.skuIndex.indexOf('_') > -1)
      this.setData({
        dialogImgList: imgList,
        transactionList: data.skuList,
        activeKey: data.skuList[0].skuIndex,
        flag
      });
      let skuIndexs = this.data.transactionList.map(x => {
        return x.skuIndex
      });
      this.setData({
        skuIndexArr: skuIndexs
      });
      //去除没有搭配的属性
      let filterattributeList = data.dynamicAttributeList.map(item => ({
        key: Object.keys(item)[0],
        value: Object.values(item)[0]
      }))
      let recordArr = []
      let doublerecordArr = []
      data.skuList.forEach(element => {
        if (element.skuIndex.length == 1) {
          recordArr.push(Number(element.skuIndex))
        } else {
          recordArr.push(Number(element.skuIndex.substr(0, 1)))
          doublerecordArr.push(Number(element.skuIndex.substr(2)))
        }
      })
      // 删除没有配置的规格
      // Array.from(filterattributeList)[0].value = Array.from(filterattributeList)[0].value.filter((item,index)=>Array.from(new Set(recordArr)).includes(index))
      let difference = Array.from(filterattributeList)[0].value.filter((item, index) => !new Set(recordArr).has(index));
      this.setData({
        noPriceIndex: difference
      })
      if (flag) {
        Array.from(filterattributeList)[1].value = Array.from(filterattributeList)[1].value.filter((item, index) => Array.from(new Set(doublerecordArr)).includes(index))
      }
      this.setData({
        attributeList: filterattributeList
      })
      this.handlechoiceAttribute()
      this.handleattributeText()
    })
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
    if (this.data.activeKey && this.data.transactionList.length > 0) {
      if (this.data.transactionList.filter(item => item.skuIndex == this.data.activeKey).length) {
        let choiceAttribute = this.data.transactionList.filter(item => item.skuIndex == this.data.activeKey)[0].skuPayTypeList
        let goodsId = this.data.transactionList.filter(item => item.skuIndex == this.data.activeKey)[0].id
        this.setData({
          choiceAttribute
        })
        this.setData({
          goodsId
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
  // 跳转推广页面
  toExtend() {
    let id = this.data.spuId
    let type = this.data.proType
    let code = this.data.wxCode
    let coverImg = this.data.coverImg
    console.log(coverImg)
    let wxCodeUrl = `/product/pages/extend/extend?id=${id}&type=${type}&code=${code}&coverImg=${coverImg}`
    wx.navigateTo({
      url: wxCodeUrl
    })
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
  addViews(options) {
    let params = {
      id: options.id,
      type: options.type
    }
    // addPageViews(params).then(res => {})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options) {
      this.setData({
        spuId: options.id,
        proType: options.type
      })
    }
    this.getDetail(options.id)
    this.getWxInviteCode()
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

  /**
   * 用户点击右上角分享
   */

})