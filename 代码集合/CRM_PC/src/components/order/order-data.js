//订单数据处理
import  { Message }  from "element-ui";
// import * as CodeMsg from "@/api/common/CodeChange"
import { getStatistical, getPersonalStatistical, getOrder, getPersonalOrder, getDetail, getPersonalDetail, updateNoteById, updateStatusById, checkRefundReceive,getOnlineDetail } from "@/api/order/index";


let infoList = [
  {value:0, key: 'spuName', label:'产品名称', showStatus: true},
  {value:1, key: 'spec', label:'规格属性', showStatus: true},
  {value:2, key: 'buyNum', label:'数量', showStatus: true},
  {value:3, key: 'orderSource', label:'下单端口', showStatus: true},
  {value:4, key: 'thirdOrderNo', label:'电商订单编号', showStatus: true},
  // {value:5, key: 'productName', label:'代理费总价', showStatus: true},
  // {value:6, key: 'productName', label:'第三方费用总价', showStatus: true},
  // {value:7, key: 'productName', label:'官费总价', showStatus: true},
  // {value:8, key: 'productName', label:'订单总价', showStatus: true},
  // {value:9, key: 'productName', label:'退款金额', showStatus: true},
  {value:10, key: 'subjectName', label:'主体名称', showStatus: true},
  {value:11, key: 'contactName', label:'联系人', showStatus: true},
  {value:12, key: 'signName', label:'签约人', showStatus: true},
  {value:13, key: 'contractTime', label:'签约时间', showStatus: true},
  {value:14, key: 'contractFileName', label:'合同附件', showStatus: true},
]
const clueInfo = [ //发起订单线索信息
  { value: 0, label:'线索编号', key:'clueNo', show: [0,1]},
  { value: 1, label:'线索名称', key:'companyName', show: [0,1]},
  { value: 2, label:'信用代码', key:'organization', show: [1]},
  { value: 3, label:'联系人', key:'contactName', show: [1]},
  { value: 4, label:'身份证号码', key:'idCard', show: [0]},
  { value: 5, label:'手机号', key:'mobile', show: [0,1]},
  { value: 6, label:'线索归属', key:'clueAttributionEmpName', show: [0,1]},
  { value: 7, label:'业务员', key:'clueSalesmanEmpName', show: [0,1]},
]

const infoData = [
  {value: 6, label: '产品名称'},
  {value: 7, label: '数量(件)'},
  {value: 3, label: '代理费总价(元)'},
  {value: 4, label: '第三方费用总价(元)'},
  {value: 5, label: '官费总价(元)'},
  {value: 2, label: '交付时间'},
  {value: 0, label: '客户名称'},
  {value: 1, label: '线索编号'},
  {value: 8, label: '订单总价(元)'},
  {value: 9, label: '回款金额(元)'},
  {value: 10, label: '尾款金额(元)'},
  {value: 11, label: '退款金额(元)'},
]

const initOrderStatusList = [
  {value: null, label:'全部'},
  // {value: -1, label:'未生效'},
  // {value: -3, label:'已失效'},
  {value: -2, label:'草稿'},
  {value: -4, label:'待审核'},
  {value: -5, label:'未通过'},
]
// const onlineinfoData = [
//   {value: 6, label: '产品名称'},
//   {value: 7, label: '数量(件)'},
//   {value: 0, label: '用户名称'},
//   {value: 1, label: '用户ID'},
//   {value:11,label:'联系方式'},
//   {value: 2, label: '交付时间'},
//   {value: 3, label: '代理费总价(元)'},
//   {value: 4, label: '第三方费用总价(元)'},
//   {value: 5, label: '官费总价(元)'},
//   {value: 8, label: '订单总价(元)'},
//   {value: 9, label: '退款金额(元)'},
//   {value: 10, label: '下单来源'},
//   {value:12,label:'定金'},
//   {value:13,label:'尾款'},
//   {value:14,label:'合同附件'},
// ]

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
const statusList = [
  // （0：待付款；1待签约；2：待开始；3：进行中；4：已完成；5：已关闭；6：已取消；）
  {value:null,label:'全部'},
  {value:0,label:'待付款'},
  {value:1,label:'待签约-纸质'},
  {value:-1,label:'待签约-电子'},
  {value:2,label:'待开始'},
  {value:3,label:'进行中'},
  {value:4,label:'已完成'},
  {value:5,label:'已关闭'},
  {value:6,label:'已取消'},
  {value:7,label:'已删除'},
]
const documentOrderStatus = [
  {value: null, label: '全部'},
  {value: 0, label: '待付款'},
  {value: 1, label: '已完成'},
  {value: 2, label: '已取消'},
  {value: 3, label: '已删除'}
]
const finalStatusList = [
  // （0：待定；1：待付款；2：已结清；3：无）	
  {value:null,label:'全部'},
  {value:0,label:'待定'},
  {value:1,label:'待付款'},
  {value:2,label:'已结清'},
  {value:3,label:'无'},
]

