const processInfo = [
  {value: 0, label:'流程状态',key:'processState'},
  {value: 1, label:'待处理人',key:'handlerNames'},
  {value: 2, label:'被考核人',key:'appraiseName'},
  {value: 3, label:'部门',key:'deptFullName'},
  {value: 4, label:'职位',key:'positionName'},
  {value: 5, label:'任务名称',key:'jobName'},
  {value: 6, label:'发起时间',key:'createTime'},
] 


function processState(val) {
  return val == 1 ? '待提交审核' : val == 2 ? '待审核' : val == 5 ? '已通过' : ''; 
}


export default {
  processInfo,
  processState
}