import { getRefundDetail, refundRevoke } from '@/api/refund/index'
import * as CodeMsg from "@/api/common/CodeChange"
import  { Message, MessageBox }  from "element-ui";
const math = require('mathjs')

const refundInfoList = [
  {value: 0, label: '审核状态'},
  {value: 1, label: '退款金额(元)'},
  {value: 2, label: '费用类型'},
  {value: 3, label: '退款原因'},
  {value: 4, label: '回款编号'},
  {value: 5, label: '回款金额'},
  {value: 6, label: '付款方名称'},
  {value: 7, label: '客户名称'},
]

const mockTask = [
  {taskNo: 'T81121092780001801-1', taskId:1, engineer:[{engineerName:'侯婷婷',engineerNo:'0001',dept:'项目部'},{engineerName:'十七',engineerNo:'0003',dept:'项目部'}],productName:'高新技术产业',deliverableName:'高新技术产业33',taskStatus:1},
  {taskNo: 'T81121092780001801-2', taskId:2, engineer:[{engineerName:'侯婷婷',engineerNo:'0001',dept:'项目部'},{engineerName:'十七',engineerNo:'0003',dept:'项目部'}],productName:'高新技术产业',deliverableName:'高新技术产业33',taskStatus:1},
  {taskNo: 'T81121092780001801-3', taskId:3, engineer:[{engineerName:'侯婷婷',engineerNo:'0001',dept:'项目部'},{engineerName:'十七',engineerNo:'0003',dept:'项目部'}],productName:'高新技术产业',deliverableName:'高新技术产业33',taskStatus:1},
  {taskNo: 'T81121092780001801-4', taskId:4, engineer:[{engineerName:'侯婷婷',engineerNo:'0001',dept:'项目部'},{engineerName:'十七',engineerNo:'0003',dept:'项目部'}],productName:'高新技术产业',deliverableName:'高新技术产业33',taskStatus:1},
]
const mockHead = [
  {engineerName:'侯婷婷',engineerNo:'0001',dept:'项目部'},
  {engineerName:'十七',engineerNo:'0003',dept:'项目部'}
]
const engineerTaskList =[
  {taskNo: 'T81121092780001801-1', taskId:1, engineer:[{engineerName:'侯婷婷',engineerNo:'0001',dept:'项目部'},{engineerName:'十七',engineerNo:'0003',dept:'项目部'}],productName:'高新技术产业',deliverableName:'高新技术产业33',taskStatus:1,allIn:false},
  {taskNo: 'T81121092780001801-2', taskId:2, engineer:[{engineerName:'侯婷婷',engineerNo:'0001',dept:'项目部'},{engineerName:'十七',engineerNo:'0003',dept:'项目部'}],productName:'高新技术产业',deliverableName:'高新技术产业33',taskStatus:2,allIn:true},
  {taskNo: 'T81121092780001801-3', taskId:3, engineer:[{engineerName:'侯婷婷',engineerNo:'0001',dept:'项目部'},{engineerName:'十七',engineerNo:'0003',dept:'项目部'}],productName:'高新技术产业',deliverableName:'高新技术产业33',taskStatus:3,allIn:false},
  {taskNo: 'T81121092780001801-4', taskId:4, engineer:[{engineerName:'侯婷婷',engineerNo:'0001',dept:'项目部'},{engineerName:'十七',engineerNo:'0003',dept:'项目部'}],productName:'高新技术产业',deliverableName:'高新技术产业33',taskStatus:4,allIn:true},
]
const engineerDealList = [
  {label:'已完成', value:'完成', disabled: false},
  {label:'已完成(通过)', value:'通过', disabled: false},
  {label:'已完成(不通过)', value:'不通过', disabled: false},
  {label:'关闭', value:'关闭', disabled: false},
]
function policyFeeType(val){
  return val == 0 ? '定金' : '尾款';
};

function filterPrice(val) {
  return (val / 100).toFixed(2); 
};

export function remarkStatus(val) {
  if (val == "0") {
    return "待审核";
  } else if (val == "1") {
    return "已通过";
  } else if (val == "2") {
    return "未通过";
  } else {
    return "已撤销";
  }
}
// 退款状态
// -2：未通过；-1：已撤销；1：待审核；2：审核中；3：审核通过；4：已完成
export function refundStatus(val) {
  if (val == -2) {
    return "退款拒绝";
  } else if (val == -1) {
    return "退款已撤销";
  } else if (val == 1) {
    return "待审核";
  } else if (val == 2) {
    return "待审核";
  } else if (val == 3) {
    return "待审核";
  } else if (val == 4) {
    return "审核通过";
  } else {
    return "未知";
  }
}
export function filterAmount(val) {
  if (val == "0") {
    return "代理费";
  } else if (val == "1") {
    return "第三方费用";
  } else if (val == "2") {
    return "官费";
  }else{
    return '服务费'
  }
};
 
export function filterType(val) {
  if (val == 0) {
    return "个人";
  } else {
    return "单位";
  }
};

export function filterCostType(val) {
  if (val == 1) {
    return "代理费";
  } else if (val == 2) {
    return "第三方费用";
  } else if (val == 3) {
    return "官费";
  } else {
    return "服务费";
  }
};

export function cancleStatus(val) {
  if (val == "0") {
    return "提交审核";
  } else if (val == "1") {
    return "审核通过";
  } else if (val == "2") {
    return "审核不通过";
  } else {
    return "撤销申请";
  }
};

