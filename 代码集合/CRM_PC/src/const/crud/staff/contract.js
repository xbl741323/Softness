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
        label: '工号',
        prop: 'userNo',
        slot:true,
        sortable:true,
        overHidden:true,
    },{
        label: '姓名',
        prop: 'userName',
        slot:true,
        overHidden:true,
    },{
        label: '部门',
        prop: 'deptName',
        overHidden:true,
    },{
        label: '关联新增合同数量',
        prop: 'contractCount',
        sortable: "custom",
        overHidden:true,
    }]
  }
  
export const perContractsOption = {
    reserveSelection:true,
    stripe: true,
    selectClearBtn: false,
    refreshBtn:false,
    addBtn: false,
    header: true,
    editBtn: false,
    delBtn:false,
    header:false,
    align:'center',
    menu:false,
    border: true,
    column: [{
        label: '合同编号',
        prop: 'contractNo',
        overHidden:true,
    },{
        label: '客户名称',
        prop: 'authName',
        overHidden:true,
    },{
        label: '订单类型',
        prop: 'categoryId',
        slot:true,
        width:120,
        overHidden:true,
    },{
        label: '订单信息',
        prop: 'orderInfo',
        slot:true,
        overHidden:true,
    },{
        label: '合同金额',
        prop: 'totalAmount',
        slot:true,
        width:140,
        overHidden:true,
    },{
        label: '业务员',
        prop: 'clueSalesmanEmpName',
        slot:true,
        width:120,
        overHidden:true,
    },{
        label: '签约时间',
        prop: 'signTime',
        overHidden:true,
    },]
}
  