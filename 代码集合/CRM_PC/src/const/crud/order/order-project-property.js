export const tableOption = {
  border: true,
  addBtn: false,
  header: false,
  delBtn: false,
  editBtn: false,
  menuWidth: '150px',
  align: 'center',
  column: [
    {
      label: '订单编号',
      prop: 'orderNo',
      overHidden: true,
      slot: true,
      width: 150
    },
    {
      label: '产品名称',
      prop: 'orderDetail.productName',
      overHidden: true,
      slot: true
    },
    {
      label: '数量',
      prop: 'orderDetail.productCount',
      slot: true,
      width: 60
    },
    {
      label: '订单总价(元)',
      prop: 'totalAmount',
      slot: true,
      width: 100
    },
    {
      label: '客户名称',
      prop: 'customerName',
      overHidden: true
    },
    {
      label: '线索归属',
      prop: 'clueBelongName',
      overHidden: true,
      slot: true,
      width: 100
    },
    {
      label: '业务员',
      prop: 'salesmanName',
      overHidden: true,
      slot: true,
      width: 100
    },
    {
      label: '订单状态',
      prop: 'orderStatus',
      slot: true,
      sortable: true,
      width: 100
    },
    {
      label: '交付时间',
      prop: 'finishTime',
      overHidden: true,
      sortable: true,
      width: 150
    },
    {
      label: '创建时间',
      prop: 'gmtCreate',
      overHidden: true,
      sortable: true,
      width: 150
    }
  ]
}