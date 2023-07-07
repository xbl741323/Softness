// personal/pages/orderIndex/order.js
const app = getApp();
// import { count } from "console";
import { statisticsProductOrderNum, statisticsCourseOrderNum, getMyWaitPayCountForFront } from "../../../utils/api/orders"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTop:false,
    reactStatus:true,
    fileChecked: null,
    height: app.globalData.navHeight * 2 + 10,
    urlOptions:{},
    topNavs:[{
      title:'服务产品',
      index: 0
    },{
      title:'课堂',
      index: 1
    },{
      title:'卧涛文档',
      index: 2
    }],
    checkIndex: 0,  
    proPage:{
      current: 1,
      total: 0,  
    },
    classPage:{
      current: 1,
      total: 0, 
    },
    documentPage:{
      current: 1,
      total: 0, 
    },
    noMore:false,
    topPosition:'',
    counts: null,
    courseCounts: null,
    documentCounts: null
  },
  // 订单类型切换
  changeIndex(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      checkIndex: index,
      noMore: false,
    });
    app.toTop()
  },
  // 产品订单页面信息
  changePage(val){
    this.setData({
      proPage:val.detail,
    })
  },
// 课堂订单页面信息
  changeClass(val){
    this.setData({
      classPage: val.detail,
    });
  },
  changeDocument(val){
    console.log(val,'000');
    this.setData({
      documentPage: val.detail,
    });    
  },
  // 切换订单状态隐藏无数据提示
  childIndex(options){
    if(this.data.noMore) return this.setData({
      noMore:false,      
    });
    this.setData({
      reactStatus: options.detail
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options,999);
    this.setData({
      urlOptions: options,
    });
    if(options.fileType){
      this.setData({
        fileChecked: options.fileType,
      })
    };
    if(options.index) return this.setData({
      checkIndex: options.index
    })
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
    statisticsProductOrderNum().then(res => {
      if (res.code == 0) {
        let count = res.data;
        let all = Object.values(count).reduce((m,n)=>{
          return m+n
        });
        count.all = all;
        this.setData({
          counts: count
        })
      }
    })
    statisticsCourseOrderNum().then(res => {
      if (res.code == 0) {
        let count = res.data;
        let all = Object.values(count).reduce((m,n)=>{
          return m+n
        });
        count.all = all;
        console.log(count,'pppp');
        this.setData({
          courseCounts: count
        })
      }
    });
    getMyWaitPayCountForFront().then(res => {
      if (res.code == 0) {
        let count = {};
        count.waitPay = res.data;
        this.setData({
          documentCounts: count
        })
      }
    })
  },
  //监听页面滑动
  onPageScroll(e) {
    let that = this;
    if(e.scrollTop > 300){
      that.setData({
        showTop:true,
      })
    } else {
      that.setData({
        showTop:false
      })
    }
    wx.createSelectorQuery().select('#orderBox').boundingClientRect(function (rect) {
      that.setData({
        topPosition: rect.top
      })
    }).exec()
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
    // 产品订单触底加载
    console.log(this.data.proPage.total);
    if(!this.data.reactStatus) return;
    if(this.data.checkIndex==0){
      if(this.data.proPage.current*20 >= this.data.proPage.total) return this.setData({
        noMore: true
      });
      let current = 'proPage.current'
      this.setData({
        [current]: this.data.proPage.current+1
      });      
      let index = this.data.proPage.index ? this.data.proPage.index : this.data.urlOptions.type;
      if(index == 4) return this.selectComponent("#pro").getRefundData(index);
      this.selectComponent("#pro").getData(index);
    };
    // 课堂订单触底加载
    if(this.data.checkIndex!=0){
      let index = this.data.checkIndex;
      let total = index == 1 ? this.data.classPage.total : this.data.documentPage.total;
      let current = index == 1 ? this.data.classPage.current : this.data.documentPage.current; 
      if(total == 0) return this.setData({
        noMore: false
      });
      if(current*10 >= total) return this.setData({
        noMore: true
      });
      let currents = index == 1 ? 'classPage.current' : 'documentPage.current'; 
      this.setData({
        [currents]: current+1
      })
      let idCom = index == 1 ? '#class' : '#document';
      this.selectComponent(idCom).getList();
      // this.data.classPage.index
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})