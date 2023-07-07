export const initOrderOption = {
  border: true,
  addBtn: false,
  header: false,
  delBtn: false,
  editBtn: false,
  menuWidth: 160,
  align: 'center',
  column: [
    {
      label: '线索编号',
      prop: 'clueNo',
      overHidden: true,
      width: 180
    },
    {
      label: '线索名称',
      prop: 'subjectName',
      overHidden: true
    },
    {
      label: '产品名称',
      prop: 'spuName',
      overHidden: true,
    },
    {
      label: '数量',
      prop: 'buyNum',
      width: 80
    },
    {
      label: '订单总价(元)',
      prop: 'totalAmount',
      width: 100,
      slot: true
    },
    {
      label: '订单归属',
      prop: 'belongName',
      slot: true,
      overHidden: true,
      width: 100
    },
    {
      label: '线索归属',
      prop: 'clueAttributionEmpName',
      overHidden: true,
      slot: true,
      width: 100
    },
    {
      label: '业务员',
      prop: 'clueSalesmanEmpName',
      overHidden: true,
      slot: true,
      width: 100
    },
    {
      label: '支付方式',
      prop: 'tailStatus',
      slot: true,
      width: 100
    },
    {
      label: '订单状态',
      prop: 'orderStatus',
      slot: true,
      width: 100
    },
    {
      label: '创建时间',
      prop: 'createTime',
      overHidden: true,
      sortable: true,
      width: 150
    },
  ]
}