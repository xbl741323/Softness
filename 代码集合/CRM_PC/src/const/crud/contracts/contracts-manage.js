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
        slot:true,
        fixed: true,
        width:200,
    },{   
        label: '订单编号',
        prop: 'orderNo',
        overHidden:true,
        slot: true,
        width:180,
    },{
        label: '客户名称',
        prop: 'authName',
        width:90,
        overHidden:true,
    },
    {
        label: '地区',
        prop: 'orgAddress',
        width:120,
        overHidden:true,
        slot:true
    },{
        label: '订单类型',
        prop: 'categoryName',
        width:90,
        overHidden:true,
        slot:true
    },{
        label: '订单信息',
        prop: 'orderInfo',
        overHidden:true,
        slot:true
    },{
        label: '合同金额',
        prop: 'totalAmount',
        overHidden:true,
        width:120,
        slot:true
    },{
        label: '合同备注',
        prop: 'remark',
        overHidden:true,
        width:120,
        slot:true
    },{
        label: '业务员',
        prop: 'clueSalesmanEmpName',
        width:80,
        overHidden:true,
        slot:true
    },{
        label: '创建时间',
        prop: 'createTime',
        width: 150,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm',
    },
    {
        label: '签约时间',
        prop: 'signTime',
        width:150,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm',
       
      },{
        label: '审核状态',
        prop: 'taskStatus',
        width:90,
        overHidden:true,
        slot:true
    }]
  }
  