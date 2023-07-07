const app = getApp();
import { getCollectList,batchDelCollect,getCourseList,batchCancelClassCollect, getInfomationsCollect } from "../../../utils/api/collect"
import {
  delCollect,
} from "../../../utils/api/search"

Page({
  data: {
    navigationBarAndStatusBarHeight: wx.getStorageSync('statusBarHeight') + wx.getStorageSync('navigationBarHeight') + 4 + 'px',
    navigationBarHeight: wx.getStorageSync('navigationBarHeight') + 'px',
    statusBarHeight: wx.getStorageSync('statusBarHeight') + 'px',
    showTop: false,
    total: 0,
    showModalStatus: false,
    showOption: false,
    size: 10,
    page: 1,
    statusName: "全部",
    statusList: [{ id: 0,name: "全部"}, {id: 2,name: "正常"}, {id: 1,name: "已失效" }],
    tabList: ['资讯&文档','服务产品','课堂'],
    activeTab:0,
    deletedList: 0, //收藏状态
    collectionList: [],  //收藏列表
    imageUrl: app.globalData.imageURL,
    videoControl: false,
    flag: true, //数据“正在加载”的缓冲标志，接口调完时置为true，上拉时置为false,页面显示”正在加载“，定时器设置时间，完美
    noData: false,
    isManage: false,  //管理
    selectilall: false,
    idList: [] //批量删除ids
  },
  // 回到页面顶部
  toTop() {
    app.toTop()
  },
  //dialog
  getStatus() {
    var that = this;
    this.setData({
      showOption: !that.data.showOption
    })
  },
  //详情
  toProjectDetail(e) {
    // let item = e.currentTarget.dataset.item;
    // if (item.deleted == 1 || item.status == 2 || item.showstatus == 2) {
    //   wx.navigateTo({
    //     url: "/search/pages/nodata/nodata"
    //   })
    // } else {
    //   if (item.type == 0) {
    //     wx.navigateTo({
    //       url: "/search/pages/projectDetail/projectDetail?number=" + item.number
    //     })
    //   } else if (item.type == 1) {
    //     wx.navigateTo({
    //       url: "/search/pages/propertyDetail/propertyDetail?propertyId=" + item.produceId
    //     })
    //   } else {
    //     this.toDetail(item)
    //   }
    // }
  },
  //状态切换
  statusChange(e) {
    this.setData({
      deletedList: e.currentTarget.dataset.myid, //收藏状态
      page: 1,
      total: 0,
      collectionList: [],
      idList: []
    });
    if (this.data.deletedList == 2) {
      this.setData({
        statusName: "正常"
      })
    } else if (this.data.deletedList == 1) {
      this.setData({
        statusName: "已失效"
      })
    } else {
      this.setData({
        statusName: "全部"
      })
    }
    this.getCollectionList();
  },
  //管理切换
  changeManage() {
    let list = this.data.collectionList
    list.forEach((item, i) => {
      list[i].checked = false
    })
    this.setData({
      isManage: !this.data.isManage,
      idList: [],
      collectionList: list,
      selectilall: false,
    })
    if (this.data.isManage) {
      wx.setNavigationBarTitle({
        title: "已选择0项"
      })
    } else {
      wx.setNavigationBarTitle({
        title: "我的收藏"
      });
      this.setData({
        idList: [],
        total: 0
      })
    }
  },
  //全选按钮
  selectAll() {
    var that = this;
    this.setData({
      selectilall: !this.data.selectilall
    })
    let list = this.data.collectionList
    let idList = []
    if (this.data.selectilall) {
        list.forEach((item, i) => {
          list[i].checked = true;
          idList.push(this.data.activeTab == 0 ? item.infoId : item.number)
        })
    } else {
      list.forEach((item, i) => {
        list[i].checked = false
      })
    }
    this.setData({
      collectionList: list,
      idList: idList
    })
    wx.setNavigationBarTitle({
      title: "已选择" + that.data.idList.length + "项"
    })
  },
  //选中的项目列操作
  checkboxChange(e) {
    var that = this;
    this.setData({
      idList: e.detail.value, //选中的列的value值数组集合
    })
    wx.setNavigationBarTitle({
      title: "已选择" + that.data.idList.length + "项"
    })
    if (this.data.idList.length == this.data.total) {
      this.setData({
        selectilall: true,
      })
    } else {
      this.setData({
        selectilall: false,
      })
    }
  },
  //获取列表
  getCollectionList() {
    let accountId = wx.getStorageSync('accountId')
    let userInfo = wx.getStorageSync('userInfo')
    if(this.data.activeTab==0){ //资讯&文档
      let params = {
        userId: userInfo.userId,
        pageSize: this.data.size,
        pageNo: this.data.page,
        effective: this.data.deletedList==0?null:this.data.deletedList==2?1:2,
      }
      getInfomationsCollect(params).then(res => {
        if (res.code == 0) {
          let collectionList = this.data.collectionList
          this.setData({
            collectionList: collectionList.concat(res.data.records),
            flag: true,
            total: res.data.total
          })
        }
      })
    }else if(this.data.activeTab==1){ //服务产品
      let params = {
        userId: accountId,
        pageSize: this.data.size,
        pageNo: this.data.page,
        effective: this.data.deletedList==0?0:this.data.deletedList==2?1:2,
      }
      getCollectList(params).then(res => {
        if (res.code == 0) {
          let collectionList = this.data.collectionList
          res.data.records.forEach(element=>{
             element.number = element.spuId
          })
          this.setData({
            collectionList: collectionList.concat(res.data.records),
            flag: true,
            total: res.data.total
          })
        }
      })
    }else{ //课程
      let params = {
        userId: accountId,
        pageSize: this.data.size,
        pageNo: this.data.page,
        baseShowState: this.data.deletedList==0?1:this.data.deletedList==2?1:[0,3],
      }
        getCourseList(params).then(res=>{
          if (res.code == 0) {
            let collectionList = this.data.collectionList
            res.data.records.forEach(element=>{
              element.number = element.classNo
           })
            this.setData({
              collectionList: collectionList.concat(res.data.records),
              flag: true,
              total: res.data.total
            })
          }
        })
    }
  },
  //删除
  delCollection() {
    var that = this;
    if (this.data.idList.length == 0) {
      wx.showToast({
        title: '请先选择产品！',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showModal({
        content: '确定要删除此收藏吗？',
        confirmColor: '#36A6FE',
        success(res) {
          if (res.confirm) {
            if(that.data.activeTab==0){
              let userInfo = wx.getStorageSync('userInfo')
              let parmas = {
                infoIds: that.data.idList,
                userId: userInfo.userId,
                collectSource: 3,
              }
              delCollect(parmas).then(res => {
                if (res.code == 0) {
                  wx.showToast({
                    title: '已删除',
                    icon: 'success',
                    duration: 2000
                  })
                  that.setData({
                    collectionList: [],
                    page: 1,
                    idList: []
                  })
                  wx.setNavigationBarTitle({
                    title: "已选择0项"
                  })
                  that.getCollectionList();
                }
              })
            } else if (that.data.activeTab==1) {
              let accountId = wx.getStorageSync('accountId')
              let params = {
                userId: accountId,
                spuIds: that.data.idList,
              }
              batchDelCollect(params).then(res => {
                if (res.code == 0) {
                  wx.showToast({
                    title: '已删除',
                    icon: 'success',
                    duration: 2000
                  })
                  that.setData({
                    collectionList: [],
                    page: 1,
                    idList: []
                  })
                  wx.setNavigationBarTitle({
                    title: "已选择0项"
                  })
                  that.getCollectionList();
                }
              })
            } else {
              let params = {
                 classIds: that.data.idList
              }
              batchCancelClassCollect(params).then(res=>{
                if (res.code == 0) {
                  wx.showToast({
                    title: '已删除',
                    icon: 'success',
                    duration: 2000
                  })
                  that.setData({
                    collectionList: [],
                    page: 1,
                    idList: []
                  })
                  wx.setNavigationBarTitle({
                    title: "已选择0项"
                  })
                  that.getCollectionList();
                }
               })
            }
          }
        }
      })
    }
  },
  //tab点击
  handleTab(event){
    this.setData({
      activeTab:event.currentTarget.dataset.index,
      selectilall: false,
      idList: [],
      collectionList: [],
      page: 1,
    })
    this.getCollectionList()
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
  },

  onLoad: function (options) {},
  onShow: function (options) {
    this.setData({
      collectionList: [],
      page: 1,
    })
    this.getCollectionList();
  },
  // 上拉刷新
  onReachBottom: function () {
    let length = this.data.collectionList.length
    let page = this.data.page
    if (this.data.flag && length < this.data.total) {
      page = page + 1
      this.setData({
        flag: false,
        page: page
      })
      this.getCollectionList()
    }
  },
})