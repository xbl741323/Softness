// pages/square.js
const app = getApp();
const year = new Date().getFullYear()
import {
  getSVideoList,
  getClassList,
  getPlateList,
  getPlateRelateClass
} from "../../utils/api/wtClass"
import {
  getDistrict,
  esPagePolicy,
  getSelection,
  esPageIndustry
} from "../../utils/api/search"
import {
  getQuestionList
} from "../../utils/api/questionAnswer"
import {
  fileList
} from "../../utils/api/file"
import {
  getAreaNo,
} from "../../utils/api"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topNavs: [{
      title: '资讯广场',
      index: 0
    }, {
      title: '卧涛课堂',
      index: 1
    }],
    noData: false,
    checkIndex: 0,
    isLogin: false,
    imageUrl: app.globalData.imageURL,
    temUrl: "https://static-tst.wotao.com/icon/head/9ded28f1ded944519df7fa73d4f85823.png",
    swiperList: [{
      imgUrl: '/image/classRoom/pic_banner@2x.png'
    }],
    shortList: [],
    freeList: [], // 完全免费
    vipFreeList: [], // vip免费
    soloFeeList: [], // 单独收费
    courseList: [],
    plateId: '',
    classifyList: [],
    list: [{
      title: '通知公告',
      index: 0
    }, {
      title: '行业资讯',
      index: 1
    }, {
      title: '卧涛问答',
      index: 2
    }, {
      title: '卧涛文档',
      index: 3
    }],
    listIndex: 0,
    areaDialog: false,
    areaValue: [],
    areaValueFile: [],
    region: [],
    province: wx.getStorageSync('province'),
    provinceId: wx.getStorageSync('provinceId'),
    keyword: '',
    reachStatus: false, // 是否触底加载更多数据
    noticeTotal: 0, // 用于上拉加载显示判断
    industryTotal: 0, // 用于上拉加载显示判断
    questionTotal: 0,
    fileTotal: 0,
    page: 1,
    pageSize: 20,
    policyList: [],
    industryInfoList: [],
    questionList: [],
    fileList: [],
    filterList: [{
      id: 1,
      name: '地区',
      attr: true,
      otherName: '地区'
    }, {
      id: 2,
      name: '级别',
      attr: true,
      otherName: '级别'
    }, {
      id: 3,
      name: '归口',
      attr: true,
      otherName: '归口'
    }, {
      id: 4,
      name: '申报时间',
      attr: true,
      otherName: '申报时间'
    }, {
      id: 5,
      name: '服务分类',
      attr: false,
      otherName: '服务分类'
    }, {
      id: 6,
      name: '发布时间',
      attr: true,
      otherName: '发布时间'
    }],
    viewList: [],
    questionFilterList: [],
    fileFilterList: [],
    openFilter: false,
    showIndex: "",
    active: 0,
    type: 0,
    rankData: [],
    levelData: [{
        no: 0,
        name: '全部'
      },
      {
        no: 1,
        name: '国家级'
      },
      {
        no: 2,
        name: '省级'
      },
      {
        no: 3,
        name: '市级'
      },
      {
        no: 4,
        name: '区级'
      },
    ], //级别数据
    putUnderData: [], //归口数据
    year: new Date().getFullYear(),
    monthData: [{
        no: 0,
        name: '全部'
      },
      {
        no: 1,
        name: year + '.1'
      },
      {
        no: 2,
        name: year + '.2'
      },
      {
        no: 3,
        name: year + '.3'
      },
      {
        no: 4,
        name: year + '.4'
      },
      {
        no: 5,
        name: year + '.5'
      },
      {
        no: 6,
        name: year + '.6'
      },
      {
        no: 7,
        name: year + '.7'
      },
      {
        no: 8,
        name: year + '.8'
      },
      {
        no: 9,
        name: year + '.9'
      },
      {
        no: 10,
        name: year + '.10'
      },
      {
        no: 11,
        name: year + '.11'
      },
      {
        no: 12,
        name: year + '.12'
      },
    ], //申报时间数据
    classData: [{
        no: 0,
        name: '全部'
      },
      {
        no: 1,
        name: '项目申报'
      },
      {
        no: 2,
        name: '知识产权'
      },
      {
        no: 7,
        name: '工商财税'
      },
      {
        no: 9,
        name: '融资上市'
      },
      {
        no: 10,
        name: '法律服务'
      },
      {
        no: 11,
        name: '软件开发'
      },
    ], //服务分类数据
    sortData: [{
        no: 0,
        name: '发布时间'
      },
      {
        no: 1,
        name: '综合排序'
      },
    ], //排序数据
    areaNo: "", //地区
    level: 0, //级别
    putunder: 0, //归口
    month: 0, //申报时间
    class: 0, //服务分类
    sort: 0, //综合排序
    chooseId: null,
    viewName: "通知公告"
  },
  // 类型切换
  changeChildIndex(e) {
    let filterList = this.data.filterList
    let index = e.currentTarget.dataset.index
    let list = JSON.parse(JSON.stringify(filterList))
    list.forEach(item => {
      item.attr = index == 0 ? (item.id == 5 ? false : true) : index == 1 ? (item.id > 4 ? true : false) : (item.id > 5 ? true : false)
    })
    list[5].name = "发布时间"
    if (index == 0) {
      this.setData({
        sort: 0,
        class: 0,
        keyword: '',
        page: 1,
        industryInfoList: []
      })
    } else if (index == 1) {
      this.setData({
        areaNo: wx.getStorageSync('provinceId'),
        sort: 0,
        level: 0,
        putunder: 0,
        month: 0,
        keyword: '',
        page: 1,
        policyList: []
      })
    } else if (index == 2) {
      this.setData({
        areaNo: wx.getStorageSync('provinceId'),
        sort: 0,
        level: 0,
        putunder: 0,
        month: 0,
        keyword: '',
        page: 1,
        questionList: []
      })
    } else if (index == 3) {
      this.setData({
        areaNo: wx.getStorageSync('provinceId'),
        sort: 0,
        level: 0,
        putunder: 0,
        month: 0,
        keyword: '',
        page: 1,
        fileList: []
      })
    }
    this.setData({
      listIndex: index,
      viewList: list,
      questionFilterList: list,
      fileFilterList: list,
      viewName: index == 0 ? '通知公告' : index == 1 ? '行业资讯' : index == 2 ? '卧涛问答' : '卧涛文档',
      openFilter: false,
    });
    app.toTop()
    this.getAllList()
  },
  // 类型切换
  changeIndex(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      checkIndex: index,
    });
    app.toTop()
  },
  // 修改tabbar index
  changeTabbar() {
    let islogin = wx.getStorageSync('userInfo') ? true : false
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3,
        isLogin: islogin
      })
    }
  },
  // 获取短视频列表
  getShortList() {
    let params = {
      pageSize: 10,
      pageNo: 1
    }
    getSVideoList(params).then(res => {
      if (res.code == 0) {
        this.setData({
          shortList: res.data.records
        })
      }
    })
  },
  // 获取课程列表
  getClassData(type) {
    let params = {
      pageSize: type == 1 ? 4 : type == 2 ? 3 : 6,
      pageNo: 1,
      baseShowState: 1,
      getTrySeeSectionNumber: true,
      tradingChargeType: type, // 1-完全免费 2-vip免费 3-单独收费
    }
    getClassList(params).then(res => {
      if (res.data.code == 0) {
        let list = res.data.data.records
        this.filterClassData(type, list)
      }
    })
  },
  // 针对不同类型课程列表复制
  filterClassData(type, list) {
    let classObj = type == 1 ? { // 1-完全免费
      freeList: list
    } : type == 2 ? { // 2-vip免费
      vipFreeList: list
    } : type == 3 ? { // 3-单独收费
      soloFeeList: list
    } : ""
    this.setData(classObj)
  },
  // 获取板块列表数据
  getPlateData() {
    getPlateList().then(res => {
      if (res.code == 0 && res.data.length > 0) {
        let plateId = this.data.plateId
        this.setData({
          classifyList: res.data,
          plateId: plateId != '' ? plateId : res.data[0].id // 初始化板块tab值
        })
        this.getPlateRelateData()
      }
    })
  },
  // 新产品类型选择
  changeNew(e) {
    let plateId = e.currentTarget.dataset.id
    this.setData({
      plateId: plateId
    })
    this.getPlateRelateData()
  },
  // 获取板块关联课程列表数据
  getPlateRelateData() {
    let plateId = this.data.plateId
    let params = {
      pageSize: 1000,
      pageNo: 1,
      baseShowState: 1,
      tradingChargeType: 2,
      plateId: plateId,
      getTrySeeSectionNumber: true,
    }
    getPlateRelateClass(params).then(res => {
      if (res.code == 0) {
        this.setData({
          courseList: res.data.records
        })
      }
    })
  },
  // 跳转课程详情
  toCourseDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/classRoom/pages/detail/course/course?id=${id}`,
    })
  },
  // 跳转短视频详情
  toShortDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/classRoom/pages/detail/shortVideo/shortVideo?id=${id}`,
    })
  },
  // 校验登录
  checkLoginStatus() {
    if (!wx.getStorageSync('userInfo')) {
      this.setData({
        isLogin: false
      })
      wx.navigateTo({
        url: "/personal/pages/wxLogin/wxLogin"
      })
    } else {
      this.getShortList()
      this.getClassData(1)
      this.getClassData(2)
      this.getClassData(3)
      // 获取板块-及关联课程数据
      this.getPlateData()
      this.setData({
        isLogin: true
      })
    }
  },
  // 跳转到vip会员
  toVip() {
    wx.navigateTo({
      url: '/personal/pages/class/member'
    })
  },
  // 跳转到地区选择页
  skipToArea() {
    this.setData({
      openFilter: false,
      areaDialog: true
    })
  },
  // 获取子组件传值
  getCityName(e) {
    if (e.detail != '') {
      this.setData({
        province: e.detail,
        areaDialog: false
      })
    } else {
      this.setData({
        areaDialog: false
      })
    }
  },
  // 获取关键字
  getKeyword(e) {
    this.setData({
      keyword: e.detail.value.trim(),
    })
  },
  getKeywords(e) {
    let filterList = this.data.filterList
    let viewList = this.data.viewList
    let questionFilterList = this.data.questionFilterList
    let fileFilterList = this.data.fileFilterList
    this.setData({
      keyword: e.detail.value.trim(),
      page: 1,
      policyList: [],
      industryInfoList: [],
      questionList: [],
      fileList: [],
    })
    if (this.data.listIndex == 0 && e.detail.value.trim() != '') {
      filterList[5].name = '综合排序'
      this.setData({
        sort: 1,
        filterList: filterList
      })
    } else if (this.data.listIndex == 1 && e.detail.value.trim() != '') {
      viewList[5].name = '综合排序'
      this.setData({
        sort: 1,
        viewList: viewList
      })
    } else if (this.data.listIndex == 2 && e.detail.value.trim() != '') {
      questionFilterList[5].name = '综合排序'
      this.setData({
        sort: 1,
        questionFilterList: questionFilterList
      })
    } else if (this.data.listIndex == 3 && e.detail.value.trim() != '') {
      fileFilterList[5].name = '综合排序'
      this.setData({
        sort: 1,
        fileFilterList: fileFilterList
      })
    }
    this.getAllList()
  },
  search() {
    let filterList = this.data.filterList
    let viewList = this.data.viewList
    let questionFilterList = this.data.questionFilterList
    let fileFilterList = this.data.fileFilterList
    this.setData({
      page: 1,
      policyList: [],
      industryInfoList: [],
      questionList: [],
      fileList: []
    })
    if (this.data.listIndex == 0 && this.data.keyword != '') {
      filterList[5].name = '综合排序'
      this.setData({
        sort: 1,
        filterList: filterList
      })
    } else if (this.data.listIndex == 1 && this.data.keyword != '') {
      viewList[5].name = '综合排序'
      this.setData({
        sort: 1,
        viewList: viewList
      })
    } else if (this.data.listIndex == 2 && this.data.keyword != '') {
      questionFilterList[5].name = '综合排序'
      this.setData({
        sort: 1,
        questionFilterList: questionFilterList
      })
    } else if (this.data.listIndex == 3 && this.data.keyword != '') {
      fileFilterList[5].name = '综合排序'
      this.setData({
        sort: 1,
        fileFilterList: fileFilterList
      })
    }
    this.getAllList()
  },
  // 获取通知公告列表
  getPolicyList() {
    if (this.data.page == 1) {
      this.setData({
        policyList: []
      })
    }
    let params = {
      keywords: this.data.keyword,
      areaNo: this.data.areaNo,
      level: this.data.level == 0 ? '全部' : this.data.level,
      month: this.data.month,
      optionId: this.data.putunder == 0 ? null : this.data.putunder,
      pageNo: this.data.page,
      pageSize: this.data.pageSize,
      sort: this.data.sort == 0 ? 'latest' : 'hottest',
      type: 0
    }
    esPagePolicy(params).then(res => {
      if (res.code == 0) {
        let reachStatus = this.data.reachStatus
        let policyList = this.data.policyList
        let result = res.data.data.policyList ? res.data.data.policyList : []
        result.map(item => {
          item.create_time = item.create_time.slice(0, 10)
          item.applyName = item.applyType == 1 ? '未开始' : item.applyType == 2 ? '申报中' : item.applyType == 3 ? '已结束' : ''
        })
        this.setData({
          policyList: reachStatus == true ? policyList.concat(result) : result,
          reachStatus: false,
          noticeTotal: res.data.data.total,
          noData: res.data.data.total == 0 ? true : false
        })
      } else {
        this.setData({
          noData: true
        })
      }
    })
  },
  // 获取资讯列表
  getIndustryList() {
    if (this.data.page == 1) {
      this.setData({
        industryInfoList: []
      })
    }
    let params = {
      keywords: this.data.keyword,
      categoryId: this.data.class == 0 ? null : this.data.class,
      pageNo: this.data.page,
      pageSize: this.data.pageSize,
      sort: this.data.sort == 0 ? 'latest' : 'hottest',
    }
    esPageIndustry(params).then(res => {
      if (res.code == 0) {
        let reachStatus = this.data.reachStatus
        let industryInfoList = this.data.industryInfoList
        let result = res.data.industryInfoList.length > 0 ? res.data.industryInfoList : []
        result.map(item => {
          item.create_time = item.create_time.slice(0, 10)
        })
        this.setData({
          industryInfoList: reachStatus == true ? industryInfoList.concat(result) : result,
          reachStatus: false,
          industryTotal: res.data.total,
          noData: res.data.total == 0 ? true : false
        })
      } else {
        this.setData({
          noData: true
        })
      }
    })
  },

  //获取卧涛问答列表
  getQuestionList() {
    if (this.data.page == 1) {
      this.setData({
        questionList: []
      })
    }
    let params = {
      keyWord: this.data.keyword,
      pageNo: this.data.page,
      pageSize: this.data.pageSize,
      sortField: this.data.sort == 0 ? 'Time' : 'Other',
    }
    getQuestionList(params).then(res => {
      if (res.code == 0) {
        let reachStatus = this.data.reachStatus
        let questionList = this.data.questionList
        let result = res.data.records ? res.data.records : []
        result.map(item => {
          item.createTime = item.createTime.slice(0, 10)
        })
        this.setData({
          questionList: reachStatus == true ? questionList.concat(result) : result,
          reachStatus: false,
          questionTotal: res.data.total,
          noData: res.data.total == 0 ? true : false
        })
      } else {
        this.setData({
          noData: true
        })
      }
    })
  },
  getFileList() {
    if (this.data.page == 1) {
      this.setData({
        fileList: []
      })
    }
    let params = {
      pageNo: this.data.page,
      pageSize: this.data.pageSize,
      keywords: this.data.keyword,
      // areaNo: this.data.areaNo,
      level: '全部',
      sort: this.data.sort == 0 ? 'latest' : 'hottest',
    }
    fileList(params).then(res => {
      if (res.code == 0) {
        let reachStatus = this.data.reachStatus
        let fileList = this.data.fileList
        let result = res.data.data.fileList ? res.data.data.fileList : []
        this.setData({
          fileList: reachStatus == true ? fileList.concat(result) : result,
          reachStatus: false,
          fileTotal: res.data.data.total,
          noData: res.data.total == 0 ? true : false
        })
      }
    })
  },
  // 跳转资讯详情
  toPolicyDetail(e) {
    let sort = this.data.sort == 0 ? 'latest' : 'hottest'
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: this.data.listIndex == 0 ? `/classRoom/pages/detail/info/info?number=${item.number}&id=${item.id}&sort=${sort}&index=${this.data.listIndex}` : `/classRoom/pages/detail/info/info?number=${item.industry_no}&id=${item.id}&sort=${sort}&index=${this.data.listIndex}`,
    })
  },
  // 跳转卧涛问答详情
  toQuestionDetail(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/personal/pages/questionsAnswer/questionDetail/questionsDetail?questionId=${item.id}`,
    })
  },

  // 跳转卧涛文档详情
  toFileDetail(e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/personal/pages/wtFile/fileDetail/fileDetail?fileId=${item.id}`,
    })
  },
  updateAreaNo(e) {
    // 切换地址后，地区筛选条件重置
    let filterList = this.data.filterList;
    filterList[0].name = filterList[0].otherName;
    this.setData({
      areaNo: e.detail,
      filterList: filterList
    })
    this.getAllList()
  },
  reset() {
    let filterList = this.data.filterList
    let viewList = this.data.viewList
    let areaNo = wx.getStorageSync('provinceId')
    switch (Number(this.data.chooseId)) {
      case 1:
        this.setData({
          areaNo: areaNo
        })
        break;
      case 2:
        this.setData({
          level: 0
        })
        break;
      case 3:
        this.setData({
          putunder: 0
        })
        break;
      case 4:
        this.setData({
          month: 0
        })
        break;
      case 5:
        this.setData({
          class: 0
        })
        break;
      case 6:
        this.setData({
          sort: 0
        })
        break;
    }
    if (Number(this.data.chooseId)) {
      filterList.forEach((item, index) => {
        if (item.id == Number(this.data.chooseId)) {
          filterList[index].name = filterList[index].otherName
        }
      })
    }
    this.setData({
      filterList: filterList,
      viewList: filterList
    })
    this.getAllList()
  },
  // 切换筛选项
  changeType(e) {
    let id = e.currentTarget.dataset.id
    let region = this.data.region
    let levelData = this.data.levelData
    let putUnderData = this.data.putUnderData
    let monthData = this.data.monthData
    let classData = this.data.classData
    let sortData = this.data.sortData
    let areaList = new Array()
    region.length > 0 && region.map(item => {
      item.children.map(citem => {
        if (citem.no == wx.getStorageSync('provinceId')) {
          areaList = [citem].concat(citem.children)
        }
      })
    })
    this.setData({
      chooseId: id,
      openFilter: true,
      page: 1,
      rankData: id == 1 ? areaList : id == 2 ? levelData : id == 3 ? putUnderData : id == 4 ? monthData : id == 5 ? classData : sortData
    })
  },
  // 切换筛选字段
  toggleRank(e) {
    let id = this.data.chooseId
    let filterList = this.data.filterList
    let viewList = this.data.viewList
    let questionFilterList = this.data.questionFilterList
    let fileFilterList = this.data.fileFilterList
    let item = e.currentTarget.dataset.item
    let index = this.data.listIndex
    this.setData({
      active: item.no
    })
    switch (Number(id)) {
      case 1:
        filterList[0].name = item.name
        this.setData({
          areaNo: item.no,
        })
        break;
      case 2:
        filterList[1].name = item.name
        this.setData({
          level: item.no
        })
        break;
      case 3:
        filterList[2].name = item.name
        this.setData({
          putunder: item.no
        })
        break;
      case 4:
        filterList[3].name = item.name
        this.setData({
          month: item.no
        })
        break;
      case 5:
        filterList[4].name = item.name
        this.setData({
          class: item.no
        })
        break;
      case 6:
        if (index == 0) {
          filterList[5].name = item.name
        } else if (index == 1) {
          viewList[5].name = item.name
        } else if (index == 2) {
          questionFilterList[5].name = item.name
        } else if (index == 3) {
          fileFilterList[5].name = item.name
        }
        this.setData({
          sort: item.no
        })
        break;
    }
    if (this.data.listIndex == 0) {
      this.setData({
        filterList: filterList
      })
      this.getPolicyList()
    } else if (this.data.listIndex == 1) {
      this.setData({
        viewList: viewList
      })
      this.getIndustryList()
    } else if (this.data.listIndex == 2) {
      this.setData({
        questionFilterList: questionFilterList
      })
      this.getQuestionList()
    } else if (this.data.listIndex == 3) {
      this.setData({
        fileFilterList: fileFilterList
      })
      this.getFileList()
    }
  },
  //发起提问
  initiateQuestion() {
    wx.navigateTo({
      url: '/personal/pages/questionsAnswer/initiateQuestion/initiateQuestion',
    })
  },
  // 关闭遮罩
  closeShade() {
    this.setData({
      openFilter: false
    })
  },
  // 获取归口数据
  getSelection() {
    getSelection(2).then(res => {
      if (res.code == 0) {
        let data = res.data
        data.map(item => {
          item.no = item.id
        })
        let obj = {
          id: 0,
          name: '全部',
          no: 0
        }
        this.setData({
          putUnderData: [obj].concat(data)
        })
      }
    })
  },
  handleSearch() {
    let filterList = this.data.filterList;
    let viewList = this.data.viewList;
    let questionFilterList = this.data.questionFilterList;
    let fileFilterList = this.data.fileFilterList;
    if (this.data.keyword == '') return app.toastBox('请输入关键字！');
    if (this.data.listIndex == 0) {
      filterList[5].name = '综合排序'
    } else if (this.data.listIndex == 1) {
      viewList[5].name = '综合排序'
    } else if (this.data.listIndex == 2) {
      questionFilterList[5].name = '综合排序'
    } else if (this.data.listIndex == 3) {
      fileFilterList[5].name = '综合排序'
    }
    this.setData({
      page: 1,
      sort: 1,
      filterList: filterList,
      viewList: viewList,
      questionFilterList: questionFilterList,
      fileFilterList: fileFilterList
    })
    this.getAllList()
  },
  getAllList() {
    if (this.data.listIndex == 0) {
      this.getPolicyList()
    } else if (this.data.listIndex == 1) {
      this.getIndustryList()
    } else if (this.data.listIndex == 2) {
      this.getQuestionList()
    } else if (this.data.listIndex == 3) {
      this.getFileList()
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.changeTabbar()
    this.getSelection()
    this.checkLoginStatus()
    this.getAllList()

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      areaNo: wx.getStorageSync('provinceId')
    })
    this.setDefaultArea()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let policyList = this.data.policyList
    let industryInfoList = this.data.industryInfoList
    let questionList = this.data.questionList
    let fileList = this.data.fileList
    let noticeTotal = this.data.noticeTotal
    let industryTotal = this.data.industryTotal
    let questionTotal = this.data.questionTotal
    let fileTotal = this.data.fileTotal
    let listIndex = this.data.listIndex
    if (listIndex == 0 && policyList.length < noticeTotal) {
      this.setData({
        reachStatus: true,
        page: this.data.page + 1
      })
      this.data.listIndex == 0 && this.getPolicyList()
    }
    if (listIndex == 1 && industryInfoList.length < industryTotal) {
      this.setData({
        reachStatus: true,
        page: this.data.page + 1
      })
      this.data.listIndex == 1 && this.getIndustryList()
    }
    if (listIndex == 2 && questionList.length < questionTotal) {
      this.setData({
        reachStatus: true,
        page: this.data.page + 1
      })
      this.data.listIndex == 2 && this.getQuestionList()
    }
    if (listIndex == 3 && fileList.length < fileTotal) {
      this.setData({
        reachStatus: true,
        page: this.data.page + 1
      })
      this.data.listIndex == 3 && this.getFileList()
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
})