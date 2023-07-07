// components/personal/submitOrder/projectInfo/projectInfo.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderInfo: {
      type: Object,
      value: {}
    },
    serviceFee: {
      type: Array,
      value: []
    },
    totalPriceList: {
      type: Array,
      value: []
    }
  },

  options: {
    addGlobalClass: true,  //采用全局样式
  },
  /**
   * 组件的初始数据
   */
  data: {
    videoControl: false,
    imageUrl: app.globalData.imageURL,
    totalSingle:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setCount(e) {
      let status = e.currentTarget.dataset.status
      this.triggerEvent('setCount', status)
    },
  },
  lifetimes:{
    attached(){
      setTimeout(()=>{
        console.log(this.data.serviceFee);
        console.log(this.data.orderInfo);
        let arr = this.data.serviceFee.map(obj => {return obj.value})
        let amount = arr.reduce((n,m) => n + m)
        this.setData({
          totalSingle: amount
        })
      },500)
    }
  }
})