const initPayType = [
  {value: 2, label: '一口价'},
  {value: 1, label: '定金+尾款'},
]

const orderStatus = [
  {value: 0, label: '全部'},
  {value: 1, label: '待分配'},
  {value: 2, label: '待开始'},
  {value: 3, label: '进行中'},
  {value: 4, label: '冻结中'},
  {value: 5, label: '已完成'},
  {value: 6, label: '已关闭'},
]

const filterpropertyList = [
  {value: 2, label: '全部'},
  {value: 3, label: '专利'},
  {value: 4, label: '商标'},
  {value: 5, label: '版权'},
  {value: 6, label: '其他'}
]

const refundReasonList = [
  {
    title:'下错单了',
    val:1
  },{
    title:'付款金额错误',
    val:2
  },{
    title:'付款方式错误',
    val:3
  },{
    title:'服务终止',
    val:4
  },{
    title:'其他',
    val:5
  }
]

const filterLatestMoneyList = [
  {value: null, label: '全部'},
  {value: '0', label: '待付款'},
  {value: '1', label: '已结清'},
]

const feeTypes = [
  {value:0, label: '代理費'},
  {value:2, label: '官費'},
  {value:1, label: '第三方費用'},
]

const payStatusList = [
  {value: 0, label: '全部'},
  {value: 1, label: '有尾款'},
  {value: 2, label: '已结清'},
]

export function tailStatus(val) {
  return val == 3 ? '一口价' : '定金尾款';
}

export function transformOrderStatus(value){
  return value == 1 ? '待分配' : value == 0 ? '待开始' : value == 2 ? '进行中' : value == 3 ? '已暂停' : value == 4 ? '已完成' : value == 5 ? '已关闭' : value == -1 ? '未生效' : value == -2 ? '草稿' :'未知'
}

export function onlinetransformOrderStatus(value){
  return value == 1 ? '待签约' : value == 0 ? '待付款' : value == 2 ? '待开始' : value == 3 ? '进行中' : value == 4 ? '已完成' : value == 5 ? '已关闭' : value == 6 ? '已取消' : '';
}
 
export function wherePlat(value){
    return value == 1 ? '移动端' : value == 2 ? '小程序' : value == 3 ? 'App' : value == 0 ? 'PC端' :''
  }

function initOrderStatus(value) {
  return value == -5 ? '未通过' : value == -4 ? '待审核' : value == -3 ? '已失效':  value == -2 ? '草稿' : value == -1 ? '未生效' : value == 0 ? '待付款' : value == 1 ? '待签约' : value == 2 ? '待开始' : value == 3 ? '进行中' : value == 4 ? '已完成' : value == 5 ? '已关闭' : value == 6 ? '已取消' : '未知'
}

export function documentOrderStatusFilter(value){
  return value == 0 ? '待付款' : value == 1 ? '已完成' : value == 2 ? '已取消': value == 3 ? '已删除' : '未知';
}

export function documentPayChannel(value){
  return value == 0 ? '支付宝' : value == 1 ? '对公转账' : value == 2 ? '微信' : '未知';
}

export function documentPayStatus(value){
  return value == 0 ? '待付款' : value == 1 ? '待付款' : value == 2 ? '已完成': value == 3 ? '支付失败' : '未知';
}

export function totalAmount(value){
  return value == null ? '待定' : (value/100).toFixed(2);
}

export function refundState(value){
  return value == 0 ? '待审核' : value == 1 ? '已通过' : value == 2 ? '退款失败' : '未知';
}

