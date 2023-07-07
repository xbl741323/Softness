// personal/components/my-clue/order-records/order-records.js
import {
  getDirectionOfReceive,
  getPatternOfPayment,
} from "../../../../utils/order/order"

Component({
  lifetimes: {
    attached: function () {
      this.setOriginalData()
      this.removedata()
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    clueId: {
      type: Number
    },
    clueType: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    filters: {
      keyWords: null, // 关键字
      startReceiveTime: null, // 开始时间
      endReceiveTime: null, // 结束时间
    },
    reachStatus: false,
    currentDate: new Date().getTime(),
    minDate: new Date(2021, 1, 1).getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    orderList: [],
    receiveDirection: [], // 回款去向
    allTypeList: [], // 费用类型
    showStartTime: false,
    showEndTime: false,
    show: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    refresh() {},
    // 时间格式操作
    formatDate(date) {
      date = new Date(date);
      let year = date.getFullYear()
      let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let day = String(date.getDate()).length == 1 ? '0' + date.getDate() : date.getDate()
      return `${year}-${month}-${day} 00:00:00`;
    },
    // 获取当月第一天
    getFirstDate() {
      let date = new Date();
      let year = date.getFullYear()
      let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      return `${year}-${month}-01 00:00:00`;
    },
    // 获取当月最后一天
    getLastDate() {
      let date = new Date();
      let year = date.getFullYear()
      let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let lastDay = new Date(year, month, 0).getDate()
      return `${year}-${month}-${lastDay} 00:00:00`;
    },
    // 开始
    onConfirmStart(e) {
      let date = e.detail
      let filters = this.data.filters
      filters.startReceiveTime = this.formatDate(date)
      this.setData({
        filters: filters
      })
      this.closeStartTime()
    },
    // 结束
    onConfirmEnd(e) {
      let date = e.detail
      let filters = this.data.filters
      filters.endReceiveTime = this.formatDate(date)
      this.setData({
        filters: filters
      })
      this.closeEndTime()
    },
    // 展示时间弹窗
    bindStartShow() {
      this.setData({
        showStartTime: true
      })
    },
    bindEndShow() {
      this.setData({
        showEndTime: true
      })
    },
    // 关闭时间弹窗
    closeStartTime() {
      this.setData({
        showStartTime: false
      })
    },
    closeEndTime() {
      this.setData({
        showEndTime: false
      })
    },
    //关闭筛选弹窗
    onCloseMenu() {
      this.selectComponent('#item').toggle();
    },
    //支付方式
    changeOrder(e) {
      let filters = this.data.filters
      filters.keyWords = e.detail
      this.setData({
        filters: filters
      })
    },
    // 重置
    resetBtn() {
      let filters = this.data.filters
      filters.keyWords = ""
      filters.startReceiveTime = null,
      filters.endReceiveTime = null
      this.setData({
        filterOrderValue: null,
        filterTailValue: null,
        filters: filters,
        currentDate: new Date().getTime(),
      })
    },
    //确定
    okBtn() {
      if(this.data.filters.endReceiveTime==null||this.data.filters.startReceiveTime==null){
        wx.showToast({
          title: '起始时间或结束时间不能为空',
          icon: 'none',
          duration: 1000
        })
        return false
      }
      if(this.data.filters.endReceiveTime>=this.data.filters.startReceiveTime){
        this.selectComponent('#item').toggle();
      }else{
        wx.showToast({
          title: '起始时间需早于结束时间',
          icon: 'none',
          duration: 1000
        })
      }
    },
    removedata() {
      let that = this;
      let filters = that.data.filters
      filters.keyWords = ""
      filters.keyWords = null, // 关键字
      // filters.startReceiveTime = null,
      // filters.endReceiveTime = null
      that.setData({
        filterOrderValue: null,
        filterTailValue: null,
        filters: filters,
        showStartTime: false
      })
    },
    setOriginalData() {
      let filters = this.data.filters
      filters.startReceiveTime = this.getFirstDate()
      filters.endReceiveTime = this.getLastDate()
      this.setData({
        filters: filters,
        allTypeList: getPatternOfPayment(),
        receiveDirection: getDirectionOfReceive()
      })
    },
  },

  observers: {
    'filters.**': function (field) {
      this.triggerEvent('getfiltratedata', field, )
    },
  },
})