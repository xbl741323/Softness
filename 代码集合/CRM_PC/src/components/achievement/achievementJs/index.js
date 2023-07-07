import {Message, MessageBox} from 'element-ui'
import * as CodeMsg from "@/api/common/CodeChange"
import router from '@/router/router' //调用
import{ onSaleAchievement, offSaleAchievement, delAchievement, getListByType } from '@/api/achievement/index'
import {receivePrice} from '@/util/price.js';
const achievementType = [//成果状态
  {value:null, label:'全部'},
  {value:1, label:'展示中'},
  {value:3, label:'交易中'},
  {value:4, label:'已成交'},
  {value:2, label:'已下架'},
  {value:5, label:'已删除'},
]
export function sourceType(value){//成果来源
  return value == 0 ? '用户发布' : '后台';
}

export function addOrEditAchievement(status){//新增、编辑跳转 status 0-新增 1-编辑
  return router.push({
    path:'/achievement-create',
    query:{
      editStatus: status
    }
  })
}

export function maturity(value){
  return value == 0 ? '正在研发' : value == 1 ? '已有样品' : value == 2 ? '通过小试' : value == 3 ? '通过中试' : value == 4 ? '可以量产' : '';
}

export function statusChange(value){
  return value == 0 ? '已下架' : value ==1 ? '展示中' : value == 2 ? '已下架' : value == 3 ? '交易中' : value == 4 ? '已成交' : value == 5 ? '已删除' : '';
}

export function priceType(type,value){
  if(type == 0){
    return parseFloat(value).toFixed(2);
  }else{
    return '面议';
  }
}

export function getDropList(type){
  return getListByType(type).then(res=>{
    return res.data;
  }).catch(err=>{
    return err;
  });
}

export function onSaleProduct(obj){//上架成果
  return MessageBox.confirm("确认上架该产品吗?", "提示", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonClass: 'btn-custom-cancel',
      cancelButtonText: "取消"
  }).then(() => {
    return onSaleAchievement(obj).then(res=>{
      if(res.data.code == CodeMsg.CODE_0){
        Message({
          type:'success',
          message: res.data.msg
        });
        return true;
      }else{
        return false;
      }
    }).catch(err=>{
      return err;
    })
  })
}

export function offSaleProduct(obj){//下架成果
  return MessageBox.confirm("确认下架该产品吗?下架后前台不再展示", "提示", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonClass: 'btn-custom-cancel',
      cancelButtonText: "取消"
  }).then(() => {
    return offSaleAchievement(obj).then(res=>{
      if(res.data.code == CodeMsg.CODE_0){
        Message({
          type:'success',
          message: res.data.msg
        });
        return true;
      }else{
        return false;
      };
    }).catch(err=>{
      return err;
    })
  })
}

export function delProduct(obj){//删除成果
  return MessageBox.confirm("确认删除选中的产品吗?", "提示", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonClass: 'btn-custom-cancel',
      cancelButtonText: "取消"
  }).then(() => {
    return delAchievement(obj).then(res=>{
      if(res.data.code == CodeMsg.CODE_0){
        Message({
          type:'success',
          message: res.data.msg
        });
        return true;
      }else{
        return false;
      };
    }).catch(err=>{
      return err;
    })
  })
}

export function batchDelProduct(obj,num){//批量删除成果
  return MessageBox.confirm("已选择"+num+"条数据，确认删除选中的产品吗?", "批量删除", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonClass: 'btn-custom-cancel',
      cancelButtonText: "取消"
  }).then(() => {
    return delAchievement(obj).then(res=>{
      if(res.data.code == CodeMsg.CODE_0){
        Message({
          type:'success',
          message: res.data.msg
        });
        return true;
      }else{
        return false;
      };
    }).catch(err=>{
      return err;
    })
  })
}

export default {
  achievementType,
  maturity,
  statusChange,
  priceType,
  sourceType,
  onSaleProduct,
  offSaleProduct,
  delProduct,
  batchDelProduct,
  getDropList,
  addOrEditAchievement,
}