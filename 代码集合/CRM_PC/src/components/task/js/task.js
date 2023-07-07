import { taskStatusStatistical, getTaskList, getTaskDetail, updateTask } from '@/api/task/'
import { Message} from 'element-ui'

const priorityList =[//优先级
  {value: '紧急',label: 0,color:'red'},
  {value: '高',label: 1,color:'#FF3300'},
  {value: '中',label: 2,color:'#FF9900'},
  {value: '低',label: 3,color:'#33CC66'},
]
const filterpropertyList = [
    {value: null, label: '全部'},
    {value: 3, label: '专利'},
    {value: 4, label: '版权'},
    {value: 5, label: '商标'},
    {value: 6, label: '其他'}
]

const orderSourceList = [
    {value: null, label: '全部'},
    {value: 0, label: '线下'},
    {value: 1, label: '线上'}
]

const taskTypeList = [
    {value: null, label: '全部'},
    {value: 1, label: '项目申报'},
    {value: 2, label: '知识产权'}
]

const fileTypeList = [
  {value: null, label: '全部'},
  {value: 1, label: '证书'},
  {value: 2, label: '材料'},
  {value: 3, label: '营业执照'}
]

export function priority(value){
  return value == 0 ? '紧急' : value == 1 ? '高' : value ==2 ? '中' : value == 3 ? '低' : value == 4 ? '最低' : '';
}

const taskInfoList = [
  {value:-2,label:'产品名称'},
  {value:-1,label:'规格属性'},
  {value:0,label:'任务进度'},
  {value:1,label:'交付物名称'},
  {value:2,label:'工程师'},
  {value:3,label:'交付时间'},
  {value:5,label:'优先级'},
  {value:6,label:'客户名称'},
  {value:7,label:'业务员'},
  {value:4,label:'创建时间'},
]

const taskInfoPropertyList = [
  {value:-2,label:'产品名称'},
  {value:-1,label:'规格属性'},
  {value:0,label:'任务进度'},
  {value:1,label:'交付物名称'},
  {value:2,label:'工程师'},
  {value:3,label:'交付时间'},
  {value:5,label:'优先级'},
  {value:6,label:'客户名称'},
  {value:7,label:'业务员'},
  {value:8,label:'专利申请号'},
  {value:4,label:'创建时间'},
]

export function taskStatus(value){
  return value == 0 ? '待开始' : value == 1 ? '进行中' : value == 2 ? '已完成' : value == -1 ? '已暂停' : value == -2 ? '已关闭' : ''
}
export function getTaskStatistical(obj, apiInfo){//任务状态数据统计
  return taskStatusStatistical(obj, apiInfo).then(res=>{
    return res;
  }).catch(err=>{
    return err;
  })
}

export function taskList(obj,apiInfo){//任务列表
  return getTaskList(obj,apiInfo).then(res=>{
    return res.data.data;
  }).catch(err=>{
    return err;
  })
}

export function taskDetail(id,source,apiInfo){
  return getTaskDetail(id,source,apiInfo).then(res=>{
    return res.data.data;
  }).catch(err=>{
    return err;
  })
}

