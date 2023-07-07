export const supplementOption = {
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
  menuWidth: 180,
  border: true,
  column :[
    {
      label:'补充协议编号',
      prop:'contractSupplementaryNo'
    },
    {
      label:'合同编号',
      prop:'contractNo',
      slot: true
    },
    {
      label: '订单编号',
      prop: 'orderNo',
      width: 150,
      slot: true
    },
    {
      label:'客户名称',
      prop:'authName'
    },
    {
      label:'地区',
      prop:'orgAddress',
      slot: true
    },
    {
      label:'订单类型',
      prop:'categoryName'
    },
    {
      label:'订单信息',
      prop:'orderInfo'
    },
    {
      label:'业务员',
      prop:'clueSalesmanEmpId',
      slot: true
    },
    {
      label:'创建时间',
      prop:'createTime'
    },
    {
      label:'协议签署时间',
      prop:'signTime'
    },
    {
      label:'审核状态',
      prop:'contractSupplementaryStatus',
      slot: true
    },
  ]
}