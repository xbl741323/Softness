export const listOption = {
  border: true,
  index: true,
  indexLabel: '层级序号',
  stripe: false,
  menuAlign: 'center',
  header: false,
  refreshBtn: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  column: [{
      label: '岗位名称',
      prop: 'name',
      overHidden: true,
      slot: true
    },
    {
      label: '使用人数',
      prop: 'relatedSysUserCount',
      overHidden: true,
      slot: true
    },
  ]
}

export const option = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: false,
  menuAlign: 'center',
  header: false,
  refreshBtn: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menu: false,
  column: [
    {
      label: '用户姓名',
      prop: 'name',
      overHidden: true,
      slot: true
    },
  ]
}