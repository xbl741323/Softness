export const receivTableOption = {
  border: true,
  addBtn: false,
  header: false,
  delBtn: false,
  editBtn: false,
  menuWidth: 150,
  align: 'center',
  column: [
    {
      label: '回款时间',
      prop: 'receiveDateTime',
      width: 132,
      overHidden: true
    },
    {
      label: '回款编号',
      prop: 'receiveNo',
      width: 115,
      overHidden: true
    },
    {
      label: '支付流水号',
      prop: 'tradeNo',
      width: 110,
      slot: true
    },
    {
      label: '付款方名称',
      prop: 'payerName',
      width: 120,
      overHidden: true
    },
    {
      label: '客户名称',
      prop: 'customerName',
      width: 120,
      overHidden: true
    },
    {
      label: '合同编号',
      prop: 'contractNo',
      width: 110,
      // overHidden: true,
      slot: true
    },
    {
      label: '订单编号',
      prop: 'orderNo',
      width: 110,
      // overHidden: true,
      slot: true
    },
    {
      label: '回款金额',
      prop: 'receiveAmount',
      overHidden: true,
      slot: true,
    },
    {
      label: '代理费',
      prop: 'agencyFee',
      overHidden: true,
      width: 80,
      slot: true
    },
    {
      label: '第三方费用',
      prop: 'thirdFee',
      width: 85,
      overHidden: true,
      slot: true
    },
    {
      label: '官费',
      prop: 'officialFee',
      width: 80,
      overHidden: true,
      slot: true
    },
    {
      label: '回款去向',
      prop: 'receiveDirectionName',
      overHidden: true
    },
    {
      label: '认领状态',
      prop: 'receiveStatus',
      width: 70,
      overHidden: true,
      slot: true
    },
    {
      label: '认领人',
      prop: 'claimName',
      width: 60,
      overHidden: true,
      slot: true
    },
    {
      label: '认领时间',
      prop: 'claimDateTime',
      overHidden: true
    }
  ]
}