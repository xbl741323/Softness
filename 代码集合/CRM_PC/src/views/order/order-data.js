//订单数据

const orderStatus = [
  {value: 0, label: '全部'},
  {value: 1, label: '待分配'},
  {value: 2, label: '待开始'},
  {value: 3, label: '服务中'},
  {value: 4, label: '冻结中'},
  {value: 5, label: '已完成'},
  {value: 6, label: '已关闭'},
  {value: 7, label: '已取消'},
  {value: 8, label: '已删除'},
  {value: 9, label: '待签约'},
]

const payStatusList = [
  {value: 0, label: '全部'},
  {value: 1, label: '有尾款'},
  {value: 2, label: '已结清'},
]


const exportList=[
  // 项目
  { title:"xm",
    Privilege:{
      export : 'bt_tmOrder_export_project',
      change : 'bt_change_price_project',
      detail : 'bt_order_detail_project',
      payment : 'bt_payment_document_project',
      listJurisdiction:'bt_check_list_project'
    },    
  },
  // 知产
  { title:"zc",
    Privilege:{
      export : 'bt_tmOrder_export_property',    
      change : 'bt_change_price_property',
      detail : 'bt_order_detail_property',
      payment : 'bt_payment_document_property',
      listJurisdiction:'bt_check_list_property'
    }    
  },
  // 工商财税
  { title:"gscs",
    Privilege:{
      export : 'bt_tmOrder_export_csfw',
      change : 'bt_change_price_csfw',
      detail : 'bt_order_detail_csfw',
      payment : 'bt_payment_document_csfw',
      listJurisdiction:'bt_check_list_csfw'
    }    
  },
  // 法律服务
  { title:"flfw",
    Privilege:{
      export : 'bt_tmOrder_export_flfw',
      change : 'bt_change_price_flfw',
      detail : 'bt_order_detail_flfw',
      payment : 'bt_payment_document_flfw',
      listJurisdiction:'bt_check_list_flfw'
    }    
  },
  // 软件开发
  { title:"rjkf",
    Privilege:{
      export : 'bt_tmOrder_export_rjkf',
      change : 'bt_change_price_rjkf',
      detail : 'bt_order_detail_rjkf',
      payment : 'bt_payment_document_rjkf',
      listJurisdiction:'bt_check_list_rjkf'
    }    
  },
  // 融资上市
  { title:"rzss",
    Privilege:{
      export : 'bt_tmOrder_export_rzss',
      change : 'bt_change_price_rzss',
      detail : 'bt_order_detail_rzss',
      payment : 'bt_payment_document_rzss',
      listJurisdiction:'bt_check_list_rzss'
    }    
  },
]
export default {
  orderStatus,
  payStatusList,
  exportList,
}