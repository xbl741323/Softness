//部门员工下拉框数据
import {getEmpList }from '@/api/clue/clue'
import { getToReceiveList, getProjectEngineer, getFinancialEngineer, getPropertyEngineer} from '@/api/receive/receive-api'

export function getDropList(empType){//empType-员工类型
  if(empType){
    return getEmpList(true).then(res=>{//全部员工
      return res.data.data;
    }).catch(err=>{
      return false;
    });
  }else{
    return getEmpList(false).then(res=>{//去除禁用后的员工
      return res.data.data;
    }).catch(err=>{
      return false;
    });
  }
}

export function getToReceive(param){//回款去向
  return getToReceiveList(param).then(res=>{
    return res.data.data;
  }).catch(err=>{

  });
};

export function getSpecificEmp(deptNo){ //0-知识产权 1-项目申报 2-财务辅导
  if(deptNo == 0){
    return getPropertyEngineer().then(res=>{
      return res.data.data;
    }).catch(()=>{
      return false;
    });
  }else if(deptNo ==1){
    return getProjectEngineer().then(res=>{
      return res.data.data;
    }).catch(()=>{
      return false;
    });
  }else{
    return getFinancialEngineer().then(res=>{
      return res.data.data;
    }).catch(()=>{
      return false;
    });
  };
}

export default {
  getDropList,
  getToReceive,
  getSpecificEmp
}