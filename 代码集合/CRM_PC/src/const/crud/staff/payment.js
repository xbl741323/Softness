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
  menuAlign: 'center',
  menuWidth: 150,
  border: true,
  column: [{
    label: '工号',
    prop: 'userNo',
    slot: true,
    sortable: true,
    overHidden: true,
  }, {
    label: '姓名',
    prop: 'userName',
    slot: true,
    overHidden: true,
  }, {
    label: '部门',
    prop: 'deptName',
    overHidden: true,
  },
  {
    label: '代理费',
    prop: 'agencyFeeSum',
    slot: true,
    sortable: "custom",
    overHidden: true,
  },
  {
    label: '第三方费用',
    prop: 'thirdPartyFeeSum',
    slot: true,
    sortable: "custom",
    overHidden: true,
  },
  {
    label: '官费',
    prop: 'governmentSum',
    slot: true,
    sortable: "custom",
    overHidden: true,
  }, {
    label: '总回款金额',
    prop: 'totalFeeSum',
    sortable: "custom",
    overHidden: true,
  }]
}


