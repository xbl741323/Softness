// pages/product/product.js
const app = getApp();
import {
  getProType,
  getNewProduct,
  getProjectAttribute,
  getNewArea
} from "../../utils/api/product"
import {
  checkUrl
} from "../../utils/common/utils"
import * as CodeMsg from "../../utils/common/codeMsg";
Page({
  data: {
    areaList: [], // 地区数据列表
    keyWords: "", // 产品标题关键字
    // 选择的产品id（如选择的是二级分类的筛选项，显示对应二级分类id值）
    cProId: "",
    reachStatus: false, //是否触底加载更多数据
    openFilter: false, // 是否显示遮罩options
    cFilterId: 0,
    showTop: false,
    newTotal: 0, // 用于上拉加载显示判断
    page: 1,
    pageSize: 20,
    newProductList: [],
    newIndex: 0,
    province: "",
    provinceId: "",
    contentHeight: (wx.getStorageSync('windowHeight') - wx.getStorageSync('statusBarHeight') - wx.getStorageSync('navigationBarHeight') - 5) + 'px', //5:顶部高度的padding-bottom:5px
    serviceList: [], // 左侧产品栏
    classFilter: [], // 对应产品筛选类（包含二级分类+属性）
    optionList: [], // 筛选数属性显示option集合
    list: "",
    searchCode: "0", //0-项目申报（某些地方0-知识产权，真是头疼）
    projectList: [],
    propertyList: [],
    copyrightList: "",
    patentList: "",
    trademarkList: "",
    otherList: "",
    isLoading: true, //防抖开关 防止用户不停的下拉
    district: [],
    levelList: [{
      id: 1,
      categoryName: '国家级'
    },{
      id: 2,
      categoryName: '省级'
    },{
      id: 3,
      categoryName: '市级'
    },{
      id: 4,
      categoryName: '区级'
    }],
    areaIndex: [0, 0],
    areaDialog: false,
    generateAttributeList: [],
    areaNo: '',
    areaName: '',
    location: false
  },
  // 获取子组件传值
  getCityName(e){
    if(e.detail != ''){
      this.setData({
        areaNo: e.detail.areaNo!=''? wx.getStorageSync('provinceId') + ',' + e.detail.areaNo : wx.getStorageSync('provinceId'),
        areaName: e.detail.areaName
      })
      this.resetAreaFilter()
      this.getProList()
    }
    this.setData({
      page: 1,
      areaDialog: false
    })
    let areaName = this.data.areaName
    let areaNo = this.data.areaNo
    let cFilterId = this.data.cFilterId
    let newIndex = this.data.newIndex
    let serviceList = this.data.serviceList
    let classFilter = this.data.classFilter
    let classFilterItem = classFilter[cFilterId]
    let cId = serviceList[newIndex].id
    classFilter[cFilterId].selectChildId = areaNo
    classFilter[cFilterId].attributeName = areaName == '' ? '地区' : areaName
      this.setData({
        classFilter: classFilter,
        cProId: classFilterItem.isAttr == true ? cId : ''
      })
      // 获取产品类表数据
      this.getProList()
    this.closeTip()
  },
  // 清除关键词
  clearKerword() {
    this.setData({
      keyWords: "",
    })
    this.searchList()
  },
  // 产品关键字标题搜索
  changeKeywords(e) {
    this.setData({
      keyWords: e.detail.value.trim()
    })
  },
  // 跳转到全局搜索页面
  searchList() {
    this.setData({
      page: 1,
      reachStatus: false
    })
    this.getProList()
  },
  // 关闭遮罩层
  closeTip() {
    this.setData({
      openFilter: false
    })
  },
  // 新产品类型选择
  changeNew(e) {
    let item = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    if(index == 0&&item.isAttr == true){
      this.setData({
        areaDialog: true
      })
    }
    if(index==0&&item.isAttr == true){
      this.setData({
        cFilterId: index,
        openFilter: false,
        page: 1,
        optionList: item.child
      })
    }else{
      this.setData({
        cFilterId: index,
        openFilter: true,
        page: 1,
        optionList: item.child
      })
    }
    // 点击属性获取option数据 isAttr：true-是属性 false-是二级分类
    if (item.isAttr) {
      this.getProAttrData(false, item.id)
    }
  },
  // （分类+属性）option筛选赋值
  changeOption(e) {
    let item = e.currentTarget.dataset.item
    let cFilterId = this.data.cFilterId
    let newIndex = this.data.newIndex
    let serviceList = this.data.serviceList
    let classFilter = this.data.classFilter
    let classFilterItem = classFilter[cFilterId]
    let cId = serviceList[newIndex].id
    if (item == null) {
      classFilter[cFilterId].selectChildId = ''
      classFilter[cFilterId].attributeName = classFilterItem.isAttr == true ? classFilterItem.defaultName : '分类'
      this.setData({
        classFilter: classFilter,
        cProId: cId
      })
      // 获取产品类表数据
      this.getProList()
    } else {
      classFilter[cFilterId].selectChildId = item.id
      classFilter[cFilterId].attributeName = item.categoryName
      this.setData({
        classFilter: classFilter,
        cProId: classFilterItem.isAttr == true ? cId : item.id
      })
      // 获取产品类表数据
      this.getProList()
    }
    this.closeTip()
  },
  // 回到页面顶部
  toTop() {
    app.toTop()
  },
  // 跳转到地区选择页
  skipToArea() {
    wx.navigateTo({
      url: "/product/pages/area-filter/area-filter",
    })
  },
  // 左侧栏产品栏切换
  bindChange(e) {
    // 回到顶部
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    let index = e.currentTarget.dataset.index;
    let item = e.currentTarget.dataset.item;
    this.setData({
      cProId: item.id,
      newIndex: index,
      cFilterId: 0,
      openFilter: false,
      classFilter: item.child.length > 0 ? [{
        attributeName: "分类",
        isAttr: false,
        selectChildId: "", // 选择的option项Id
        child: item.child
      }] : [],
      newProductList: [],
      page: 1
    })
    this.getProList()
    this.getAttributeData([item.id])
  },
  // 获取选择的地区
  getSelectArea() {
    let provinceId = this.data.provinceId
    if (wx.getStorageSync('provinceId')) {
      if (wx.getStorageSync('provinceId') != provinceId) {
        this.resetAreaFilter()
      }
      this.setData({
        provinceId: wx.getStorageSync('provinceId')
      })
    } else {
      this.setData({
        provinceId: '340000'
      })
    }
    if (wx.getStorageSync('province')) {
      this.setData({
        province: wx.getStorageSync('province')
      })
    } else {
      this.setData({
        province: "安徽省"
      })
    }
    wx.removeStorageSync('areaFilter')
    this.getLeftClassify()
  },
  // 获取左边分类栏数据
  getLeftClassify() {
    let classFilter = this.data.classFilter
    let newIndex = this.data.newIndex
    let params = {
      parentId: 0,
    }
    getProType(params).then(res => {
      if (res.code == CodeMsg.CODE_0 && res.data.length > 0) {
        classFilter = res.data[newIndex].child.length > 0 ? [{
          defaultName: "分类",
          attributeName: "分类",
          isAttr: false,
          selectChildId: "", // 选择的option项Id
          child: res.data[newIndex].child
        }] : []
        let cId = res.data[newIndex].id
        this.setData({
          serviceList: res.data,
          classFilter: classFilter,
          cProId: cId,
          page: 1
        })
        // 获取产品列表数据
        this.getProList()
        // 获取产品筛选属性数据
        this.getAttributeData([cId])
      }
    })
  },
  // 获取筛选属性数据
  getAttributeData(categoryIds) {
    let classFilter = this.data.classFilter
    if(categoryIds==1){
      let attribute = [{
        id: 1,
        attributeName: "地区",
        categoryId: 1
      },{
        id: 3,
        attributeName: "级别",
        categoryId: 1
      },{
        id: 2,
        attributeName: "归口",
        categoryId: 1
      },]
      attribute.forEach(item => {
        item.selectChildId = ""
        item.isAttr = true
        item.defaultName = item.attributeName
      })
      this.setData({
        classFilter: classFilter.concat(attribute)
      })
    }
  },
  // 获取项目申报筛选属性数据
  getProAttrData(status, id) {
    let cityList = wx.getStorageSync('cityList')||[]
    let levelList = this.data.levelList
    getProjectAttribute().then(res => {
      if (res.code == CodeMsg.CODE_1000) {
        // 区县添加全部
        cityList.unshift({
          id: 0,
          no: '',
          name: '全部',
          parentNo: '',
          level: 2,
          children: null
        })
        if(cityList.length > 0){
          cityList.forEach(item => {
            if(item.children!=undefined&&item.children.length>0){
              item.children.unshift({
                id: 0,
                no: '',
                name: '全部',
                parentNo: '',
                level: 3
              })
            }
          })
        }
        this.setData({
          areaList: cityList
        })
        if (status) {
          // 获取重构产品列表数据总入口
          this.getLeftClassify()
        } else {
          // 获取其他筛选项option数据
          let selection = res.data.selection.filter(item => {
            return item.categoryId == 2
          })
          if (selection.length > 0) {
            selection[0].optionList.forEach(item => {
              item.categoryName = item.name
            })
          }
          if (cityList.length > 0) {
            this.setData({
              optionList: id == 1 ? cityList : (id == 3 ? levelList : selection[0].optionList)
            })
          } else {
            this.setData({
              optionList: id == 1 ? [] : (id == 3 ? levelList : selection[0].optionList)
            })
          }
        }
      }
    })
  },
  // 筛选地区
  filterArea(val) {
    let areaList = this.data.areaList
    let filterList = []
    let r = areaList.filter(item => {
      return item.value == val
    })
    if (r.length > 0) {
      r[0].children.forEach(item => {
        filterList.push(item.value)
      })
    }
    return filterList
  },
  // 获取产品列表数据
  getProList() {
    let id = this.data.cProId
    let classFilter = this.data.classFilter
    let areaNo = this.data.areaNo
    if(areaNo ==''){
      areaNo = wx.getStorageSync('provinceId')
    }
    let attribute = []
    classFilter.forEach(item => {
      if ((item.id && (item.id == 1)) || (item.id && item.id == 2 && item.selectChildId != '')) {
        attribute.push({
          attributeId: item.id,
          attributeValueList: item.selectChildId == '' ? (areaNo == '' ? [] : [areaNo]) : [item.selectChildId]
        })
      }
      if(item.id == 3 && item.selectChildId!=''){
        attribute.push({
          attributeId: item.id,
          attributeValueList: [item.selectChildId]
        })
      }
    })

    let params = {
      pageNo: this.data.page,
      pageSize: this.data.pageSize,
      categoryId: id,
      status: "1",
      spuTitle: this.data.keyWords,
      sort:'default'
    }
    if (attribute.length > 0) {
      attribute.forEach((item,index,arr)=>{
        if(item.attributeId == 3 && item.attributeValueList.toString()==1){
          arr[0].attributeValueList = arr[0].attributeId == 1 ? [] : arr[0].attributeValueList
        }
      })
      params.generateAttributeList = attribute
    }else{
      params.generateAttributeList = [{
          attributeId: 1,
          attributeValueList: this.data.provinceId!=''?[this.data.provinceId]:[wx.getStorageSync('provinceId')]
        }]
    }
    getNewProduct(params).then(res => {
      if (res.code == CodeMsg.CODE_0) {
        let result = res.data.records
        result.forEach(item => {
          item.urlInfo = checkUrl(item.imageUrl)
        })
        var list = this.data.newProductList
        if (this.data.page == 1) {
          list = []
        }
        list = [...list, ...res.data.records]
        if (list.length < res.data.total) {
          this.setData({
            page: this.data.page + 1,
            isLoading: true
          })
        } else {
          this.setData({
            isLoading: false
          })
        }
        this.setData({
          newProductList: list,
          newTotal: res.data.total
        })
        wx.setStorageSync('productInfo', list)
      }else{
        wx.showToast({
          title: res.data.msg,
        })
      }
      wx.hideLoading({
        success: (res) => {}
      })
    })
  },
  // 重置地区筛选数据
  resetAreaFilter() {
    let classFilter = this.data.classFilter
    classFilter.forEach(item => {
      if (item.id == 1) {
        item.selectChildId = ""
        item.attributeName = "地区"
      }
    })
    this.setData({
      newProductList: [],
      newTotal: 0,
      page: 1,
      classFilter: classFilter
    })
  },
  //调用微信位置经纬度转化接口
  getLocation() {
    var that = this
    wx.getLocation({
      success: function (res) {
        // 引入SDK核心类，将“wgs84”转中文
        var QQMapWX = require('../../utils/common/qqmap-wx-jssdk.min.js');
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
            let province = res.result.address_component.province
            that.getLocationId(province)
          },
          fail: function (res) {
            that.getLocationId('安徽省')
          },
        })
      },
      fail: function (res) {
        that.getLocationId('安徽省')
      },
    })
  },
  // 位置授权
  setDefaultArea() {
    let that = this
    that.setData({
      location: true
    })
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] === false) { //非初始化进入该页面,且未授权(之前授权拒绝)
          wx.showModal({
            title: '是否授权当前位置',
            content: '请确认授权，我们将为您提供更准确的服务',
            success: function (res) {
              if (res.cancel) {
                that.getLocationId('安徽省')
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
                      that.getLocationId('安徽省')
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
      fail: (res)=> {
        that.getLocationId('安徽省')
      }
    });
  },
  // 获取定位省份编码
  getLocationId(val) {
      let provinceId = ''
      getNewArea().then(res => {
        if(res.code == CodeMsg.CODE_0){
          let cityList = []
          wx.setStorageSync('district', res.data)
          res.data.forEach(item => {
            if(item.name == val){
              provinceId = item.no
              cityList = item.children
            }
          })
          this.setData({
            district: res.data,
            provinceId: provinceId,
            province: val,
            areaNo: provinceId
          })
          wx.setStorageSync('province', val)
          wx.setStorageSync('provinceId', provinceId)
          wx.setStorageSync('cityList', cityList)
        }
        this.getLeftClassify()
      })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isLoading) {
      this.setData({
        isLoading: false
      })
      this.getProList()
    }
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
  },
  // 修改tabbar index
  changeTabbar() {
    let islogin = wx.getStorageSync('userInfo') ? true : false
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
        isLogin: islogin
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取地区数据
    this.getProAttrData(true)
    if (options.type) {
      this.setData({
        newIndex: options.type,
      })
    }
    this.setDefaultArea()
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
    this.changeTabbar()
    if (wx.getStorageSync('areaFilter')) {
      this.setData({
        page: 1,
        newProductList: []
      })
      // 获取当前定位地区数据
      this.getSelectArea()
    }
    if(!this.data.location){
      this.setDefaultArea()
    }
    if(wx.getStorageSync('province')){
      this.setData({
        province: wx.getStorageSync('province'),
        provinceId: wx.getStorageSync('provinceId')
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      openFilter: false
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
})