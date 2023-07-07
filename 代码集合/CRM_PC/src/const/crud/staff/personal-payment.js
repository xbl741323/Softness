export const payOption = {
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
  menu: false,
  menuAlign: 'center',
  menuWidth: 150,
  border: true,
  column: [{
    label: '回款时间',
    prop: 'receiveDateTime',
    overHidden: true,
  }, {
    label: '回款编号',
    prop: 'receiveNo',
    overHidden: true,
  }, {
    label: '客户名称',
    prop: 'customerName',
    overHidden: true,
  },
  {
    label: '合同编号',
    prop: 'contractNo',
    slot: true,
    // overHidden: true,
  },
  {
    label: '订单编号',
    prop: 'orderNo',
    slot: true,
    // overHidden: true,
  },
  {
    label: '回款金额',
    prop: 'receiveAmount',
    overHidden: true,
  },
  {
    label: '代理费',
    prop: 'agencyFee',
    slot: true,
    overHidden: true,
  },
  {
    label: '官费',
    prop: 'govermentFee',
    slot: true,
    overHidden: true,
  },
  {
    label: '第三方费用',
    prop: 'thirdFee',
    slot: true,
    overHidden: true,
  },
  {
    label: '回款去向',
    prop: 'receiveDirectionName',
    overHidden: true,
  },
  {
    label: '业务员',
    prop: 'salesmanName',
    slot: true,
    width: 90,
    overHidden: true,
  },
  {
    label: '认领人',
    prop: 'claimName',
    slot: true,
    width: 90,
    overHidden: true,
  },
  {
    label: '认领时间',
    prop: 'claimDateTime',
    width: 140,
    overHidden: true,
  },
  ]
}


