// search/pages/globalSearch/globalSearch.js
import { globalSearch, getAllCourseList, getCourseList, getVideoList, getNewProduct} from "../../../utils/api/product"
import { loadBox } from "../../../utils/common/utils";
var WxParse = require('../wxParse/wxParse');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: app.globalData.imageURL,
    keyWords: "",
    searchCount: 0,
    mask: true,
    flag: false,
    indexP: '',
    indexC: '',
    choosed: 'most',
    codeFailed: false,
    oldData: '',
    filterType1: {
      name: '综合搜索',
      type: 'comprehensiveSearch',
      index: 0
    },
    filterType2: {
      name: '地区',
      type: 'area',
      index: 1
    },
    filterType3: {
      name: '级别',
      type: 'level',
      index: 2
    },
    filterType4: {
      name: '类型',
      type: 'type',
      index: 3
    },
    filterType5: {
      name: '归口',
      type: 'putunder',
      index: 4
    },
    filterType6: {
      name: '专业分类',
      type: 'profession',
      index: 5
    },
    filterType7: {
      name: '收费类型',
      type: 'chargeType',
      index: 6
    },
    filterType8: {
      name: '综合排序',
      type: 'sort',
      index: 7
    },
    generateAttributeList: [
      {
        attributeId: 1,
        attributeValueList:[]
      }
    ],
    pageSize:10,
    pageNo:1,
    categoryId: null,
    spuTitle: null,
    provinceId: wx.getStorageSync('provinceId'),//地区编码
    city: wx.getStorageSync('province'),//城市
    level: '',//级别
    type: 0,//类型
    putunder: '',//归口
    profession: 0,//专业分类
    chargeType: 0,//收费类型
    sort: 0,//综合排序
    searchList: [],
    onReachStatus: false,
    articleArray: [],
    articleTitleArray: [],
    categoryList: [],
    searchId: 0,
    areaDialog: false,
    cityValue: [],
    areaDialog: false,
    optionValue: [],
    region: [],
    newprovinceId: ''
  },
  // keyWords赋值
  changeKeyWords(e) {
    let val = e.detail.value
    this.setData({
      keyWords: val
    })
  },
  // 清空关键词
  clearKeyWords() {
    this.setData({
      keyWords: "",
      pageNo: 1,
      categoryList: [],
      searchList: []
    });
    if(this.data.searchId == 0){
      this.getSearchData();
    }else if(this.data.searchId == 1){
      this.getProductList()
    }else{
      this.data.categoryId == 0 && this.getAllCourseList()
      this.data.categoryId == 1 && this.getCourseList()
      this.data.categoryId == 2 && this.getVideoList()
    }
  },
  // 点击tab选择类型
  chooseFilter(e) {
    let item = e.currentTarget.dataset.item;
    this.setData({
      mask: !this.data.mask,
      flag: !this.data.flag,
      choosed: item.type,
    })
  },
  //点击遮罩关闭
  closeMask() {
    this.setData({
      mask: !this.data.mask,
      flag: !this.data.flag,
    })
  },
  //子组件点击改变接收值
  childChange(e) {
    // 地区
    if (this.data.choosed == 'area') return this.turnAreaIndex(e);
    // 级别
    if (this.data.choosed == 'level') return this.turnLevelIndex(e)
    // 类型  
    if (this.data.choosed == 'type') return this.turnTypeIndex(e)
    // 归口  
    if(this.data.choosed == 'putunder') return this.turnPutunderIndex(e)
    // 专业分类
    if(this.data.choosed == 'profession') return this.turnProfessionIndex(e)
    // 收费类型
    if(this.data.choosed == 'chargeType') return this.turnChargeIndex(e)
    // 综合排序
    if(this.data.choosed == 'sort') return this.turnSortIndex(e)
  },
  //地区点击获取值
  turnAreaIndex(data) {
    let filterType2 = this.data.filterType2
    filterType2.name = data.detail.name
    this.setData({
      filterType2: filterType2,
      newprovinceId: data.detail.no,
      pageNo: 1,
      mask: false,
      flag: !this.data.flag,
    })
    if(this.data.searchId == 0){
      this.getSearchData();
    }else if(this.data.searchId == 1){
      this.getProductList()
    }else{
      this.data.categoryId == 0 && this.getAllCourseList()
      this.data.categoryId == 1 && this.getCourseList()
      this.data.categoryId == 2 && this.getVideoList()
    }
  },
  //级别点击获取值
  turnLevelIndex(data) {
    let filterType3 = this.data.filterType3
    filterType3.name = data.detail.title
    this.setData({
      pageNo: 1,
      level: data.detail.type,
      filterType3: filterType3,
      mask: false,
      flag: !this.data.flag,
    });
    if(this.data.searchId == 0){
      this.getSearchData();
    }else if(this.data.searchId == 1){
      this.getProductList()
    }else{
      this.data.categoryId == 0 && this.getAllCourseList()
      this.data.categoryId == 1 && this.getCourseList()
      this.data.categoryId == 2 && this.getVideoList()
    }
  },
  //类型点击获取值
  turnTypeIndex(data) {
    let filterType4 = this.data.filterType4
    filterType4.name = data.detail.title
    this.setData({
      pageNo: 1,
      type: Number(data.detail.type),
      filterType4: filterType4,
      mask: false,
      flag: !this.data.flag,
    });
    if(this.data.searchId == 0){
      this.getSearchData();
    }else if(this.data.searchId == 1){
      this.getProductList()
    }else{
      this.data.categoryId == 0 && this.getAllCourseList()
      this.data.categoryId == 1 && this.getCourseList()
      this.data.categoryId == 2 && this.getVideoList()
    }
  },
  //归口点击获取值
  turnPutunderIndex(data) {
    let filterType5 = this.data.filterType5
    filterType5.name = data.detail.title
    this.setData({
      pageNo: 1,
      putunder: data.detail.type,
      filterType5: filterType5,
      mask: false,
      flag: !this.data.flag,
    });
    if(this.data.searchId == 0){
      this.getSearchData();
    }else if(this.data.searchId == 1){
      this.getProductList()
    }else{
      this.data.categoryId == 0 && this.getAllCourseList()
      this.data.categoryId == 1 && this.getCourseList()
      this.data.categoryId == 2 && this.getVideoList()
    }
  },
   //专业分类点击获取值
   turnProfessionIndex(data){
    let filterType6 = this.data.filterType6
    filterType6.name =  data.detail.title
    this.setData({
      pageNo: 1,
      profession: data.detail.type,
      filterType6: filterType6,
      mask: false,
      flag: !this.data.flag,
    });
    if(this.data.searchId==2){
      this.data.categoryId == 0 && this.getAllCourseList()
      this.data.categoryId == 1 && this.getCourseList()
      this.data.categoryId == 2 && this.getVideoList()
    }
  },
   //收费类型点击获取值
   turnChargeIndex(data){
    let filterType7 = this.data.filterType7
    filterType7.name =  data.detail.title
    this.setData({
      pageNo: 1,
      chargeType: data.detail.type,
      filterType7: filterType7,
      mask: false,
      flag: !this.data.flag, 
    });
    if(this.data.searchId==2){
      this.data.categoryId == 0 && this.getAllCourseList()
      this.data.categoryId == 1 && this.getCourseList()
      this.data.categoryId == 2 && this.getVideoList()
    }
  },
   //综合排序点击获取值
   turnSortIndex(data){
    let filterType8 = this.data.filterType8
    filterType8.name =  data.detail.title
    this.setData({
      pageNo: 1,
      sort: data.detail.type,
      filterType8: filterType8,
      mask: false,
      flag: !this.data.flag,
    });
    if(this.data.searchId == 2){
      this.data.categoryId == 0 && this.getAllCourseList()
      this.data.categoryId == 1 && this.getCourseList()
      this.data.categoryId == 2 && this.getVideoList()
    }
  },
  // tab切换选择
  changeNew(e) {
    let index = e.currentTarget.dataset.type;
    this.setData({
      pageNo: 1,
      newIndex: index,
      categoryId: index,
    });
    this.getSearchData();
  },
  //点击去详情
  toDetail(e) {
    let item = e.currentTarget.dataset.item;
    if(item.type == 1){
      wx.navigateTo({
        url: `/classRoom/pages/detail/course/course?id=${item.id}`,
      })
    }else if(item.type == 2){
      wx.navigateTo({
        url: `/classRoom/pages/detail/shortVideo/shortVideo?id=${item.id}`,
      })
    }else{
      wx.navigateTo({
        url: `/search/pages/productdetails/productdetails?id=${item.id}&type=${item.category_id}`  
      })
    }
  },
  preventTouchMove(e){},
  // 获取产品数据
  getProductList(){
    loadBox('加载中',true)
    let categoryList = this.data.categoryList
    let categoryId = this.data.categoryId
    let type = this.data.type
    let cate = []
    let onReachStatus = this.data.onReachStatus
    if(categoryId == 2){
      cate = type == 0 ? [3,4,5,6] : [type]
      this.setData({
        level: '全部'
      })
    }
    let para = { 
      categoryIdList: categoryList.concat(cate),
      keyword: this.data.keyWords,
      pageSize:this.data.pageSize,
      pageNo: this.data.pageNo,
      spuArea: this.data.newprovinceId==''?this.data.provinceId:this.data.newprovinceId,// 地区
      spuKinds: categoryId == 1 ? (this.data.putunder == 0 ? '' : this.data.putunder) : '',// 归口
      spuLevel: this.data.level == 0 ? '全部' : this.data.level == null ? '全部' : this.data.level,// 级别
    }
    let that = this
    getNewProduct(para).then(res => {
      if(res.code == 0){
        let list = res.data.records;
        if(list.length == 0){
          that.setData({
            searchList: list,
            searchCount: res.data.total,
            onReachStatus: false,
          });
          loadBox(false)
          return false
        }
        let listRes = res.data.records; //要解析的数据
        for (let i = 0; i < listRes.length; i++) {
            WxParse.wxParse('topic' + i, 'html', listRes[i].spuSlogan, that);
            WxParse.wxParse('topicNew' + i, 'html', listRes[i].spuTitle, that);
            if (i === listRes.length - 1) {
              WxParse.wxParseTemArray("listArr", 'topic', listRes.length, that)
              WxParse.wxParseTemArray("listArrNew", 'topicNew', listRes.length, that)
            }
        }
        let newlist = that.data.listArr;
        newlist.length>0 &&newlist.map((item, index, arr) => {   
            arr[index][0].categoryId = listRes[index]['categoryId'];
            arr[index][0].id = listRes[index]['id'];
            arr[index][0].imageUrl = listRes[index]['imageUrl'];
            arr[index][0].isOnline = listRes[index]['isOnline'];
            arr[index][0].spuMinAmount = listRes[index]['spuMinAmount'];
            arr[index][0].spuMaxAmount = listRes[index]['spuMaxAmount'];
            arr[index][0].spuTitle = listRes[index]['spuTitle'];
            arr[index][0].type = listRes[index]['type'];
            arr[index][0].flag = 0;
        });
        let newnewlist = that.data.listArrNew;
        newnewlist.length>0 &&newnewlist.map((item, index, arr) => {
            newlist[index][0].spuTitle = item
        });
        that.setData({
          searchList: onReachStatus ? [...that.data.searchList, ...newlist] : newlist,
          searchCount: res.data.total,
          onReachStatus: false,
        });
        loadBox(false)
      } else {
        loadBox(false)
        that.setData({
          codeFailed:true,
        })
      }
    }).catch(error => {
      loadBox(false)
      console.log(error)
    })
  },
  //获取全局搜索数据
  getSearchData(){  
    loadBox('加载中',true) 
    let onReachStatus = this.data.onReachStatus
    if(this.data.newprovinceId==''){
      this.setData({
        provinceId: wx.getStorageSync('provinceId')
      })
    }
    let para = { 
      keywords: this.data.keyWords,
      pageSize:this.data.pageSize,
      pageNo: this.data.pageNo,
      spuArea: this.data.newprovinceId==''?this.data.provinceId:this.data.newprovinceId,// 地区
      spuLevel: this.data.level == 0 ? '全部' : this.data.level == null ? '全部' : this.data.level,// 级别
    }
    let that = this
    globalSearch(para).then(res=>{
      if(res.code == 0){
        let list = res.data.data.records;
        if(list.length == 0){
          that.setData({
            searchList: list,
            searchCount: res.data.data.total,
            onReachStatus: false,
          });
          loadBox(false)
          return false
        }
        let listRes = res.data.data.records; //要解析的数据
        for (let i = 0; i < listRes.length; i++) {
          if(listRes[i].type == 3){
            WxParse.wxParse('topic' + i, 'html', listRes[i].spu_slogan, that);
            WxParse.wxParse('topicNew' + i, 'html', listRes[i].spu_title, that);
            if (i === listRes.length - 1) {
              WxParse.wxParseTemArray("listArr", 'topic', listRes.length, that)
              WxParse.wxParseTemArray("listArrNew", 'topicNew', listRes.length, that)
            }
          }else if(listRes[i].type == 2){
            WxParse.wxParse('topic' + i, 'html', listRes[i].title, that);
            WxParse.wxParse('topicNew' + i, 'html', listRes[i].description, that);
            if (i === listRes.length - 1) {
              WxParse.wxParseTemArray("listArr", 'topic', listRes.length, that)
              WxParse.wxParseTemArray("listArrNew", 'topicNew', listRes.length, that)
            }
          }else if(listRes[i].type == 1){
            WxParse.wxParse('topic' + i, 'html', listRes[i].base_title, that);
            WxParse.wxParse('topicNew' + i, 'html', listRes[i].base_slogan, that);
            if (i === listRes.length - 1) {
              WxParse.wxParseTemArray("listArr", 'topic', listRes.length, that)
              WxParse.wxParseTemArray("listArrNew", 'topicNew', listRes.length, that)
            }
          }
        }
        let newlist = that.data.listArr;
        newlist.length>0 &&newlist.map((item, index, arr) => {   
          if(listRes[index].type == 3){
            // arr[index][0].categoryId = listRes[index]['categoryId'];
            arr[index][0].id = listRes[index]['id'];
            arr[index][0].image_url= listRes[index]['image_url'];
            arr[index][0].is_online= listRes[index]['is_online'];
            arr[index][0].spu_min_amount= listRes[index]['spu_min_amount'];
            arr[index][0].spu_max_amount = listRes[index]['spu_max_amount'];
            arr[index][0].spu_title = listRes[index]['spu_title'];
            arr[index][0].update_time = listRes[index]['update_time'];
            arr[index][0].type = listRes[index]['type'];
          }else if(listRes[index].type == 2){
            arr[index][0].id = listRes[index]['id'];
            arr[index][0].cover_pic_url = listRes[index]['cover_pic_url'];
            arr[index][0].create_time = listRes[index]['create_time'];
            arr[index][0].play_video_id = listRes[index]['play_video_id'];
            arr[index][0].professional_type = listRes[index]['professional_type'];
            arr[index][0].serial_num = listRes[index]['serial_num'];
            arr[index][0].title = listRes[index]['title'];
            arr[index][0].type = listRes[index]['type'];
            arr[index][0].video_cover = listRes[index]['video_cover'];
            arr[index][0].video_id = listRes[index]['video_id'];
            arr[index][0].video_no = listRes[index]['video_no'];
            arr[index][0].video_time = listRes[index]['video_time'];
          }else if(listRes[index].type == 1){
            arr[index][0].id = listRes[index]['id'];
            arr[index][0].base_cover_url = listRes[index]['base_cover_url'];
            arr[index][0].base_show_state = listRes[index]['base_show_state'];
            arr[index][0].base_title = listRes[index]['base_title'];
            arr[index][0].class_no = listRes[index]['class_no'];
            arr[index][0].class_state = listRes[index]['class_state'];
            arr[index][0].create_time = listRes[index]['create_time'];
            arr[index][0].instruction = listRes[index]['instruction'];
            arr[index][0].serial_no = listRes[index]['serial_no'];
            arr[index][0].subject_id = listRes[index]['subject_id'];
            arr[index][0].trading_charge_type = listRes[index]['trading_charge_type'];
            arr[index][0].trading_current_price = listRes[index]['trading_current_price'];
            arr[index][0].trading_original_price = listRes[index]['trading_original_price'];
            arr[index][0].trading_third_fee = listRes[index]['trading_third_fee'];
            arr[index][0].trading_third_fee_state = listRes[index]['trading_third_fee_state'];
            arr[index][0].trading_vip_price = listRes[index]['trading_vip_price'];
            arr[index][0].type = listRes[index]['type'];
          }
        });
        let newnewlist = that.data.listArrNew;
        newnewlist.length>0 &&newnewlist.map((item, index, arr) => {
          if(newlist[index][0].type == 3){
            newlist[index][0].spu_title = item
          }else if(newlist[index][0].type == 2){
            newlist[index][0].title = item
          }else if(newlist[index][0].type == 1){
            newlist[index][0].base_title = item
          }
        });
        that.setData({
          searchList: onReachStatus ? [...that.data.searchList, ...newlist] : newlist,
          searchCount: res.data.data.total,
          onReachStatus: false,
        });
        loadBox(false)
      } else {
        loadBox(false)
        that.setData({
          codeFailed: true,
        })
      }
    }).catch(error => {
      loadBox(false)
      console.log(error)
    })
  },
  confirmTap(e) {
   this.skipToGlobal(e.detail.value, true)
  },
  skipToGlobal(e, keyBoard) {
    this.setData({
      spuTitle: keyBoard ? e : e.currentTarget.dataset.word,
      mask: true,
      flag: false,
      pageNo: 1,
    });
    if(this.data.searchId == 0){
      this.getSearchData()
    }else if(this.data.searchId == 1){
      this.getProductList()
    }else{
      this.data.categoryId == 0 && this.getAllCourseList()
      this.data.categoryId == 1 && this.getCourseList()
      this.data.categoryId == 2 && this.getVideoList()
    }
  },
  // 获取综合搜索选项值
  getPassVal(val) {
    let item = val.detail.item.value
    let filterType1 = this.data.filterType1
    this.setData({
      searchId: item,
    })
   if(item == 0){
    filterType1.name = '综合搜索'
    this.setData({
      pageNo: 1,
      mask: !this.data.mask,
      flag:!this.data.flag,
      choosed: 'comprehensiveSearch',
      filterType1: filterType1
    })
    this.getSearchData()
   }else{
      filterType1.name = val.detail.item.name
      this.setData({
        pageNo: 1,
        searchList: [],
        choosed: 'comprehensiveSearch',
        filterType1: filterType1
      })
   }
  },
  // 获取企业服务Id
  getCategory(val) {
    let item = val.detail.item
    let filterType1 = this.data.filterType1
    let list = []
    if(this.data.searchId == 0){
      filterType1.name = '综合搜索'
      this.setData({
        pageNo: 1,
        categoryId: item.id,
        categoryList: list,
        mask: !this.data.mask,
        flag:!this.data.flag,
        choosed: 'comprehensiveSearch',
        searchList: [],
        filterType1: filterType1,
      })
      this.getSearchData()
    }else if(this.data.searchId == 1){
      if(item.id == 0){
        filterType1.name = '企业服务'
        list = []
      }else if(item.id == 2){
        filterType1.name = item.categoryName
        list = []
      }else{
        filterType1.name = item.categoryName
        list.push(item.id)
      }
      this.setData({
        pageNo: 1,
        categoryId: item.id,
        categoryList: list,
        mask: !this.data.mask,
        flag:!this.data.flag,
        choosed: 'comprehensiveSearch',
        searchList: [],
        filterType1: filterType1,
      })
      this.getProductList()
    }else{
      if(item.id == 0){
        filterType1.name = '卧涛课程'
      }else{
        filterType1.name = item.categoryName
      }
      this.setData({
        pageNo: 1,
        categoryId: item.id,
        mask: !this.data.mask,
        flag:!this.data.flag,
        choosed: 'comprehensiveSearch',
        searchList: [],
        filterType1: filterType1,
      })
      item.id == 0 && this.getAllCourseList()
      item.id == 1 && this.getCourseList()
      item.id == 2 && this.getVideoList()
    }                                                                                                                                                   
  },
  getAllCourseList(){
    loadBox('加载中',true)
    this.setData({
      searchList: []
    })
    let params = {
      baseShowState: 1,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
      professionalTypeList: [],
      sort: "",
      subjectIdList: [],
      title: this.data.keyWords,
    }
    params.subjectIdList = this.data.profession == 0 ? [] : [this.data.profession]
    params.professionalTypeList = this.data.profession == 0 ? [] : [this.data.profession]
    params.sort = this.data.sort == 0 ? 'hottest' : 'latest'
    let onReachStatus = this.data.onReachStatus
    let that = this
    getAllCourseList(params).then(res=>{
      if(res.code == 0){
        let list = res.data.data.records;
        if(list.length == 0){
          that.setData({
            searchList: list,
            searchCount: res.data.data.total,
            onReachStatus: false,
          });
          loadBox(false)
          return false
        }
        let listRes = res.data.data.records; //要解析的数据
        for (let i = 0; i < listRes.length; i++) {
          if(listRes[i].type == 2){
            WxParse.wxParse('topic' + i, 'html', listRes[i].title, that);
            WxParse.wxParse('topicNew' + i, 'html', listRes[i].description, that);
            if (i === listRes.length - 1) {
              WxParse.wxParseTemArray("listArr", 'topic', listRes.length, that)
              WxParse.wxParseTemArray("listArrNew", 'topicNew', listRes.length, that)
            }
          }else if(listRes[i].type == 1){
            WxParse.wxParse('topic' + i, 'html', listRes[i].base_title, that);
            WxParse.wxParse('topicNew' + i, 'html', listRes[i].base_slogan, that);
            if (i === listRes.length - 1) {
              WxParse.wxParseTemArray("listArr", 'topic', listRes.length, that)
              WxParse.wxParseTemArray("listArrNew", 'topicNew', listRes.length, that)
            }
          }
        }
        let newlist = that.data.listArr;
        newlist.length>0 &&newlist.map((item, index, arr) => {   
          if(listRes[index].type == 2){
            arr[index][0].id = listRes[index]['id'];
            arr[index][0].cover_pic_url = listRes[index]['cover_pic_url'];
            arr[index][0].create_time = listRes[index]['create_time'];
            arr[index][0].play_video_id = listRes[index]['play_video_id'];
            arr[index][0].professional_type = listRes[index]['professional_type'];
            arr[index][0].serial_num = listRes[index]['serial_num'];
            arr[index][0].title = listRes[index]['title'];
            arr[index][0].type = listRes[index]['type'];
            arr[index][0].video_cover = listRes[index]['video_cover'];
            arr[index][0].video_id = listRes[index]['video_id'];
            arr[index][0].video_no = listRes[index]['video_no'];
            arr[index][0].video_time = listRes[index]['video_time'];
          }else if(listRes[index].type == 1){
            arr[index][0].id = listRes[index]['id'];
            arr[index][0].base_cover_url = listRes[index]['base_cover_url'];
            arr[index][0].base_show_state = listRes[index]['base_show_state'];
            arr[index][0].base_title = listRes[index]['base_title'];
            arr[index][0].class_no = listRes[index]['class_no'];
            arr[index][0].class_state = listRes[index]['class_state'];
            arr[index][0].create_time = listRes[index]['create_time'];
            arr[index][0].instruction = listRes[index]['instruction'];
            arr[index][0].serial_no = listRes[index]['serial_no'];
            arr[index][0].subject_id = listRes[index]['subject_id'];
            arr[index][0].trading_charge_type = listRes[index]['trading_charge_type'];
            arr[index][0].trading_current_price = listRes[index]['trading_current_price'];
            arr[index][0].trading_original_price = listRes[index]['trading_original_price'];
            arr[index][0].trading_third_fee = listRes[index]['trading_third_fee'];
            arr[index][0].trading_third_fee_state = listRes[index]['trading_third_fee_state'];
            arr[index][0].trading_vip_price = listRes[index]['trading_vip_price'];
            arr[index][0].type = listRes[index]['type'];
          }
        });
        let newnewlist = that.data.listArrNew;
        newnewlist.length>0 &&newnewlist.map((item, index, arr) => {
          if(newlist[index][0].type == 2){
            newlist[index][0].title = item
          }else if(newlist[index][0].type == 1){
            newlist[index][0].base_title = item
          }
        });
        that.setData({
          searchList: onReachStatus ? [...that.data.searchList, ...newlist] : newlist,
          searchCount: res.data.data.total,
          onReachStatus: false,
        });
        loadBox(false)
      }else{
        loadBox(false)
        that.setData({
          codeFailed:true,
        })
      }
    }).catch(error => {
      loadBox(false)
      console.log(error)
    })
  },
  getCourseList(){
    loadBox('加载中',true)
    this.setData({
      searchList: []
    })
    let params = {
      baseShowState: 1,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
      sort: "",
      subjectIdList: [],
      title: this.data.keyWords,
      tradingChargeType: null
    }
    params.subjectIdList = this.data.profession == 0 ? [] : [this.data.profession]
    params.tradingChargeType = this.data.chargeType == 0 ? null : this.data.chargeType
    params.sort = this.data.sort == 0 ? 'hottest' : 'latest'
    let onReachStatus = this.data.onReachStatus
    let that = this
    getCourseList(params).then(res=>{
      if(res.code == 0){
        let list = res.data.data.records;
        if(list.length == 0){
          that.setData({
            searchList: list,
            searchCount: res.data.data.total,
            onReachStatus: false,
          });
          loadBox(false)
          return false
        }
        let listRes = res.data.data.records; //要解析的数据
        for (let i = 0; i < listRes.length; i++) {
          if(listRes[i].type == 1){
            WxParse.wxParse('topic' + i, 'html', listRes[i].base_title, that);
            WxParse.wxParse('topicNew' + i, 'html', listRes[i].base_slogan, that);
            if (i === listRes.length - 1) {
              WxParse.wxParseTemArray("listArr", 'topic', listRes.length, that)
              WxParse.wxParseTemArray("listArrNew", 'topicNew', listRes.length, that)
            }
          }
        }
        let newlist = that.data.listArr;
        newlist.length>0 &&newlist.map((item, index, arr) => {   
          if(listRes[index].type == 1){
            arr[index][0].id = listRes[index]['id'];
            arr[index][0].base_cover_url = listRes[index]['base_cover_url'];
            arr[index][0].base_show_state = listRes[index]['base_show_state'];
            arr[index][0].base_title = listRes[index]['base_title'];
            arr[index][0].class_no = listRes[index]['class_no'];
            arr[index][0].class_state = listRes[index]['class_state'];
            arr[index][0].create_time = listRes[index]['create_time'];
            arr[index][0].instruction = listRes[index]['instruction'];
            arr[index][0].serial_no = listRes[index]['serial_no'];
            arr[index][0].subject_id = listRes[index]['subject_id'];
            arr[index][0].trading_charge_type = listRes[index]['trading_charge_type'];
            arr[index][0].trading_current_price = listRes[index]['trading_current_price'];
            arr[index][0].trading_original_price = listRes[index]['trading_original_price'];
            arr[index][0].trading_third_fee = listRes[index]['trading_third_fee'];
            arr[index][0].trading_third_fee_state = listRes[index]['trading_third_fee_state'];
            arr[index][0].trading_vip_price = listRes[index]['trading_vip_price'];
            arr[index][0].type = listRes[index]['type'];
          }
        });
        let newnewlist = that.data.listArrNew;
        newnewlist.length>0 &&newnewlist.map((item, index, arr) => {
          if(newlist[index][0].type == 1){
            newlist[index][0].base_title = item
          }
        });
        that.setData({
          searchList: onReachStatus ? [...that.data.searchList, ...newlist] : newlist,
          searchCount: res.data.data.total,
          onReachStatus: false,
        });
        loadBox(false)
      }else{
        loadBox(false)
        that.setData({
          codeFailed:true,
        })
      }
    }).catch(error => {
      loadBox(false)
      console.log(error)
    })
  },
  getVideoList(){
    loadBox('加载中',true)
    this.setData({
      searchList: []
    })
    let params = {
      baseShowState: 1,
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
      professionalTypeList: [],
      sort: "",
      title: this.data.keyWords,
    }
    params.professionalTypeList = this.data.profession == 0 ? [] : [this.data.profession]
    params.sort = this.data.sort == 0 ? 'hottest' : 'latest'
    let onReachStatus = this.data.onReachStatus
    let that = this
    getVideoList(params).then(res=>{
      if(res.code == 0){
        let list = res.data.data.records;
        if(list.length == 0){
          that.setData({
            searchList: list,
            searchCount: res.data.data.total,
            onReachStatus: false,
          });
          loadBox(false)
          return false
        }
        let listRes = res.data.data.records; //要解析的数据
          for (let i = 0; i < listRes.length; i++) {
            if(listRes[i].type == 2){
              WxParse.wxParse('topic' + i, 'html', listRes[i].title, that);
              WxParse.wxParse('topicNew' + i, 'html', listRes[i].description, that);
              if (i === listRes.length - 1) {
                WxParse.wxParseTemArray("listArr", 'topic', listRes.length, that)
                WxParse.wxParseTemArray("listArrNew", 'topicNew', listRes.length, that)
              }
            }
          }
          let newlist = that.data.listArr;
          newlist.length>0 &&newlist.map((item, index, arr) => {   
           if(listRes[index].type == 2){
              arr[index][0].id = listRes[index]['id'];
              arr[index][0].cover_pic_url = listRes[index]['cover_pic_url'];
              arr[index][0].create_time = listRes[index]['create_time'];
              arr[index][0].play_video_id = listRes[index]['play_video_id'];
              arr[index][0].professional_type = listRes[index]['professional_type'];
              arr[index][0].serial_num = listRes[index]['serial_num'];
              arr[index][0].title = listRes[index]['title'];
              arr[index][0].type = listRes[index]['type'];
              arr[index][0].video_cover = listRes[index]['video_cover'];
              arr[index][0].video_id = listRes[index]['video_id'];
              arr[index][0].video_no = listRes[index]['video_no'];
              arr[index][0].video_time = listRes[index]['video_time'];
            }
          });
          let newnewlist = that.data.listArrNew;
          newnewlist.length>0 &&newnewlist.map((item, index, arr) => {
            if(newlist[index][0].type == 2){
              newlist[index][0].title = item
            }
          });
          that.setData({
            searchList: onReachStatus ? [...that.data.searchList, ...newlist] : newlist,
            searchCount: res.data.data.total,
            onReachStatus: false,
          });
          console.log(this.data.searchList,'ccccccccccccccc')
        loadBox(false)
      }else{
        loadBox(false)
        that.setData({
          codeFailed:true,
        })
      }
    }).catch(error => {
      loadBox(false)
      console.log(error)
    })
  },
  changeCity() {
    this.setData({
      areaDialog: !this.data.areaDialog
    })
    // this.getData()
  },
  // 获取子组件传值
  getCityName(e) {
    if (e.detail != '') {
      this.setData({
        city: e.detail,
        areaDialog: false
      })
      this.resetFilter()
    } else {
      this.setData({
        areaDialog: false
      })
    }
  },
  getData() {
    let data = wx.getStorageSync('district')
    let cityId = wx.getStorageSync('provinceId')
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
      optionValue: [index1, index2],
      region: data
    })
  },
  // 重置地区筛选数据
  resetFilter() {
    this.setData({
      filterType1: {
        name: '综合搜索',
        type: 'comprehensiveSearch',
        index: 0
      },
      filterType2: {
        name: '地区',
        type: 'area',
        index: 1
      },
      filterType3: {
        name: '级别',
        type: 'level',
        index: 2
      },
      filterType4: {
        name: '类型',
        type: 'type',
        index: 3
      },
      filterType5: {
          name: '归口',
          type: 'putunder',
          index: 4
      },
      filterType6: {
        name: '专业分类',
        type: 'profession',
        index: 5
      },
      filterType7: {
        name: '收费类型',
        type: 'chargeType',
        index: 6
      },
      filterType8: {
        name: '综合排序',
        type: 'sort',
        index: 7
      },
      generateAttributeList: [
        {
          attributeId: 1,
          attributeValueList:[]
        }
      ],
      pageSize:10,
      pageNo:1,
      provinceId: wx.getStorageSync('provinceId'),
      city: wx.getStorageSync('province'),
      level: null,
      type: 0,
      putunder: '',
      searchId: 0,
      categoryId: 0,
      profession: 0,
      chargeType: 0,
      sort: 0,
     })
     if(this.data.searchId == 0){
        this.getSearchData();
      }else if(this.data.searchId == 1){
        this.getProductList()
      }else{
        this.data.categoryId == 0 && this.getAllCourseList()
        this.data.categoryId == 1 && this.getCourseList()
        this.data.categoryId == 2 && this.getVideoList()
      }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.keyWords) {
      this.setData({
        keyWords: options.keyWords,
      });
    }
    this.setData({
      provinceId: wx.getStorageSync('provinceId'),
      city: wx.getStorageSync('province')
    })
    this.getData()
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
    this.getSearchData()
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
    if (this.data.searchList.length < this.data.searchCount) {
      this.setData({
        pageNo: this.data.pageNo + 1,
        onReachStatus: true
      })
      if(this.data.searchId == 0){
        this.getSearchData();
      }else if(this.data.searchId == 1){
        this.getProductList()
      }else{
        this.data.categoryId == 0 && this.getAllCourseList()
        this.data.categoryId == 1 && this.getCourseList()
        this.data.categoryId == 2 && this.getVideoList()
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})