export function fiterReason(val) {
  if (val == "0") {
    return "客户取消订单";
  } else if (val == "1") {
    return "我司服务未完成";
  } else if (val == "2") {
    return "客户付款金额错误";
  } else if (val == "3") {
    return "客户付款方式错误";
  } else if (val == "4") {
    return "退款原因";
  } else {
    return "其他";
  }
};

export function refundReason(val) {
  if (val == "1") {
    return "下错单了";
  } else if (val == "2") {
    return "付款金额错误";
  } else if (val == "3") {
    return "付款方式错误";
  } else if (val == "4") {
    return "服务终止";
  } else {
    return "其他";
  };
};
function taskFinishType(val){
  if(val==1){
    return "已完成(通过)"
  }else if(val==2){
    return "已完成(未通过)"
  }else{
    return "已完成"
  }
}

export function refundState(value) {
  return value == 0 ? '待处理' : value == 1 ? '退款成功' : value == 2 ? '退款失败' : value == 3 ? '待更新结果': '未知';
}

function payType(value) {
  return value == 1 ? '对公转账' : value == 0 ? '支付宝' : value == 2 ? '微信' : '未知';
}

//  任务状态taskStatus,0-待开始,1-进行中，2-冻结中，3-已完成，4-已关闭 
function taskStatus(value){
  return value == 0 ? '待开始' : value == 1 ? '进行中' : value == 2 ? '已通过' : value == 3 ? '已完成' : value == -2 ? '已关闭' : value == -1 ? '暂停' : '';
}

/* 查看退款 */
export function getRefundInfo(obj,url){
  return getRefundDetail(obj,url).then(res=>{
    return res.data.data;
  })
}
export function uniqueArr(arr,val) {  
    const res = new Map();
    return arr.filter(item => !res.has(item[val]) && res.set(item[val], 1))
}
export function doubleUniqueArr(arr,f,s) {
  // 缓存用于记录
  const cache = [];
  for (const t of arr) {
      // 检查缓存中是否已经存在
      if (cache.find(c => c[f] === t[f] && c[s] === t[s])) {
          // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
          continue;
      }
      // 不存在就说明以前没遇到过，把它记录下来
      cache.push(t);
  }

  // 记录结果就是过滤后的结果
  return cache;
}
export function cancelRefund(obj) {
  return  MessageBox.confirm("确定撤销退款申请？撤销后仍可再次发起退款申请", "提醒", {
    type: "warning",
    confirmButtonText: "确定",
    cancelButtonClass: 'btn-custom-cancel',
    cancelButtonText: "取消"
  }).then(() => {
    refundRevoke(obj).then(res=>{
      var type = '';
      var defaultMessage = '';
      if(res.data.code == CodeMsg.CODE_0 || res.data.code == CodeMsg.CODE_1){
        type = res.data.code == CodeMsg.CODE_0 ? 'success' : 'warning';
        defaultMessage = res.data.code == CodeMsg.CODE_0 ? '退款撤销成功' : res.data.code == CodeMsg.CODE_1 ? '撤销退款失败' : '';
        Message({
          type: type,
          message: defaultMessage
        })
      };
    });
    return true;
  });
}
function getSummaries(param,allAmount,step) {
  const { columns, data } = param;
  console.log(data,'datadatadatadatadatadatadatadatadatadatadatadatadata');
  const sums = [];
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '总价';
      return;
    };
    if (index === 1) {
      sums[index] = '';
      return;
    };
    if (index === 2) {
      sums[index] = '';
      return;
    };
    if (index === 3) {
      sums[index] = '';
      return;
    };
    if (index === 4) {
      sums[index] = '';
      return;
    };
    if (index === 7) {
      sums[index] = '';
      return;
    };
    const pays = Object.values(data.reduce((acc,{payAmount,payTypeId})=>(acc[payTypeId] ? (acc[payTypeId].payAmount = acc[payTypeId].payAmount ) : (acc[payTypeId]={payTypeId,payAmount}) ,acc),{}));
    const values = data.map(item => item[column.property]);
    console.log(column.property,values,allAmount,'******--');
  console.log(pays,'----pays');
  if(index == 5){
      if (pays.length == 1) return sums[index] = pays[0].payAmount;
      if (pays.length == 0) return sums[index] = '';
      sums[index] = pays.filter(p => p.payAmount).reduce((p,c) => p.payAmount + c.payAmount);
} else if (!values.every(value => isNaN(value))) {
      if(step == 1) return sums[index] = '待确认'
      sums[index] = values.reduce((prev, curr) => {
        const value = Number(curr);
        if (!isNaN(value)) {
          return prev + curr;
        } else {
          return prev;
        };
      }, 0);
      sums[index] += '';
    } else {
      sums[index] = 'N/A';
    };
  });
  sums[5] = data[0] && data[0].payTypeId == 3 ? allAmount : Number(sums[5]);
  sums[6] = math.format(Number(sums[6])) == 0 || math.format(Number(sums[6]))== 'NaN'? '待确认':'-'+Number(sums[6]);
  return sums;
}

export default {
  refundInfoList,
  mockTask,
  mockHead,
  engineerTaskList,
  engineerDealList,
  uniqueArr,
  doubleUniqueArr,
  getRefundInfo,
  refundStatus,
  cancelRefund,
  fiterReason,
  cancleStatus,
  filterType,
  filterAmount,
  remarkStatus,
  filterPrice,
  filterCostType,
  refundState,
  payType,
  policyFeeType,
  taskFinishType,
  refundReason,
  taskStatus,
  getSummaries
}