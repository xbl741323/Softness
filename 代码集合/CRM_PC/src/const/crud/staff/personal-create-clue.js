export const clueOption = {
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
  menu:false,
  menuAlign: 'center',
  menuWidth: 150,
  border: true,
  column: [{
    label: '线索编号',
    prop: 'clueNo',
    overHidden: true,
  },
  {
    label: '客户名称',
    prop: 'authName',
    slot: true,
    overHidden: true,
  },
  {
    label: '线索类型',
    prop: 'clueType',
    slot: true,
    overHidden: true,
  },
  {
    label: '单位类型',
    prop: 'orgType',
    slot: true,
    overHidden: true,
  },
  {
    label: '行业',
    prop: 'industry',
    slot: true,
    overHidden: true,
  },
  {
    label: '联系人',
    prop: 'contactName',
    overHidden: true,
  },
  {
    label: '联系方式',
    prop: 'contactMobile',
    overHidden: true,
  },
  {
    label: '地区',
    prop: 'orgAddress',
    slot: true,
    overHidden: true,
  },
  {
    label: '线索归属',
    prop: 'clueAttributionEmpName',
    slot: true,
    overHidden: true,
  },
  {
    label: '业务员',
    prop: 'clueSalesmanEmpName',
    slot: true,
    overHidden: true,
  },
  {
    label: '创建人',
    prop: 'createByName',
    slot: true,
    overHidden: true,
  },
  {
    label: '创建时间',
    prop: 'createTime',
    overHidden: true,
  }]
}


