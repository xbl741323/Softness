export const clientOption = {
  selectable: (row) => {
    return row.clueStatusId == 0;
  },
  selection: true,
  reserveSelection: false,
  selectClearBtn: false,
  addBtn: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuAlign: 'center',
  menuWidth: 130,
  border: true,
  column: [{
    label: '客户编号',
    prop: 'userNo',
    width: 130,
    overHidden: true,
    slot: true
  },
  {
    label: '绑定线索',
    prop: 'clueNo',
    overHidden: true
  },
  {
    label: '客户名称',
    prop: 'companyName',
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
    label: '单位类型',
    prop: 'orgType',
    width: 110,
    overHidden: true,
  },
  {
    label: '行业',
    prop: 'industry',
    width: 120,
    overHidden: true
  },
  {
    label: '联系人1手机号',
    prop: 'mobile',
    slot: true,
    width: 110
  },
  {
    label: '地区',
    prop: 'orgAddress',
    width: 140,
    overHidden: true
  },
  {
    label: '客户归属',
    prop: 'customerBelong',
    overHidden: true,
    width: 80,
    slot: true
  },
  {
    label: '业务员',
    prop: 'salesman',
    overHidden: true,
    width: 80,
    slot: true
  },
  {
    label: '最近签约时间',
    prop: 'signTime',
    width: 130,
    overHidden: true
  }]
}

export const soloOption = {
  selectable: (row) => {
    return row.clueStatusId == 0;
  },
  selection: true,
  reserveSelection: false,
  selectClearBtn: false,
  addBtn: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuAlign: 'center',
  menuWidth: 130,
  border: true,
  column: [{
    label: '客户编号',
    prop: 'userNo',
    width: 140,
    overHidden: true,
    slot: true
  },
  {
    label: '绑定线索',
    prop: 'clueNo',
    overHidden: true
  },
  {
    label: '客户名称',
    prop: 'contactName',
    width: 110,
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
    overHidden: true
  },
  {
    label: '单位类型',
    prop: 'orgType',
    width: 110,
    overHidden: true
  },
  {
    label: '行业',
    prop: 'industry',
    width: 120,
    overHidden: true
  },
  {
    label: '地区',
    prop: 'orgAddress',
    width: 140,
    overHidden: true
  },
  {
    label: '客户归属',
    prop: 'customerBelong',
    width: 100,
    slot: true
  },
  {
    label: '业务员',
    prop: 'salesman',
    width: 100,
    slot: true
  },
  {
    label: '最近签约时间',
    prop: 'signTime',
    width: 130,
    overHidden: true,
  }]
}

