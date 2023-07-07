// personal/components/my-user/clue-info/clue-info.js
import {
  getFinanceInfo
} from "../../../../utils/api/clue"
import {
  filterLastYearSale,
  filterEmployeesNum,
} from "../../../../utils/clue/clue"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    clueInfo: {
      type: Object
    },
    clueType: {
      type: Number
    },
    transInfo: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    yearsList: [],
    currentYear: '',
    financeInfo: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindYearChange(e){
      this.setData({
        currentYear: this.data.yearsList[e.detail.value].year
      })
      this.getFinance();
    },
    getFinance(){
      this.setData({
        financeInfo: {}
      })
      getFinanceInfo({clueId: this.data.clueInfo.clueCompanyId, year: this.data.currentYear}).then(res=>{
        res.data.lastYearSale = filterLastYearSale(res.data.lastYearSale)
        res.data.lastYearAssets = filterLastYearSale(res.data.lastYearAssets)
        res.data.lastYearProfit = filterLastYearSale(res.data.lastYearProfit)
        res.data.lastYearDevExpenses = filterLastYearSale(res.data.lastYearDevExpenses)
        res.data.unitEmployees = filterEmployeesNum(res.data.unitEmployees)
        this.setData({
          financeInfo: res.data || {}
        })
      })
    },
    /* 
    查看营业执照
    */
    viewLicense(e){
      let url = e.currentTarget.dataset.url;
      let fileType = url.slice(url.lastIndexOf('.') + 1);
      if(fileType == 'pdf'){
        wx.showLoading({
          title: '加载中...',
        })
        wx.downloadFile({
          url: url,
          success: function (res) {
            var filePath = res.tempFilePath;
            wx.openDocument({
              filePath: filePath,
              fileType: `${fileType}`,
              showMenu: true,
              success: () => {
                wx.hideLoading({
                  success: (res) => {},
                })
              }
            })
          }
        })
      }else{
        wx.previewImage({
          urls: [url],
        })
      }
    },
    // 打电话
    phoneCall(e) {
      let phone = e.currentTarget.dataset.phone
      wx.makePhoneCall({
        phoneNumber: phone,
      })
    }
  },
  lifetimes: {
    attached: function () {
      let year = new Date().getFullYear();
      let yearsList = [];
      yearsList.push(
        { year: parseInt(year-1), name:'-'+parseInt(year-1)+'年度' },
        { year: parseInt(year-2), name:'-'+parseInt(year-2)+'年度' },
        { year: parseInt(year-3), name:'-'+parseInt(year-3)+'年度'},
      )
      this.setData({
        yearsList: yearsList,
        currentYear: parseInt(year-1)
      })
      wx.nextTick(()=>{
        this.getFinance();
      })
    }
  }
})