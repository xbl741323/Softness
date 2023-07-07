export const clientOption = {
  selection: true,
  reserveSelection: true,
  rowKey: 'clueNo',
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
    label: '线索编号',
    prop: 'clueNo',
    width: 180,
    slot: true
  },
  {
    label: '线索单位名称',
    prop: 'companyName',
    width: 190,
    overHidden: true,
    slot: true
  },
  {
    label: '线索标签',
    prop: 'clueGradeId',
    overHidden: true,
    width: 90,
    slot: true,
  },
  {
    label: '单位类型',
    width: 100,
    prop: 'orgType',
    slot: true,
  },
  {
    label: '行业',
    prop: 'industry',
    overHidden: true,
    width: 130,
    slot: true,
  },
  {
    label: '联系方式',
    prop: 'mobile',
    width: 100,
    slot: true,
  },
  {
    label: '地区',
    prop: 'orgAddress',
    slot: true,
    overHidden: true
  },
  {
    label: '公海部门',
    prop: 'clueAttributionEmpDeptId',
    slot: true,
    overHidden: true
  },
  {
    label: '绑定成交客户',
    prop: 'bindCustomer',
    width: 100,
    slot: true,
    overHidden: true
  },
  {
    label: '成交状态',
    prop: 'isDeal',
    slot: true,
    width: 100,
    overHidden: true
  },
  {
    label: '流入时间',
    prop: 'seasTime',
    slot: true,
    width: 130,
    overHidden: true,
    sortable: true
  }
  ]
}

export const soloOption = {
  selection: true,
  reserveSelection: true,
  rowKey: 'clueNo',
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
    label: '线索编号',
    prop: 'clueNo',
    width: 180,
    overHidden: true,
    slot: true
  },
  {
    label: '线索姓名',
    prop: 'contactName',
    overHidden: true,
    slot: true
  },
  {
    label: '联系方式',
    prop: 'mobile',
    overHidden: true,
    slot: true,
  },
  {
    label: '线索标签',
    prop: 'clueGradeId',
    overHidden: true,
    slot: true,
  },
  {
    label: '单位名称',
    prop: 'companyName',
    overHidden: true,
    slot: true,
  },
  {
    label: '单位类型',
    prop: 'orgType',
    overHidden: true,
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
    label: '公海部门',
    prop: 'clueAttributionEmpDeptId',
    slot: true,
    overHidden: true
  },
  {
    label: '绑定成交客户',
    prop: 'bindCustomer',
    slot: true,
    overHidden: true
  },
  {
    label: '成交状态',
    prop: 'isDeal',
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