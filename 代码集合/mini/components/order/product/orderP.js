// components/order/product/orderP.js
const app = getApp();
import { pageTmRefundSpuVo } from "../../../utils/api/refund"
import { innerPageTmOrder } from "../../../utils/api/orders"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    options: {
      type: Object,
      value: {}
    },
    checkIndex:{
      type: Number,
      value: null
    },
    page: {
      type: Object,
      value: {}
    },
    counts: {
      type: Object,
      value: {}
    },
    top:{
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: app.globalData.navHeight * 2 + 10,
    loading: true,
    imageUrl: app.globalData.imageURL,
    userInfo: {},
    cIndex: 0,
    refundTotal:0,
    filterList: [{
        title: "全部",
        value: ""
      },
      {
        title: "待签约",
        value: 1
      },
      {
        title: "待付款",
        value: 0
      },
      {
        title: "服务中",
        value: 3
      },
      {
        title: "退款/售后",
        value: 99
      },
    ],
    orderList: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
        // 改变筛选条件
    changeFilter(e) {          
      this.triggerEvent('childIndex', false)
      let index = e.currentTarget.dataset.index;
      let current = 'page.current';
      this.setData({
        cIndex: index,
        [current]:1,
        orderList: [],
      });
      // this.getData(this.data.cIndex)
      index == 4 ? this.getRefundData(this.data.cIndex) : this.getData(this.data.cIndex);   
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 500,
      });
    },
    // 获取订单列表数据
    getData(data) {
      this.showLoading(true)
      let status = data ? this.data.filterList[data].value : '';
      let params = {
        accountId: wx.getStorageSync('userInfo').accountId,
        pageNo: this.data.page.current,
        pageSize: 20
      }
      if( status == 3 || status == 99 ){
        params.orderStatusList = [2,3]
      } else {
        params.orderStatus = status        
      }
      innerPageTmOrder(params).then(res => {
        if (res.code == 0) {
          let list = res.data.records;
          list.forEach(item =>{
            item.urlType = item.url.substr(item.url.lastIndexOf('.') + 1)
          }),
          this.setData({
            orderList: [...this.data.orderList, ...list],
          });
          let para = {};
          para.total = res.data.total;
          para.current = this.data.page.current;
          para.index = data;
          this.triggerEvent('childIndex', true)
          this.triggerEvent('changePage', para);
          this.showLoading(false, list)
        }
      });      
      this.setData({
        cIndex: data
      });
    },
    // 显示loading效果
    showLoading(flag, list) {
      if (flag) {
        wx.showLoading({
          title: '加载中！',
        })
      } else {
        wx.hideLoading({
          success: (res) => {
            this.setData({
              loading: list.length > 0 ? true : false
            })
          },
        })
      }
    },
    // 退款状态订单单独一个接口
    getRefundData(index) {
      // return 
      this.showLoading(true);
      let data = {
        pageNo: this.data.page.current,
        pageSize: 20
      }
      pageTmRefundSpuVo(data).then(res => {
        if (res.code == 0) {
          let list = res.data.records
          this.setData({
            orderList: [...this.data.orderList, ...list],
            refundTotal:res.data.total
          })
          this.showLoading(false, list);
          let para = {};
          para.total = res.data.total;
          para.current = this.data.page.current;
          para.index = index;
          this.triggerEvent('childIndex', true);
          this.triggerEvent('changePage', para);
        }
      })
      this.setData({
        cIndex: index
      })
    },
    handleRefresh(e) {
      let no = 'page.current';
      this.setData({
        orderList: [],
        [no]:1
      });
      e.detail.whichIndex == 4 ? this.getRefundData(e.detail.whichIndex) : this.getData(e.detail.whichIndex);      
      setTimeout(()=>{
        if(this.data.top<60){
          app.toTop()
        }
      },1000)
    },
      //监听页面滑动
  onPageScroll(e) {
    let that = this
    wx.createSelectorQuery().select('#productBox').boundingClientRect(function (rect) {
     console.log(rect.top,'***********');
    }).exec()
  },
  },
  lifetimes:{
    attached: function () {
      setTimeout(()=>{
        if(this.data.checkIndex == 0){
          console.log(this.data.options,'产品订单状态');
          this.data.options.type == 4 ? this.getRefundData(this.data.options.type) : this.getData(this.data.options.type)
          //4为退款列表
        }
      },500)      
    }
  }
})
