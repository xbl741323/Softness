//订单数据处理
import { getVipOrder,getVipOrderDetail } from "@/api/member/index";

const infoData = [
  {value: 1, label: '主体名称'},
  {value: 2, label: '联系方式'},
  {value: 3, label: '下单来源'},
  {value: 4, label: '下单时间'},
  {value: 5, label: '有效期至'},
  {value: 6, label: '会员名称'},
  {value: 7, label: '订单价格'},
]
const proTypeData = [
  {value: 1, label: '项目申报'},
  {value: 2, label: '知识产权'},
  {value: 3, label: '专利'},
  {value: 4, label: '版权'},
  {value: 5, label: '商标'},
  {value: 6, label: '其他'},
  {value: 7, label: '工商注册'},
  {value: 8, label: '财税服务'},
  {value: 9, label: '融资上市'},
  {value: 10, label: '法律服务'},
  {value: 11, label: '软件开发'}
]
const orderTypeData = [
    {value: null, label: '全部'},  
    {value: 1, label: '项目申报'},
    {value: 2, label: '知识产权'},
    {value: 7, label: '工商注册'},
    {value: 8, label: '财税服务'},
    {value: 9, label: '融资上市'},
    {value: 10, label: '法律服务'},
    {value: 11, label: '软件开发'},
]

const orderTypeNewData = [
  {value: 1, label: '项目申报'},
  {value: 2, label: '知识产权'},
  {value: 7, label: '工商财税'},
  {value: 9, label: '融资上市'},
  {value: 10, label: '法律服务'},
  {value: 11, label: '软件开发'},
]

const timeStatus = [
  {value: null, label: '全部'},
  {value: 4, label: '待付款'},
  {value: 1, label: '已生效'},
  {value: 2, label: '待生效'},
  {value: 3, label: '已到期'}
]

const payStatus = [
  // {0待付款 1支付中 2支付成功  3支付失败 4取消支付}
]
function wherePlat(value){
  return value == 'APPLET' ? '小程序': value == 'PC' ? 'PC端' : value == 'H5' ? '移动端' : value == 'APP' ? '移动端' :''
}

function payAmount(value){
  return value == null ? '无' : value.toFixed(2);
}

function payType(value){
  return value == 0 ? '支付宝':value == 1 ? '对公转账' : value == 2 ? '微信' :''
}

function getOrderList(params){
  return getVipOrder(params).then(res=>{
    return res.data;
  }).catch((error)=>{
    return error;
  });
}

function getOrderDetail(id,bool){
  return getVipOrderDetail(id ,bool).then(res=>{
    return res.data;
  }).catch((error)=>{
    return error;
  });
}

// //产品价格合计
function getSummaries({ columns },data) {
  const sums = [];
  columns.forEach((item, index) => {
    item.fontSize = 550
    if (index === 0) {
      sums[index] = '合计';
      return;
    }
  });
  if(data){
    if(data.totalReceiveAmount == null){
      sums[2] = '待定';
    }else{
      sums[2] = (data.totalReceiveAmount).toFixed(2);
    }
  }
  return sums;
}

export default {
  infoData,
  timeStatus,
  proTypeData,
  orderTypeData,
  orderTypeNewData,
  wherePlat,
  payAmount,
  payType,
  getOrderList,
  getOrderDetail,
  getSummaries
}