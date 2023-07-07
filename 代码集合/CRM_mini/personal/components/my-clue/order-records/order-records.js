// personal/components/my-clue/order-records/order-records.js
import {
  getOrderType,
  getOrderStatus,
  getWaitOrderStatus,
  getOrderTypePartner,
  getTailStatus,
  getWaitTailStatus
} from "../../../../utils/order/order"
import {
  getClueOrderRecords
} from "../../../../utils/api/order"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    clueId: {
      type: Number
    },
    clueType: {
      type: Number
    },
    userId: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {},
    reachStatus: false,
    clueIdList: [],
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
    filterOrderValue: null,
    filterTailValue: null,
    orderList: [],
    total: 0,
    page: {
      pageNo: 1,
      pageSize: 20,
    },
    filters: {
      orderType: 0,
      allType: null,
      choiceType: "筛选",
      keyWords: "",
      orderStatus: null,
      tailStatus: null,
      createTime: null,
      endTime: null,
    },
    orderTypeList: [{
        text: '产品订单',
        value: 0
      },
      {
        text: '待生效订单',
        value: 1
      },
    ],
    orderTypeNewList: [{
      text: '产品订单',
      value: 0
    }],
    allTypeList: [],
    statusList: [], // （0：待付款；1待签约；2：待开始；3：进行中；4：已完成；5：已关闭；6：已取消；）
    tatusList: [], // （0：待定；1：待付款；2：已结清；3：无）
    choiceList: [{
      text: '筛选',
      value: null
    }, ],
    testText: "",
    date: "",
    showStartTime: false,
    showEndTime: false,
    show: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 触底加载
    getReachList() {
      console.log('dsdsds')
      let orderList = this.data.orderList
      let total = this.data.total
      let page = this.data.page
      if (orderList.length < total) {
        page.pageNo = page.pageNo + 1
        this.setData({
          reachStatus: true,
          page: page
        })
        this.getList()
      }
    },
    refresh() {},
    // 时间格式操作
    formatDate(date) {
      date = new Date(date);
      let year = date.getFullYear()
      let month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let day = String(date.getDate()).length == 1 ? '0' + date.getDate() : date.getDate()
      return `${year}-${month}-${day} 00:00:00`;
    },
    onConfirmStart(e) {
      let date = e.detail
      let filters = this.data.filters
      filters.createTime = this.formatDate(date)
      this.setData({
        filters: filters
      })
      this.closeStartTime()
    },
    onConfirmEnd(e) {
      let date = e.detail
      let filters = this.data.filters
      filters.endTime = this.formatDate(date)
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
    //修改产品订单
    changeOrder(e) {
      console.log(e.detail);
      let filters = this.data.filters
      filters.orderType = e.detail
      this.setData({
        filters: filters
      })
      this.getList()
      this.setStatus()
    },
    // 修改订单类型
    changeAllType(e) {
      let filters = this.data.filters
      filters.allType = e.detail
      this.setData({
        filters: filters
      })
      this.getList();
    },
    //修改关键字
    changeInput(e) {
      let filters = this.data.filters
      filters.keyWords = e.detail.value.trim()
      this.setData({
        filters: filters
      })
      console.log(this.data.filters)
    },
    //修改订单状态
    changeOrderStatus(e) {
      let item = e.currentTarget.dataset.item
      console.log("uew9hfui8", item)
      this.setData({
        filterOrderValue: item.value
      })
    },
    //修改尾款状态
    changeTailStatus(e) {
      let item = e.currentTarget.dataset.item
      this.setData({
        filterTailValue: item.value
      })
    },
    // 重置
    resetBtn() {
      let filters = this.data.filters
      filters.keyWords = ""
      filters.createTime = null,
        filters.endTime = null
      this.setData({
        filterOrderValue: null,
        filterTailValue: null,
        filters: filters,
        currentDate: new Date().getTime(),
      })
      this.getList();
      // this.selectComponent('#item').toggle();
    },
    //确定
    okBtn() {
      this.getList();
      this.selectComponent('#item').toggle();
      let that = this;
      setTimeout(function () {
        let filters = that.data.filters
        filters.keyWords = ""
        filters.createTime = null,
          filters.endTime = null

        that.setData({
          filterOrderValue: null,
          filterTailValue: null,
          filters: filters
        })
      }, 500)
    },
    //获取列表数据
    getList() {
      let filters = this.data.filters
      let params = {
        keyWord: this.data.filters.keyWords,
        startTime: this.data.filters.createTime == null ?
          "" : this.data.filters.createTime,
        endTime: this.data.filters.endTime == null ?
          "" : this.data.filters.endTime,
        orderStatus: this.data.filterOrderValue,
        tailStatus: this.data.filterTailValue,
        pageNo: this.data.page.pageNo,
        pageSize: this.data.page.pageSize,
        clueIdList: [this.data.clueId],
        clueType: parseInt(this.data.clueType),
        userId: this.data.userId
      }
      if (this.data.userId) {
        params.clueIdList = []
        params.clueType = null
      } else {
        params.userId = null
      }
      if (this.data.filters.allType == 2) {
        params.categoryIds = [3, 4, 5, 6]
      } else {
        params.categoryId = this.data.filters.allType
      }
      getClueOrderRecords(params, filters.orderType).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          let r = res.data
          let orderList = this.data.orderList
          let reachStatus = this.data.reachStatus
          this.setData({
            orderList: reachStatus == true ? orderList.concat(r.records) : r.records,
            reachStatus: false,
            total: r.total,
          })
        }
      })
    },
    // 设置订单状态
    setStatus() {
      let filters = this.data.filters
      this.setData({
        statusList: filters.orderType == 0 ? getOrderStatus() : getWaitOrderStatus(),
        tatusList: filters.orderType == 0 ? getTailStatus() : getWaitTailStatus(),
      })
    },
    //设置原始数据
    setOriginalData() {
      let filters = this.data.filters
      let clueIdList = this.data.clueIdList
      this.setData({
        filters: filters,
        allTypeList: !this.data.userInfo.isPartner ? getOrderType() : getOrderTypePartner(),
        clueIdList: [this.data.clueId]
      })
    }
  },
  lifetimes: {
    attached: function () {
      this.setData({
        userInfo: wx.getStorageSync('userInfo')
      })
      this.setOriginalData()
      this.setStatus()
    },
  },
})