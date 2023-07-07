import {getArea} from '@/api/clue/clue';
import {Message, MessageBox} from 'element-ui'
import{ onSaleRequirement, offSaleRequirement,delRequirement} from '@/api/requirement/index'

export function getAreaData(){ 
  return getArea().then(res=>{//地区
    let areaList = res.data.data;        
    for(var i = 0; i <areaList.length; i++){
        let newList=[];
        for(var j = 0; j <areaList[i].children.length; j++){                
        newList.push({
            areaName:areaList[i].children[j].areaName,
            id:areaList[i].children[j].id,
            nodeNumber:areaList[i].children[j].nodeNumber,
            parentId:areaList[i].children[j].parentId
        })
        }            
      areaList[i].children=newList;
    }
      return areaList                             
  }).catch(err=>{
      return false;
  });
}
const achievementType = [//需求状态
  {value:null, label:'全部'},
  {value:1, label:'展示中'},
  {value:3, label:'交易中'},
  {value:4, label:'已成交'},
  {value:2, label:'已下架'},
  {value:5, label:'已删除'},
]

export function statusChange(value){
  return value == 0 ? '已下架' : value ==1 ? '展示中' : value == 2 ? '已下架' : value == 3 ? '交易中' : value == 4 ? '已成交' : value == 5 ? '已删除' : '';
}

export function onSaleProduct(obj){//上架需求
  return MessageBox.confirm("确认上架该产品吗?", "提示", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonClass: 'btn-custom-cancel',
      cancelButtonText: "取消"
  }).then(() => {
    return onSaleRequirement(obj).then(res=>{
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

export function offSaleProduct(obj){//下架需求
  return MessageBox.confirm("确认下架该产品吗?下架后前台不再展示", "提示", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonClass: 'btn-custom-cancel',
      cancelButtonText: "取消"
  }).then(() => {
    return offSaleRequirement(obj).then(res=>{
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

export function delProduct(obj){//删除需求
  return MessageBox.confirm("确认删除选中的产品吗?", "提示", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonClass: 'btn-custom-cancel',
      cancelButtonText: "取消"
  }).then(() => {
    return delRequirement(obj).then(res=>{
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

export function batchDelProduct(obj,num){//批量删除需求
  return MessageBox.confirm("已选择"+num+"条数据，确认删除选中的产品吗?", "批量删除", {
      type: "warning",
      confirmButtonText: "确定",
      cancelButtonClass: 'btn-custom-cancel',
      cancelButtonText: "取消"
  }).then(() => {
    return delRequirement(obj).then(res=>{
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
}