export function editTask(row,isNote){
  let param ={
    id: row.id,
    taskNo:row.taskNo,
    accountId:row.accountId,
    source:row.source,
    engineerNo:row.engineerNo+""
  }
  if(isNote){
    param.taskDesc = row.taskDesc
  }else{
    param.priority = row.priority
  }
  return updateTask(param).then(res=>{
    let defaultMesasge = '编辑成功！';
    let type = 'success';
    let message = res.data.msg || defaultMesasge;
    if(res.data.code == CodeMsg.CODE_0){

    }else if(res.data.code == 1){
      type = 'warning'
    }
    Message({
      type: type,
      message: message
    })
    return true;
  }).catch(()=>{
    return false;
  })
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

const taskApiList = [
  {
    name: '项目任务',
    type: 1,
    pageApi: '/tmProjectTask/pageTmOrderTask',
    statisticsApi: '/tmProjectTask/statisticsTaskNum',
    allocateEngineerApi: '/tmProjectTask/allocateEngineer',
    batchAllocateEngineerApi: '/tmProjectTask/batchAllocateEngineer',
    commitProgressApi: '/tmProjectTask/commitProgress',
    batchCommitProgressApi: '/tmProjectTask/batchCommitProgress',
    recordApi: '/tmProjectTaskFollow/listByOrderTaskId',
    detailHeaderInfoApi: '/tmProjectTask/headerInfo',
    detailOrderInfoApi: '/tmProjectTask/orderInfo',
    detailOrderInfoSensitive: '/tmProjectTask/orderInfoSensitive',
    editDeliveryApi: '/tmProjectTask/editDelivery',
    followApi: '/tmProjectTaskFollow/count',
    taskProcessApi: '/ttProjectTaskProcess/getProgressById',
    saveTaskFollowApi: '/tmProjectTaskFollow/saveTaskFollow',
    editTaskFollowApi: '/tmProjectTaskFollow',
    permissionsOfPage: 'bt_page_project_task',
    permissionsOfAllot: 'bt_allot_project_task',
    permissionsOfEdit: 'bt_edit_project_task',
    permissionsOfDetail: 'bt_get_project_task',
    permissionsOfCustomer: 'bt_get_transaction'
  },
  {
    name: '知产任务',
    type: 2,
    pageApi: '/tmIntellectualTask/pageTmOrderTask',
    statisticsApi: '/tmIntellectualTask/statisticsTaskNum',
    allocateEngineerApi: '/tmIntellectualTask/allocateEngineer',
    batchAllocateEngineerApi: '/tmIntellectualTask/batchAllocateEngineer',
    commitProgressApi: '/tmIntellectualTask/commitProgress',
    batchCommitProgressApi: '/tmIntellectualTask/batchCommitProgress',
    recordApi: '/tmIntellectualTaskFollow/listByOrderTaskId',
    detailHeaderInfoApi: '/tmIntellectualTask/headerInfo',
    detailOrderInfoApi: '/tmIntellectualTask/orderInfo',
    detailOrderInfoSensitive: '/tmIntellectualTask/orderInfoSensitive',
    editDeliveryApi: '/tmIntellectualTask/editDelivery',
    followApi: '/tmIntellectualTaskFollow/count',
    taskProcessApi: '/ttIntellectualTaskProcess/getProgressById',
    saveTaskFollowApi: '/tmIntellectualTaskFollow/saveTaskFollow',
    editTaskFollowApi: '/tmIntellectualTaskFollow',
    permissionsOfPage: 'bt_page_intellectual_task',
    permissionsOfAllot: 'bt_allot_intellectual_task',
    permissionsOfEdit: 'bt_edit_intellectual_task',
    permissionsOfDetail: 'bt_get_intellectual_task',
    permissionsOfCustomer: 'bt_get_transaction'
  },
  {
    name: '工商财税',
    type: 7,
    pageApi: '/tmFinancialTask/pageTmOrderTask',
    statisticsApi: '/tmFinancialTask/statisticsTaskNum',
    allocateEngineerApi: '/tmFinancialTask/allocateEngineer',
    batchAllocateEngineerApi: '/tmFinancialTask/batchAllocateEngineer',
    commitProgressApi: '/tmFinancialTask/commitProgress',
    batchCommitProgressApi: '/tmFinancialTask/batchCommitProgress',
    recordApi: '/tmFinancialTaskFollow/listByOrderTaskId',
    detailHeaderInfoApi: '/tmFinancialTask/headerInfo',
    detailOrderInfoApi: '/tmFinancialTask/orderInfo',
    detailOrderInfoSensitive: '/tmFinancialTask/orderInfoSensitive',
    editDeliveryApi: '/tmFinancialTask/editDelivery',
    followApi: '/tmFinancialTaskFollow/count',
    taskProcessApi: '/ttFinancialTaskProcess/getProgressById',
    saveTaskFollowApi: '/tmFinancialTaskFollow/saveTaskFollow',
    editTaskFollowApi: '/tmFinancialTaskFollow',
    permissionsOfPage: 'bt_page_financial_task',
    permissionsOfAllot: 'bt_allot_financial_task',
    permissionsOfEdit: 'bt_edit_financial_task',
    permissionsOfDetail: 'bt_get_financial_task',
    permissionsOfCustomer: 'bt_get_transaction'
  },
  {
    name: '融资上市',
    type: 9,
    pageApi: '/tmFinancingTask/pageTmOrderTask',
    statisticsApi: '/tmFinancingTask/statisticsTaskNum',
    allocateEngineerApi: '/tmFinancingTask/allocateEngineer',
    batchAllocateEngineerApi: '/tmFinancingTask/batchAllocateEngineer',
    commitProgressApi: '/tmFinancingTask/commitProgress',
    batchCommitProgressApi: '/tmFinancingTask/batchCommitProgress',
    recordApi: '/tmFinancingTaskFollow/listByOrderTaskId',
    detailHeaderInfoApi: '/tmFinancingTask/headerInfo',
    detailOrderInfoApi: '/tmFinancingTask/orderInfo',
    detailOrderInfoSensitive: '/tmFinancingTask/orderInfoSensitive',
    editDeliveryApi: '/tmFinancingTask/editDelivery',
    followApi: '/tmFinancingTaskFollow/count',
    taskProcessApi: '/ttFinancingTaskProcess/getProgressById',
    saveTaskFollowApi: '/tmFinancingTaskFollow/saveTaskFollow',
    editTaskFollowApi: '/tmFinancingTaskFollow',
    permissionsOfPage: 'bt_page_financing_task',
    permissionsOfAllot: 'bt_allot_financing_task',
    permissionsOfEdit: 'bt_edit_financing_task',
    permissionsOfDetail: 'bt_get_financing_task',
    permissionsOfCustomer: 'bt_get_transaction'
  },
  {
    name: '法律服务',
    type: 10,
    pageApi: '/tmLegalTask/pageTmOrderTask',
    statisticsApi: '/tmLegalTask/statisticsTaskNum',
    allocateEngineerApi: '/tmLegalTask/allocateEngineer',
    batchAllocateEngineerApi: '/tmLegalTask/batchAllocateEngineer',
    commitProgressApi: '/tmLegalTask/commitProgress',
    batchCommitProgressApi: '/tmLegalTask/batchCommitProgress',
    recordApi: '/tmLegalTaskFollow/listByOrderTaskId',
    detailHeaderInfoApi: '/tmLegalTask/headerInfo',
    detailOrderInfoApi: '/tmLegalTask/orderInfo',
    detailOrderInfoSensitive: '/tmLegalTask/orderInfoSensitive',
    editDeliveryApi: '/tmLegalTask/editDelivery',
    followApi: '/tmLegalTaskFollow/count',
    taskProcessApi: '/ttLegalTaskProcess/getProgressById',
    saveTaskFollowApi: '/tmLegalTaskFollow/saveTaskFollow',
    editTaskFollowApi: '/tmLegalTaskFollow',
    permissionsOfPage: 'bt_page_legal_task',
    permissionsOfAllot: 'bt_allot_legal_task',
    permissionsOfEdit: 'bt_edit_legal_task',
    permissionsOfDetail: 'bt_get_legal_task',
    permissionsOfCustomer: 'bt_get_transaction'
  },
  {
    name: '软件开发',
    type: 11,
    pageApi: '/tmSoftDevelopTask/pageTmOrderTask',
    statisticsApi: '/tmSoftDevelopTask/statisticsTaskNum',
    allocateEngineerApi: '/tmSoftDevelopTask/allocateEngineer',
    batchAllocateEngineerApi: '/tmSoftDevelopTask/batchAllocateEngineer',
    commitProgressApi: '/tmSoftDevelopTask/commitProgress',
    batchCommitProgressApi: '/tmSoftDevelopTask/batchCommitProgress',
    recordApi: '/tmSoftDevelopTaskFollow/listByOrderTaskId',
    detailHeaderInfoApi: '/tmSoftDevelopTask/headerInfo',
    detailOrderInfoApi: '/tmSoftDevelopTask/orderInfo',
    detailOrderInfoSensitive: '/tmSoftDevelopTask/orderInfoSensitive',
    editDeliveryApi: '/tmSoftDevelopTask/editDelivery',
    followApi: '/tmSoftDevelopTaskFollow/count',
    taskProcessApi: '/ttSoftDevelopTaskProcess/getProgressById',
    saveTaskFollowApi: '/tmSoftDevelopTaskFollow/saveTaskFollow',
    editTaskFollowApi: '/tmSoftDevelopTaskFollow',
    permissionsOfPage: 'bt_page_soft_develop_task',
    permissionsOfAllot: 'bt_allot_soft_develop_task',
    permissionsOfEdit: 'bt_edit_soft_develop_task',
    permissionsOfDetail: 'bt_get_soft_develop_task',
    permissionsOfCustomer: 'bt_get_transaction'
  },
]


const permissionsOfOrder = [
  {
    name: '项目订单',
    type: [1],
    permissionsOfOrderDetail: 'bt_order_detail_project'
  },
  {
    name: '知产订单',
    type: [3,4,5,6],
    permissionsOfOrderDetail: 'bt_order_detail_property'
  },
  {
    name: '工商财税订单',
    type: [7,8],
    permissionsOfOrderDetail: 'bt_order_detail_csfw'
  },
  {
    name: '融资上市订单',
    type: [9],
    permissionsOfOrderDetail: 'bt_order_detail_rzss'
  },
  {
    name: '法律服务订单',
    type: [10],
    permissionsOfOrderDetail: 'bt_order_detail_flfw'
  },
  {
    name: '软件开发订单',
    type: [11],
    permissionsOfOrderDetail: 'bt_order_detail_rjkf'
  },
]

const fileTypes = {
  1: {
    2: '发明专利',
    3: '实用新型专利',
    4: '外观专利',
    5: '商标',
    6: '版权',
    7: '其他知产'
  },
  2: {
    8: '材料'
  },
  3: {
    1: '营业执照'
  }
};
const materialTypes = {
  1: '案件材料',
  2: '受理通知书',
  3: '受理缴费文件',
  4: '授权通知书',
  5: '授权缴费文件',
  8: '项目材料'
};


export default{
  taskInfoList,
  taskInfoPropertyList,
  filterpropertyList,
  orderSourceList,
  taskTypeList,
  priorityList,
  fileTypeList,
  getTaskStatistical,
  taskList,
  taskDetail,
  taskStatus,
  priority,
  editTask,
  taskApiList,
  permissionsOfOrder,
  fileTypes,
  materialTypes
}