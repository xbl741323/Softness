export const onlinetableOption = {
  border: true,
  addBtn: false,
  header: false,
  delBtn: false,
  editBtn: false,
  menuWidth: '150px',
  align: 'center',
  selection: true,
  refreshBtn: false,
  column: [
    {
      label: '订单编号',
      prop: 'orderNo',
      overHidden: true,
      slot: true,
      width: 170
    },
    {
      label: '主体ID',
      prop: 'userNo',
      overHidden: true,
      width: 110
    },
    {
      label: '产品名称',
      prop: 'spuName',
      overHidden: true,
    },
    {
      label: '数量',
      prop: 'buyNum',
      width: 60
    },
    {
      label: '订单总价(元)',
      prop: 'totalAmount',
      width: 100
    },
    {
      label: '主体名称',
      prop: 'subjectName',
      overHidden: true
    },
    {
      label: '订单归属',
      prop: 'belongName',
      overHidden: true,
      slot: true,
      width: 80
    },
    {
      label: '线索归属',
      prop: 'clueAttributionEmpName',
      overHidden: true,
      slot: true,
      width: 80
    },
    {
      label: '业务员',
      prop: 'clueSalesmanEmpName',
      overHidden: true,
      slot: true,
      width: 80
    },
    {
      label: '订单状态',
      prop: 'orderStatus',
      slot: true,
      width: 130
    },
    {
      label: '尾款状态',
      prop: 'tailStatus',
      slot: true,
      width: 100
    },
    {
      label: '下单端口',
      prop: 'orderPort',
      overHidden: true,
      slot: true,
      width: 120
    },
    {
      label: '创建时间',
      prop: 'orderTime',
      overHidden: true,
      sortable: true,
      width: 140
    }
  ]
}
