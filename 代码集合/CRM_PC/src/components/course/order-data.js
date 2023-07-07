//订单数据处理
import {courseOrder,courseOrderDetail,courseOrderStatus} from '@/api/course/index';
import {getPersoanlOrder} from '@/api/order/index';
const infoData = [
  {value: 1, label: '主体名称'},
  {value: 2, label: '联系方式'},
  {value: 3, label: '下单来源'},
  {value: 4, label: '下单时间'},
  {value: 5, label: '课程名称'},
  {value: 6, label: '课程单价'},
  {value: 7, label: '第三方费用'},
  {value: 8, label: '订单金额'},
  {value: 9, label: '有效时间'},
]

const professionList = [
    { id: 0, categoryName: "项目申报" },
    { id: 1, categoryName: "知识产权" },
    { id: 2, categoryName: "工商注册" },
    { id: 3, categoryName: "财税服务" },
    { id: 4, categoryName: "融资上市" },
    { id: 5, categoryName: "法律服务" },
    { id: 6, categoryName: "软件开发" }
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

function filterOrderStatus(value){
  return value == 0 ? '待付款':value == 1 ? '待付款':value == 2 ? '已付款' : value == 4 ? '已取消': value == 3 ? '已删除' :''
}

function filterPayStatus(value){
  return value == 0 ? '待付款':value == 1 ? '支付中': value == 2 ? '支付成功' : value == 3 ? '支付失败': value == 4 ? '取消支付' :''
}

function filterTradingThirdFee(value){
  return value !== null && value !== 0 ? value : '无'
}

function feeType(value){
  return value == 0 ? '课程单价':value == 1 ? '第三方费用' : ''
}

export function getSummaries(param,amount) {//产品价格合计
  const { columns } = param;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
  const sums = [];
  columns.forEach((column, index) => {
    column.fontSize = 550
    if (index === 0) {
      sums[index] = '合计';
      return;
    }
  });
  if(amount){
    if(amount.totalReceiveAmount == null){
      sums[2] = '';
    }else{
      sums[2] = (amount.totalReceiveAmount).toFixed(2);
    }
  }
  return sums;
}

function getCourseList(obj){
  return courseOrder(obj).then(res=>{
      return res.data;
  }).catch((error)=>{
      return error;
  });
}

function getVipOrderList(obj){
  return getPersoanlOrder(obj).then(res=>{
      return res.data;
  }).catch((error)=>{
      return error;
  });
}

function getCourseDetail(id,source){
  return courseOrderDetail(id,source).then(res=>{
      return res.data;
  }).catch((error)=>{
      return error;
  });
}

function getOrderStatus(){
  return courseOrderStatus().then(res=>{
      return res.data;
  }).catch((error)=>{
      return error;
  });
}


export default {
  infoData,
  professionList,
  wherePlat,
  payAmount,
  payType,
  filterOrderStatus,
  filterPayStatus,
  filterTradingThirdFee,
  feeType,
  getSummaries,
  getCourseList,
  getCourseDetail,
  getOrderStatus,
  getVipOrderList
}