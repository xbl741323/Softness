export const tableOption = {
  selection: true,
  reserveSelection: true,
  selectClearBtn: false,
  addBtn: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuAlign: 'center',
  menuWidth: 220,
  border: true,
  column: [{
    label: '序号',
    prop: 'serialNo',
    width: 80,
  },
  {
    label: '课程编号',
    prop: 'classNumber',
    width: 140,
    overHidden: true,
    slot: true
  },
  {
    label: '课程标题',
    prop: 'classTitle',
    overHidden: true,
    slot: true
  },
  {
    label: '所属板块',
    prop: 'plants',
    overHidden: true,
    slot: true
  },
  {
    label: '专业分类',
    prop: 'themeType',
    overHidden: true,
    width: 130,
    slot: true
  },
  {
    label: '收费类型',
    prop: 'tradingChargeType',
    overHidden: true,
    width: 130,
    slot: true
  },
  {
    label: '显示状态',
    prop: 'showStatus',
    width: 130,
    slot: true
  },
  {
    label: '课程现价',
    prop: 'tradingCurrentPrice',
    overHidden: true,
    width: 110,
    slot: true
  },
  {
    label: '含第三方费用',
    prop: 'tradingThirdFee',
    overHidden: true,
    width: 110,
    slot: true
  },
  {
    label: '创建时间',
    prop: 'createTime',
    width: 150,
    type: 'datetime',
    overHidden: true,
    search: false,
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  },
  ]
}
