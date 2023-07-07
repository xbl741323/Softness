export const contractsOption = {
    reserveSelection:true,
    stripe: true,
    selectClearBtn: false,
    refreshBtn:false,
    addBtn: false,
    header: true,
    editBtn: false,
    delBtn:false,
    header:false,
    align:'center',
    menuAlign:'center',
    menuWidth:150,
    border: true,
    column: [{
        label: '合同编号',
        prop: 'contractNo',
        width:130,
        fixed: true,
        overHidden:true,
        slot:true
    },{
        label: '订单编号',
        prop: 'orderNo',
        width:160,
        overHidden:true,
        slot: true,
    },{
        label: '客户名称',
        prop: 'authName',
        overHidden:true,
        width:160,
    },
    {
        label: '地区',
        prop: 'orgAddress',
        width: 160,
        overHidden: true,
    }, 
    {
        label: '订单类型',
        prop: 'categoryName',
        overHidden:true,
        width:100,
        slot:true
    },{
        label: '订单信息',
        prop: 'orderInfo', 
        slot:true,
        width:160,
        overHidden:true,  
    },{
        label: '合同金额',
        prop: 'totalAmount',
        overHidden:true,
        slot:true
    },{
        label: '合同备注',
        prop: 'remark',
        overHidden:true,
        slot:true
    },{
        label: '创建时间',
        prop: 'createTime',
        width: 120,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm',
    },
    {
        label: '签约时间',
        prop: 'signTime',
        width:120,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm',
      },
      {
        label: '审核状态',
        prop: 'taskStatus',
        overHidden:true,
        width:100,
        slot:true
    }]
  }
  