export function tailAmount(value){
  return value == null ? '待定' : (value/100).toFixed(2);
}

export function refundAmount(value){
  return value == null ? '无' : (value/100).toFixed(2);
}

export function payAmount(value){
  return value == null ? '无' : (value/100).toFixed(2);
}

export function clueType(value){
  return value == 0 ? '个人' : value == 1 ? '单位' : '';
}

export function payType(value){
  return value == 0 ? '支付宝' : value == 1 ? '对公转账' : value == 2 ? '微信' : '未知';
}

export function paytailStatus(value){
  return value == 1 ? '已结清'  : value == 0 ? '待付款' :value== 4 ? '待付款' : '';
}

export function changePriceStatus(value){
  return value == 1 ? '改价审核中'  : value == 2 ? '改价已通过' :value== 3 ? '改价未通过' : '';
}

export function orderPort(value){
  return value == 'PC' ? '卧涛网' : value == 'APPLET' ? '小程序' : '';
}

export function refundStatus(value){
  switch (value) {
    case 1:
    case 2:
    case 3:
      return '退款审核中'
    case 4:
      return '退款已通过'
    case -1:
      return '退款已撤销'
    case -2:
      return '退款未通过'
    default:
      break;
  }
  // return value == 1 ? '退款审核中'  : value == 2 ? '退款已通过' :value== 3 ? '退款未通过' : '';
}

export function taskStatus(value){
  return value == 0 ? '待开始' : value == 1 ? '进行中' : value == 2 ? '已完成' : value == -1 ? '已暂停' : value == -2 ? '已关闭' : '';
}

//  订单状态orderStatus显示转换,6-待付款,9待签约
export function statusTransfer(value){
  return  '等待用户签约' ;
}


export function taskFinishType(val){
  if(val==1){
    return "已完成(通过)"
  }else if(val==2){
    return "已完成(未通过)"
  }else{
    return "已完成"
  }
}
export function getStatisticalData(orderType,source) {
  if(source == 'personal'){//获取我的订单数据统计
    return getPersonalStatistical(orderType).then(res=>{
      return res.data;
    }).catch(()=>{
      return error;
    });
  }else{//订单管理数据统计
    return getStatistical(orderType).then(res=>{
      return res.data;
    }).catch(()=>{
      return error;
    });
  }
}

export function checkReceive(){
  return checkRefundReceive().then(res=>{
    return res.data.code;
  })
}

export function getOrderList(param,source){
  if(source == 'personal'){
    return getPersonalOrder(param).then(res=>{
      return res.data;
    }).catch(()=>{
      return error;
    });
  }else{
    return getOrder(param).then(res=>{
      return res.data;
    }).catch(()=>{
      return error;
    });
  }
}

export function getOrderDetail(obj,source){
  if(source == 'personal'){
    return getPersonalDetail(obj).then(res=>{
      return res.data;
    }).catch((error)=>{
      return error;
    });
  }else{
    return getDetail(obj).then(res=>{
      return res.data;
    }).catch((error)=>{
      return error;
    });
  }
}

// 线上订单详情
export function getOnlineOrderDetail(obj,source,bool){
    return getOnlineDetail(obj,source,bool).then(res=>{
      return res.data;
    }).catch((error)=>{
      return error;
    });
}

export function updateNote(obj,message){
  return updateNoteById(obj).then(res=>{
    let type = '';
    let defaultMessage = res.data.msg || message; 
    if(res.data.code == CodeMsg.CODE_0 || res.data.code == CodeMsg.CODE_1){
      type = res.data.code == CodeMsg.CODE_0 ? 'success' : 'warning';
      Message({
        type: type,
        message: defaultMessage
      })
    }
    return res.data;
  }).catch(()=>{
    return error;
  })
}

export function updateOrderStatus(obj,url,message){
  return updateStatusById(obj,url).then(res=>{
    let type = '';
    let defaultMessage = res.data.msg || message; 
    if(res.data.code == CodeMsg.CODE_0 || res.data.code == CodeMsg.CODE_1){
      type = res.data.code == CodeMsg.CODE_0 ? 'success' : 'warning';
      Message({
        type: type,
        message: defaultMessage
      })
    }
    return res.data;
  }).catch(()=>{
    return error;
  })
}

