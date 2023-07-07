// personal/pages/buyRecord/record.js
const app = getApp();
import { pageVipOrder } from "../../../utils/api/vip"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize: 10,
    pageNo:1,
    list:[],
    total: '',
    noMore: false,
    dataStatus: true,
  },
  getRecord(){
    this.setData({
      dataStatus : false
    })
    let para={
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
      orderStatus: 2
    }
    pageVipOrder(para).then(res=>{
      this.setData({
        total: res.data.total
      });
      let list = [...this.data.list, ...res.data.records];
      this.filterData(list);
    })
  },
  filterData(data){
      data.forEach(item=>{
      let end = new Date(item.validEnd);
      let start = new Date(item.validStart);
      console.log(Date.now(),'now');
      console.log(start.getTime(),'start');
      console.log(end.getTime() + 24 * 60 * 60 * 1000 - 1,'end');
      if( Date.now() < end.getTime() + 24 * 60 * 60 * 1000 - 1 ){
        if( Date.now() < start.getTime() ) {
          item.aging = 'wait'
        } else {
          item.aging = 'active'
        }
      } else {
          item.aging = 'overdue'
      }
    });
    this.setData({
      list: data
    });
    setTimeout(()=>{
      this.setData({
        dataStatus:true,
      })
    },500)    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getRecord();
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
    if(this.data.list.length==0&&this.data.dataStatus) return this.getRecord();  //list.length==0防止锁屏导致列表再加载
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
    if(this.data.pageNo*this.data.pageSize >= this.data.total) return this.setData({
      noMore: true
    });
    this.setData({
      pageNo:this.data.pageNo+1,
    });
    this.getRecord()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})