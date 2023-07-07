export const clientOption = {
  selection: true,
  reserveSelection: true,
  selectClearBtn: false,
  addBtn: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuAlign: 'center',
  menuWidth: 100,
  border: true,
  rowKey: 'clueNo',
  column: [{
    label: '主体ID',
    prop: 'userNo',
    width: 130,
    slot: true
  },
  {
    label: '绑定线索',
    prop: 'clueNo',
    width: 170,
    overHidden: true
  },
  {
    label: '客户名称',
    prop: 'companyName',
    width: 160,
    overHidden: true,
    slot: true
  },
  {
    label: "信用代码",
    prop: 'organization',
    overHidden: true,
    slot: true,
    width: 160
  },
  {
    label: '联系人1手机号',
    prop: 'mobile',
    slot: true,
    width: 110
  },
  {
    label: '单位类型',
    prop: 'orgType',
    slot: true,
  },
  {
    label: '行业',
    prop: 'industry',
    overHidden: true,
    slot: true,
  },
  {
    label: '地区',
    prop: 'orgAddress',
    width: 140,
    slot: true,
    overHidden: true
  },
  {
    label: "客户归属",
    prop: "customerBelong",
    slot: true,
    overHidden: true,
  },
  {
    label: "业务员",
    prop: "salesman",
    slot: true,
    overHidden: true,
  },
  {
    label: '最近签约时间',
    prop: 'signTime',
    slot: true,
    overHidden: true,
    width: 140
  }]
}

export const soloOption = {
  selection: true,
  reserveSelection: true,
  selectClearBtn: false,
  addBtn: false,
  header: false,
  editBtn: false,
  delBtn: false,
  rowKey: 'clueNo',
  align: 'center',
  menuAlign: 'center',
  menuWidth: 110,
  border: true,
  column: [{
    label: '主体ID',
    prop: 'userNo',
    width: 130,
    slot: true
  },
  {
    label: '绑定线索',
    prop: 'clueNo',
    width: 170,
    overHidden: true
  },
  {
    label: '客户名称',
    prop: 'contactName',
    width: 130,
    slot: true
  },
  {
    label: '联系方式',
    prop: 'mobile',
    slot: true,
    width: 110,
  },
  {
    label: '单位名称',
    prop: 'companyName',
    width: 200,
    overHidden: true
  },
  {
    label: '单位类型',
    prop: 'orgType'
  },
  {
    label: '行业',
    prop: 'industry',
    overHidden: true
  },
  {
    label: '地区',
    prop: 'orgAddress',
    width: 160,
    overHidden: true
  },
  {
    label: '客户归属',
    prop: 'customerBelong',
    slot: true
  },
  {
    label: '业务员',
    prop: 'salesman',
    slot: true
  },
  {
    label: '最近签约时间',
    prop: 'signTime',
    slot: true,
    width: 140
  }]
}