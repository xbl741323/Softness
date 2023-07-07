// personal/pages/my-process/detail/refund/index.js
var handles = require('../../../../../utils/common/handles')
import {getDetailInfoByRefundId,getRefundTaskByRefundId,getRefundFeeByRefundId,auditLog} from '../../../../../utils/api/refund'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refundId: null,
    detailData:null,
    taskData: null,
    refundFeeData: null,
    logList: null
  },
 
  //获取退款信息
  getRefundData(){
    let id = this.data.refundId;
    //基本信息
    getDetailInfoByRefundId(id).then(res=>{
      if(res.code == 0){
        let data = handles.splitList(res.data.ttOrderFeeVoList,'payType');
        res.data.doubleUniqueArr = res.data.ttRefundFeeList.length> 0 ? handles.doubleUniqueArr(res.data.ttRefundFeeList,'costTypeId','payTypeId') : null;
        let arr = res.data;
        arr.newPayTypeList = data;
        this.setData({
          detailData: arr
        });
        console.log(arr,'ppp');
      }
    });
    //退款费用信息
    getRefundFeeByRefundId(id).then(res=>{
      if(res.code == 0){
        let data = handles.splitList(res.data,'payTypeId');
        let newArr = [];
        data.forEach(item => {
          item[0].costTypes = item.map(item => item.costTypeId);
          item[0].refundAmounts = item.map(item => item.refundAmount).reduce((p,c) => p + c) || null;
          item.new = handles.uniqueArr(item,'payTypeId');
          newArr.push(item.new)
        })
        console.log(newArr);
        this.setData({
          refundFeeData: newArr
        })
      }
    });
    //任务信息
    getRefundTaskByRefundId(id).then(res=>{
      if(res.code == 0){
        this.setData({
          taskData: res.data
        })
      }
    });
    //审核记录信息
    let para = {
      type: 4,
      taskId: id
    };
    auditLog(para).then(res=>{
      if(res.code == 0){
        this.setData({
          logList: Object.values(res.data).map(item => Object.values(item)[0])
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      refundId: options.id
    })
    console.log(options);
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
    this.getRefundData();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})