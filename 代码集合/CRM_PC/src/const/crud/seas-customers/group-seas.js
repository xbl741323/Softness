export const clientOption = {
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
    slot: true
  },
  {
    label: '客户名称',
    prop: 'companyName',
    overHidden: true,
    slot: true
  },
  {
    label: '单位类型',
    prop: 'orgType',
    overHidden:true,
    slot: true,
  },
  {
    label: '行业',
    prop: 'industry',
    overHidden: true,
    slot: true,
  },
  {
    label: '联系方式',
    prop: 'mobile',
    slot: true,
  },
  {
    label: '地区',
    prop: 'orgAddress',
    slot: true,
    overHidden: true
  },
  {
    label: '流入时间',
    prop: 'seasTime',
    slot: true,
    overHidden: true,
    sortable: true
  }
  ]
}

export const soloOption = {
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
    slot: true
  },
  {
    label: '客户名称',
    prop: 'contactName',
    overHidden: true,
    slot: true
  },
  {
    label: '联系方式',
    prop: 'mobile',
    slot: true,
  },
  {
    label: '单位名称',
    prop: 'companyName',
    slot: true,
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
    slot: true,
    overHidden: true
  },
  {
    label: '流入时间',
    prop: 'seasTime',
    slot: true,
    overHidden: true,
    sortable: true
  }
  ]
}