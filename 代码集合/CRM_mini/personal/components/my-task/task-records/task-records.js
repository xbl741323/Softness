// personal/components/my-clue/order-records/order-records.js
import {
  getTaskOrderType,
  getOrderStatus,
  getWaitOrderStatus,
  getTailStatus,
  getWaitTailStatus,

} from "../../../../utils/order/order"
import {
  getTaskList,
  taskStatusStatistical,
  getTmPartnerOption,
}
from "../../../../utils/api/mytask.js"
import * as CodeMsg from "../../../../utils/common/codeMsg";
Component({
  lifetimes: {
    attached: function () {
      this.setOriginalData()
      this.setStatus()
    },
  },
  /**
   * 组件的属性列表
   */

  properties: {
    clueIdscreen: {
      type: Array
    },
    highSeasType: {
      type: Number
    },
    clueInfo: {
      type: Object
    },


    isPerson: {
      type: Boolean //引用来源 true-我的线索 false-客户查询
    }
  },


  /**
   * 组件的初始数据
   */
  data: {
    partnerId: null,
    PartnerName: null,
    indexPicker: 0,
    PartnerList: [],
    PartnerOptionList: [],
    mainActiveIndex: 0,
    activeId: [],
    max: 1,
    filterObj: {},
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
      partnerId: null,
      orderType: 0,
      allType: null,
      choiceType: "筛选",
      keyWords: "",
      orderStatus: null,
      tailStatus: null,
      startTime: null,
      endTime: null,
      clueSalesman: ''
    },
    orderTypeList: [{
      text: '全部类型',
      value: 0
    }, {
      text: '项目申报',
      value: 1
    }, {
      text: '知识产权',
      value: 2
    }, ],
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
    showPartner: false,
    show: true,
    textList: {
      text: '全部进度',
      id: null
    },
    mainActive: [],
    stateText: null,
    categoryIdKey: null,
    finishLabel: ''

  },
  /**
   * 组件的方法列表
   */
  methods: {
    onClickNav({
      detail = {}
    }) {
      this.setData({
        mainActive: []
      })
      this.setData({
        mainActiveIndex: detail.index || 0,
      })
      if (this.data.mainActiveIndex != 2 && this.data.mainActiveIndex != 4) {
        this.selectComponent('#upopo').toggle();
        let arr = this.data.allTypeList.filter((item, index) => {
          return index == detail.index
        })
        this.setData({
          textList: arr[0],
          activeId: null,
          stateText: null
        })
        this.getList();
      } else {
        let arr = this.data.allTypeList.filter((item, index) => {
          return index == detail.index
        })
        this.setData({
          mainActive: arr
        })
      }
    },
    onClickItem({
      detail = {}
    }) {
      this.setData({
        finishLabel: '',
      })
      // console.log(detail);
      // const index = activeId.indexOf(detail.id);
      // if (index > -1) {
      //   activeId.splice(index, 1);
      // } else {
      //   activeId.push(detail.id);
      // } 
      const activeId = this.data.activeId === 0 ? this.data.activeId : detail[detail.length - 1];
      if (this.data.mainActiveIndex == 5) {
        this.setData({
          finishLabel: filtersData(detail),
          mainActive: detail,
          activeId,
        })
      } else {
        this.setData({
          stateText: detail.text,
          activeId,
          textList: detail
        });
      }
      this.selectComponent('#upopo').toggle();
      this.getList();
    },
    onChange(event) {
      this.setData({
        indexPicker: event.detail.index
      })
    },
    onCancel() {
      this.setData({
        showPartner: false
      })
    },
    onConfirm() {
      let PartnerName = this.data.PartnerOptionList[this.data.indexPicker].partnerName
      let partnerId = this.data.PartnerOptionList[this.data.indexPicker].partnerId
      this.setData({
        partnerId: partnerId,
        PartnerName: PartnerName,
        showPartner: false
      })
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
      filters.startTime = this.formatDate(date)
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
    bindtaskShow() {
      getTmPartnerOption().then(res => {
        if (res.code == CodeMsg.CODE_0) {
          this.setData({
            PartnerOptionList: res.data,
            PartnerList: res.data.map(item => {
              return item.partnerName
            }),
            showPartner: true
          })
        }
      })

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
    closeEndTime() {
      this.setData({
        showEndTime: false
      })
    },
    // 关闭时间弹窗
    closeStartTime() {
      this.setData({
        showStartTime: false
      })
    },

    //关闭筛选弹窗
    onCloseMenu() {
      this.selectComponent('#item').toggle();
    },
    //修改产品订单
    changeOrder(e) {
      let num = e.detail
      if (num == 1) {
        this.data.categoryIdKey = 1
      } else if (num == 2) {
        this.data.categoryIdKey = [3, 4, 5, 6]
      }
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
    },
    //修改关键字
    changeInputName(e) {
      let filters = this.data.filters
      filters.clueSalesman = e.detail.value.trim()
      this.setData({
        filters: filters
      })
    },
    //修改订单状态
    changeOrderStatus(e) {
      let item = e.currentTarget.dataset.item
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
      filters.clueSalesman = ''
      filters.startTime = null,
        filters.endTime = null,
        this.setData({
          filterOrderValue: null,
          filterTailValue: null,
          filters: filters,
          currentDate: new Date().getTime(),
          partnerId: null,
          PartnerName: null,
        })
      this.getList();
      // this.selectComponent('#item').toggle();
    },
    //确定
    okBtn() {
      this.selectComponent('#item').toggle();
      setTimeout(() => {
        this.getList();
      }, 0)
    },
    filtersData(val) {
      if (val == 1) {
        return {
          state: '',
          text: ''
        }
      } else if (val == 2) {
        return {
          state: 'A',
          text: '完成'
        }
      } else if (val == 3) {
        return {
          state: 'B',
          text: '通过'
        }
      } else {
        return {
          state: 'C',
          text: '未通过'
        }

      }
    },
    filtersValue(val) {
      return val == 1 ? 0 : val == 2 ? 1 : val == 3 ? -1 : val == 4 ? 2 : val == 5 ? -2 : null
    },
    //获取列表数据
    getList() {
      let params = {
        partnerId: this.data.partnerId,
        finishLabel: this.data.finishLabel.text,
        finishType: this.data.finishLabel.state,
        keyWord: this.data.filters.keyWords,
        startTime: this.data.filters.startTime == null ?
          "" : this.data.filters.startTime,
        endTime: this.data.filters.endTime == null ?
          "" : this.data.filters.endTime,
        orderStatus: this.data.filterOrderValue,
        tailStatus: this.data.filterTailValue,
        clueSalesmanEmpInfo: this.data.filters.clueSalesman,
        stepName: this.data.stateText,
        listType: "personal",
        taskStatus: this.filtersValue(this.data.mainActiveIndex)
      }
      if (this.data.filters.orderType == 1) {
        params.categoryId = this.data.categoryIdKey
      } else if (this.data.filters.orderType == 2) {
        params.categoryIds = this.data.categoryIdKey
      } else if (this.data.mainActive.length > 0 && [0] && this.data.mainActive[0].text == "已完成") {
        if (this.data.textList.id == 1) {
          params.showStatus = 1
          params.stepName = null
          delete params.orderStatus
        } else {
          params.finishLabel = this.filtersData(this.data.textList.id).text,
            params.finishType = this.filtersData(this.data.textList.id).state
          params.stepName = null
        }
      }
      this.triggerEvent('filtrate', params)
    },
    // 
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
      let list = []
      getTaskList().then(res => {
        if (res.code == 0) {
          res.data.forEach((item, index) => {
            list.push({
              text: item.stepName,
              id: index
            })
          })
          let arr = []
          getTaskOrderType().forEach(items => {
            if (items.id == 1) {
              items.children = list
            }
            arr.push(items)
          })
          let data = {
            listType: 'personal'
          }
          taskStatusStatistical(data).then(res => {
            if (res.code == 0) {
              arr.forEach(item => {
                if (item.id == 0) {
                  item.text = `${item.text}(${res.data.waitStartCount})`
                }
                if (item.id == 1) {
                  item.text = `${item.text}(${res.data.inUseCount })`
                }
                if (item.id == -1) {
                  item.text = `${item.text}(${res.data.suspendCount})`
                }
              })
              let filters = this.data.filters
              let clueIdList = this.data.clueIdList
              this.setData({
                filters: filters,
                allTypeList: arr,
                clueIdList: this.properties.clueIdscreen
              })
            }
          })
        }
      })
    }
  }
})