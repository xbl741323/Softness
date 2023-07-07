import { getReceiveList, getFeeStatistical, getOrgNameLikeList, commit, getNormalClue, getApprovedClue, claimFee, orderReceiveList} from '@/api/receive/receive-api.js'
import * as CodeMsg from "@/api/common/CodeChange"
import {Message} from 'element-ui'

const receive = [
  {label: '代理费', value: 1},
  {label: '第三方费用', value: 2},
  {label: '官费', value: 3},
]

const offlineReceive = [
  {label: '代理费', value: 0},
  {label: '第三方费用', value: 1},
  {label: '官费', value: 2},
]

const payTypeList = [
  {label: '支付宝', value: 0},
  {label: '对公转账', value: 1},
  {label: '微信', value: 2},
]

export function receiveAmount(value,receiveStatus,contractNo){
  if(contractNo==null || (contractNo && contractNo.replace(/\D/g, '').length <= 8)){
    return value == null ? '' : value == 0 ? '无' : (value/100).toFixed(2);
  }else{
    if(receiveStatus == 0){
      return value == null ? '' : value == 0 ? '无' : (value/100).toFixed(2);
    }else{
      return value == null ? '待定' : value == 0 ? '无' : (value/100).toFixed(2);
    }
  }
}

export function amountType(value){
  return value == 1 ? '代理费' : value == 2 ? '第三方费用' : value == 3 ? '官费' : value == 4 ? '待定' : '';
}
export function offlineAmountType(value){
  return value == 0 ? '代理费' : value == 1 ? '第三方费用' : value == 2 ? '官费' : '待定';
}

function payType(value) {
  return value == 1 ? '对公转账' : value == 0 ? '支付宝' : '微信';
}

export function refundAmount(value){
  return value ? (value/100).toFixed(2) : '';
}

export function switchReceiveAmount(money){
  var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
    //基本单位
    var cnIntRadice = new Array('', '拾', '佰', '仟');
    //对应整数部分扩展单位
    var cnIntUnits = new Array('', '万', '亿', '兆');
    //对应小数部分单位
    var cnDecUnits = new Array('角', '分', '毫', '厘');
    //整数金额时后面跟的字符
    var cnInteger = '';
    //整型完以后的单位
    var cnIntLast = '';
    //最大处理的数字
    var maxNum = 999999999999999.9999;
    //金额整数部分
    var integerNum;
    //金额小数部分
    var decimalNum;
    //输出的中文金额字符串
    var chineseStr = '';
    //分离金额后用的数组，预定义
    var parts;
    if (money == '') { return ''; }
    money = parseFloat(money);
    if (money >= maxNum) {
        //超出最大处理数字
        return '';
    }
    if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
    }
    //转换为字符串
    money = money.toString();
    if (money.indexOf('.') == -1) {
        integerNum = money;
        decimalNum = '';
    } else {
        parts = money.split('.');
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
    }
    //获取整型部分转换
    if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
            var n = integerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                }
                //归零
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
        chineseStr += cnIntLast + "圆";
    }
    //小数部分
    if (decimalNum != '') {
        var decLen = decimalNum.length;
        for (var i = 0; i < decLen; i++) {
            var n = decimalNum.substr(i, 1);
            if (n != '0') {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            } else if (n == '0') {
                chineseStr += cnNums[Number(n)];
            }
        }
    }
    if (chineseStr == '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (decimalNum == '') {
        chineseStr += cnInteger + "整";
    }
    return chineseStr;
}

export function getList(obj,operate){
  return getReceiveList(obj,operate).then(res=>{
    return operate ? res.data : res.data.data;
  }).catch(err=>{
    return err;
  });
}

export function orderReceivePage(obj){
  return orderReceiveList(obj).then(res=>{
    return res.data.data;
  }).catch(err=>{
    return err;
  });
}

export function getStatistical(){
  return getFeeStatistical().then(res=>{
    return res.data.data;
  }).catch(err=>{
    return err;
  });
}

export function orgNameLikeList(keyWords){
  return getOrgNameLikeList(keyWords).then(res=>{
    return res.data.data;
  }).catch(err=>{
    return err;
  });
}

export function myNormalClue(obj){
  return getNormalClue(obj).then(res=>{
    return res.data.data;
  }).catch(()=>{
    return false;
  });
}

export function myApprovedClue(obj){
  return getApprovedClue(obj).then(res=>{
    return res.data.data;
  }).catch(()=>{
    return false;
  })
}

export function commitFee(obj,commitType){
  return commit(obj,commitType).then(res=>{
    if(res){
      let message = '';
      let type = 'success';
      if(commitType == 'post' && res.data.code == CodeMsg.CODE_0){
        message = '回款录入成功！';
      }else if(commitType == 'post' && res.data.code == CodeMsg.CODE_1){
        message = '回款录入失败！';
      }else if(commitType == 'put' && res.data.code == CodeMsg.CODE_0){
        message = '编辑回款成功！'
      }else if(commitType == 'put' && res.data.code == CodeMsg.CODE_1){
        type = 'warning';
        message = '编辑回款失败！'
      }else{

      }
      if(res.data.code == CodeMsg.CODE_0||res.data.code ==CodeMsg.CODE_1){
        Message({
          type: type,
          message: message
        });
      }
      return true;
    }
  }).catch(()=>{
    return false;
  });
}

export function claim(obj){//认领回款
  return claimFee(obj).then(res=>{
    if(res.data.code == CodeMsg.CODE_0){
      // Message({
      //   type:'success',
      //   message:'回款认领成功！'
      // });
      return true;
    }else if(res.data.code ==CodeMsg.CODE_1){
      Message({
        type:'warning',
        message:'回款认领失败！'
      });
      return false;
    }else{

    };
  }).catch(()=>{
    return false;
  });
}

export default {
  receive,
  refundAmount,
  getList,
  getStatistical,
  orgNameLikeList,
  commitFee,
  receiveAmount,
  switchReceiveAmount,
  myNormalClue,
  myApprovedClue,
  claim,
  amountType,
  orderReceivePage,
  payType,
  payTypeList,
  offlineReceive,
  offlineAmountType
}