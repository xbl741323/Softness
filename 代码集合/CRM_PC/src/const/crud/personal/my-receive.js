export const receiveOption = {
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
  menuWidth: 150,
  menu: false,
  border: true,
  column: [
    {
      label: '回款时间',
      prop: 'receiveDateTime',
      width: 150,
      overHidden: true,
    },
    {
      label: '回款编号',
      prop: 'receiveNo',
      width: 140,
      overHidden: true,
    },
    {
      label: '支付流水号',
      prop: 'tradeNo',
      width: 120,
      // overHidden: true,
      slot: true
    },
    {
      label: '付款方名称',
      prop: 'payerName',
      width: 160,
      overHidden: true,
    },
    {
      label: '客户名称',
      prop: 'customerName',
      overHidden: true,
    },
    {
      label: '合同编号',
      prop: 'contractNo',
      width: 120,
      // overHidden: true,
      slot: true
    },
    {
      label: '订单编号',
      prop: 'orderNo',
      width: 120,
      // overHidden: true,
      slot: true
    },
    {
      label: '回款金额',
      prop: 'receiveAmount',
      overHidden: true,
      width: 100,
      slot: true
    },
    {
      label: '代理费',
      prop: 'agencyFee',
      overHidden: true,
      width: 90,
      slot: true
    },
    {
      label: '第三方费用',
      prop: 'thirdFee',
      overHidden: true,
      width: 90,
      slot: true
    },
    {
      label: '官费',
      prop: 'officialFee',
      overHidden: true,
      width: 90,
      slot: true
    },
    {
      label: '回款去向',
      prop: 'receiveDirectionName',
      overHidden: true,
      width: 160,
    },
    {
      label: '认领时间',
      prop: 'claimDateTime',
      width: 150,
      overHidden: true,
    }]
}

