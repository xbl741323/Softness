const app = getApp();
import {
  getNewClassify,
  getNewProduct,
  getProjectAttribute
} from "../../utils/api/product"
import {
  checkUrl
} from "../../utils/common/utils"
import {
  getDistrict
} from "../../utils/api/search"
Page({
  data: {
    areaList: [],
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
    // 选择的产品id（如选择的是二级分类的筛选项，显示对应二级分类id值）
    cProId: "",
    reachStatus: false, // 是否触底加载更多数据
    openFilter: false, // 是否显示遮罩options
    cFilterId: 0,
    showTop: false,
    newTotal: 0, // 用于上拉加载显示判断
    page: 1,
    pageSize: 20,
    newProductList: [],
    newIndex: 0,
    province: wx.getStorageSync('province'),
    provinceId: wx.getStorageSync('provinceId'),
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
    district: "",
    areaDialog: false,
    areaValue: [],
    region: []
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
    this.setData({
      cFilterId: index,
      openFilter: true,
      page: 1,
      optionList: item.child
    })
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
    let classId = classFilter[cFilterId].id
    let cId = serviceList[newIndex].id
    if (item == null) {
      classFilter[cFilterId].selectChildId = ''
      classFilter[cFilterId].attributeName = classId == 1 ? this.data.province : (classFilterItem.isAttr == true ? classFilterItem.defaultName : '分类')
      this.setData({
        classFilter: classFilter,
        cProId: cId,
      })
      // 获取产品类表数据
      this.getProList()
    } else {
      classFilter[cFilterId].selectChildId = item.id
      classFilter[cFilterId].attributeName = item.categoryName
      this.setData({
        classFilter: classFilter,
        cProId: classFilterItem.isAttr == true ? cId : item.id,
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
  // 跳转到项目申报列表
  toProject() {
    wx.navigateTo({
      url: '/search/pages/classifySearch/classifySearch',
    })
  },
  // 跳转到地区选择页
  skipToArea() {
    // wx.navigateTo({
    //   url: "/personal/pages/toggleCity/toggleCity",
    // })
    this.setData({
      areaDialog: true
    })
  },
  // 跳转到知产详情
  toPropertyDetail(e) {
    if (wx.getStorageSync('userInfo')) {
      let id = e.currentTarget.dataset.myid;
      wx.navigateTo({
        url: "/search/pages/propertyDetail/propertyDetail?propertyId=" + id
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
  // 跳转到项目详情
  toProjectDetail(e) {
    if (wx.getStorageSync('userInfo')) {
      let number = e.currentTarget.dataset.number;
      wx.navigateTo({
        url: "/search/pages/projectDetail/projectDetail?number=" + number
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
  // 跳转到全局搜索页面
  skipToGlobal() {
    if (wx.getStorageSync('userInfo')) {
      wx.navigateTo({
        url: '/search/pages/global/global',
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
  // 跳转到classifySearch页面
  toClassifySearch(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/search/pages/classifySearch/classifySearch?optionId=${id}`
    })
  },
  search(e) {
    wx.navigateTo({
      url: '/search/pages/global/global?type=' + e.currentTarget.dataset.type,
    });
  },
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
  // 获取选择的地区
  getSelectArea() {
    let provinceId = this.data.provinceId
    let province = this.data.province
    if (provinceId) {
      if (wx.getStorageSync('provinceId') != provinceId) {
        this.setData({
          provinceId: wx.getStorageSync('provinceId')
        })
        // 仅地区切换时重置地区筛选条件
        this.resetAreaFilter()
        this.getLeftClassify()
      } else {
        this.setData({
          provinceId: provinceId
        })
      }
    } else {
      this.setData({
        provinceId: provinceId
      })
    }
    if (province!=wx.getStorageSync('province')) {
      this.setData({
        province: wx.getStorageSync('province')
      })
    } else {
      this.setData({
        province: province
      })
    }
    wx.removeStorageSync('areaFilter')
  },
  // 获取左边分类栏数据
  getLeftClassify() {
    let classFilter = this.data.classFilter
    let newIndex = this.data.newIndex
    let params = {
      parentId: 0,
    }
    getNewClassify(params).then(res => {
      if (res.code == 0 && res.data.length > 0) {
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
          cProId: cId
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
        id: 2,
        attributeName: "级别",
        categoryId: 1
      },{
        id: 3,
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
    getProjectAttribute().then(res => {
      if (res.code == 0) {
        let provinceId = wx.getStorageSync('provinceId')
        let data = wx.getStorageSync('district')
        let area = []
        let levelList = this.data.levelList
        if (status) {
          this.setData({
            areaList: data
          })
          // 获取重构产品列表数据总入口
          this.getLeftClassify()
        } else {
          // 获取地区数据
          data.forEach(item => {
            if(item.children.length>0){
              item.children.map(item => {
                if(item.no == provinceId){
                  area = item
                }
              })
            }
          })
          // 获取其他筛选项option数据
          let selection = res.data.selection.filter(item => {
            return item.categoryId == 2
          })
          if (selection.length > 0) {
            selection[0].options.forEach(item => {
              item.categoryName = item.name
            })
          }
          if (area.children.length > 0) {
            area.children.forEach(item => {
              item.categoryName = item.name
              item.id = item.no
            })
            this.setData({
              optionList: id == 1 ? area.children : (id == 2 ? levelList : selection[0].options)
            })
          } else {
            this.setData({
              optionList: id == 1 ? [] : (id == 2 ? levelList : selection[0].options)
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
    var attribute = []
    classFilter.forEach(item => {
      if ((item.id && (item.id == 1)) || (item.id && (item.id == 3) && item.selectChildId != '')) {
        attribute.push({
          attributeId: item.id,
          attributeValueList: item.selectChildId == '' ? [wx.getStorageSync('provinceId')] : [item.selectChildId]
        })
      }
      if(item.id == 2){
        attribute.push({
          attributeId: item.id,
          attributeValueList: [item.selectChildId]
        })
      }
    })

    let arr = []
    if (this.data.newIndex == 0) {
      arr = attribute.length > 0 ? attribute : [{
        attributeId: 1,
        attributeValueList: [this.data.provinceId]
      }]
    }
    let params = {
      pageNo: this.data.page,
      pageSize: this.data.pageSize,
      categoryIdList: id == 2 ? [3,4,5,6] : [id],
      sort: 'lattest',
      spuArea: '',
      spuKinds: '',
      spuLevel: ''
    }
    arr.forEach(item=>{
      if(item.attributeId == 1){
        params.spuArea = item.attributeValueList.toString()
      }else if(item.attributeId == 2){
        params.spuLevel = item.attributeValueList.toString() == '' ? '全部' : Number(item.attributeValueList.toString())
      }else{
        params.spuKinds = item.attributeValueList.toString()
      }
    })
    if(params.spuLevel==''||params.spuLevel==null){
      params.spuLevel = '全部'
    }
    getNewProduct(params).then(res => {
      if (res.code == 0) {
        let reachStatus = this.data.reachStatus
        let newProductList = this.data.newProductList
        let result = res.data.records
        result.forEach(item => {
          item.urlInfo = checkUrl(item.imageUrl)
        })
        this.setData({
          newProductList: reachStatus == true ? newProductList.concat(result) : result,
          reachStatus: false,
          newTotal: res.data.total,
        })
      }
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
      classFilter: classFilter
    })
  },
  // 获取子组件传值
  getCityName(e){
    if(e.detail != ''){
      this.setData({
        province: e.detail,
        areaDialog: false
      })
      this.getProList()
      this.resetAreaFilter()
    }else{
      this.setData({
        areaDialog: false
      })
    }
  },
  // 获取地区
  getData(){
    let data = this.data.region
    let cityId = wx.getStorageSync('provinceId')
    let index1 = 0
    let index2 = 0
    let parentno = ''
    data.forEach((item) => {
      item.children.map(function(citem, cindex){
          if(citem.no == cityId){
            parentno = citem.parentNo
            index2 = cindex
          }
      })
    })
    data.map(function(item,index){
      if(item.no ==  parentno){
        index1 = index
      }
    })
    this.setData({
      areaValue: [index1, index2]
    })    
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let newProductList = this.data.newProductList
    let newTotal = this.data.newTotal
    if (newProductList.length < newTotal) {
      this.setData({
        reachStatus: true,
        page: this.data.page + 1
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
  // 校验登录
  checkLoginStatus() {
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
    } else {
      this.data.areaList.length > 0 ? '' : this.getProAttrData(true)
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
    if (options.type) {
      this.setData({
        newIndex: options.type,
      })
    }
    this.setData({
      district: wx.getStorageSync('provinceId'),
      province: wx.getStorageSync('province'),
      provinceId: wx.getStorageSync('provinceId'),
    })
    if(wx.getStorageSync('district')){
      this.setData({
        region: wx.getStorageSync('district')
      })
    }else{
      getDistrict().then(res=>{
        if(res.data.code == 0){
          let data = res.data.data
          wx.setStorageSync('district', data)
        }
      })
      this.setData({
        region: wx.getStorageSync('district')
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
    this.checkLoginStatus()
    this.changeTabbar()
    this.getData()
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
  onPullDownRefresh: function () {
  },
})