export function test(obj){
  if(JSON.stringify(obj) && JSON.stringify(obj) != '{}'){
    sessionStorage.setItem('a', JSON.stringify(obj));
    return JSON.parse(sessionStorage.getItem('a'));
  }else{
    if(sessionStorage.getItem('a')){
      return JSON.parse(sessionStorage.getItem('a'));
    }else{
      return {};
    }
  }
}

export function getSummaries(param,amount) {//产品价格合计
  const { columns, data } = param;

  const sums = [];
  columns.forEach((column, index) => {
    column.fontSize = 550
    if (index === 0) {
      sums[index] = '合计';
      return;
    }
  });
  if(amount){
    if(amount.totalAmount == null){
      sums[3] = '待定';
    }else{
      sums[3] = (amount.totalAmount/100).toFixed(2);
    }
    if(amount.totalTailAmount == null){
      sums[5] = '待定';
    }else{
      sums[5] = (amount.totalTailAmount/100).toFixed(2);
    }
  }
  return sums;
}

export function getonlineSummaries(param,amount) {//产品价格合计
  const { columns } = param;
  const sums = [];
  if(amount){
    if(amount.totalAmount == null){
      sums[0] = '待定';
    }else{
      sums[0] = amount.totalAmount;
    }
  }
  return sums;
}
export function getInitSummaries(param,amount) {//产品价格合计
  const { columns } = param;
  const sums = [];
  if(amount){
    if(amount.totalAmount == null){
      sums[3] = '待定';
    }else{
      sums[3] = !amount.finalWaiting ? (amount.totalAmount).toFixed(2) : '待定';
    }
  }
  sums[0] = '合计';
  sums[2] = amount.buyNum;
  sums[1] = !amount.finalWaiting ? (amount.totalAmount / amount.buyNum) : '待定';
  return sums;
}

export function spanMethod({ row, rowIndex, column, columnIndex },obj,otherColumn){
  let depositNum = 0;
  let finalNum = 0;
  let depositIndex = []
  let finalIndex = []
  obj.orderFeeVoList.forEach((item, index) => {
    if(item.payType == 1 || item.payTypeId == 1){
      depositIndex.push(index)
      depositNum += 1;
    }else if(item.payType == 2 || item.payTypeId == 2){
      finalIndex.push(index)
      finalNum += 1;
    };
  });
  let index = otherColumn ? otherColumn : 4;
  if(columnIndex == index){//需要合并列
    if(obj.payType == 3){
      if( rowIndex == 0){
        return {
          rowspan: obj.orderFeeVoList.length,
          colspan: 1
        }
      }else{
        return {
          rowspan: 0,
          colspan: 0
        }
      };
    }else{
      if(row.payType == 1 || row.payTypeId ==1){
        if( rowIndex == depositIndex[0]){
          return {
            rowspan: depositNum,
            colspan: 1
          }
        }else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }else{
        if( rowIndex == finalIndex[0]){
          return {
            rowspan: finalNum,
            colspan: 1
          }
        }else{
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }else{
    // return {
    //   rowspan: 1,
    //   colspan: 1
    // }
  }
}

export default {
  infoData,
  // onlineinfoData,
  orderStatus,
  filterpropertyList,
  refundReasonList,
  filterLatestMoneyList,
  payStatusList,
  feeTypes,
  tailAmount,
  checkReceive,
  refundAmount,
  clueType,
  taskStatus,
  taskFinishType,
  transformOrderStatus,
  onlinetransformOrderStatus,
  wherePlat,
  paytailStatus,
  payType,
  refundState,
  documentOrderStatusFilter,
  documentPayChannel,
  documentPayStatus,
  totalAmount,
  payAmount,
  getStatisticalData,
  getOrderList,
  getOrderDetail,
  updateNote,
  test,
  getSummaries,
  getonlineSummaries,
  updateOrderStatus,
  getOnlineOrderDetail,
  statusTransfer,
  infoList,
  spanMethod,
  statusList,
  documentOrderStatus,
  finalStatusList,
  clueInfo,
  initOrderStatus,
  initPayType,
  initOrderStatusList,
  tailStatus,
  getInitSummaries,
  proTypeData,
  changePriceStatus,
  refundStatus,
  orderPort
}