export const productOption = {
  reserveSelection: true,
  stripe: true,
  selectClearBtn: false,
  refreshBtn: false,
  addBtn: false,
  header: true,
  editBtn: false,
  delBtn: false,
  header: false,
  align: 'center',
  menuAlign: 'center',
  menuWidth: 70,
  border: true,
  column: [
    {
      label: '支付时间',
      prop: 'payTime',
      width: 140,
      overHidden: true
    },
    {
      label: '支付流水号',
      prop: 'tradeNo',
      overHidden: true,
      width: 160,
    },
    {
      label: '订单编号',
      prop: 'orderNo',
      overHidden: true,
      width: 140,
    },
    {
      label: '订单产品',
      prop: 'spuName',
      overHidden: true,
    },
    {
      label: '客户名称',
      prop: 'subjectName',
      overHidden: true,
      slot: true
    },
    {
      label: '支付金额',
      prop: 'payAmount',
      width: 100,
      overHidden: true,
      slot: true
    },
    {
      label: '费用类型',
      prop: 'amountType',
      overHidden: true,
      width: 120,
      slot: true
    },
    {
      label: '付款类型',
      prop: 'payType',
      width: 80,
      overHidden: true,
      slot: true
    },
    {
      label: '退款金额',
      prop: 'refundAmount',
      overHidden: true,
      width: 120,
      slot: true
    },
    {
      label: '支付方式',
      prop: 'payWay',
      width: 80,
      overHidden: true,
      slot: true
    },
    {
      label: '支付去向',
      prop: 'payDirection',
      width: 120,
      overHidden: true,
      slot: true
    },
    {
      label: '订单归属',
      prop: 'orderBelongName',
      width: 80,
      slot: true
    },
    {
      label: '业务员',
      prop: 'saleBelongName',
      width: 80,
      overHidden: true,
      slot: true
    },
    {
      label: '认领状态',
      prop: 'receiveStatus',
      width: 80,
      overHidden: true,
      slot: true
    },
  ]
}

export const classOption = {
  reserveSelection: true,
  stripe: true,
  selectClearBtn: false,
  refreshBtn: false,
  addBtn: false,
  header: true,
  editBtn: false,
  delBtn: false,
  header: false,
  align: 'center',
  menuAlign: 'center',
  menuWidth: 70,
  border: true,
  column: [
    {
      label: '支付时间',
      prop: 'payTime',
      width: 140,
      overHidden: true
    },
    {
      label: '支付流水号',
      prop: 'tradeNo',
      overHidden: true,
      width: 180,
    },
    {
      label: '订单编号',
      prop: 'orderNo',
      overHidden: true,
      width: 160,
    },
    {
      label: '订单产品',
      prop: 'spuName',
      overHidden: true,
      width: 160,
    },
    {
      label: '客户名称',
      prop: 'userName',
      overHidden: true,
      slot: true
    },
    {
      label: '客户手机号',
      prop: 'accountMobile',
      width: 100,
      overHidden: true,
      slot: true
    },
    {
      label: '支付金额',
      prop: 'payAmount',
      overHidden: true,
      width: 120,
      slot: true
    },
    {
      label: '支付方式',
      prop: 'payWay',
      width: 80,
      overHidden: true,
      slot: true
    },
    {
      label: '支付去向',
      prop: 'payDirection',
      overHidden: true,
    },
    {
      label: '订单归属',
      prop: 'orderBelongName',
      width: 80,
      slot: true
    },
    {
      label: '认领状态',
      prop: 'receiveStatus',
      width: 80,
      overHidden: true,
      slot: true
    },
  ]
}
