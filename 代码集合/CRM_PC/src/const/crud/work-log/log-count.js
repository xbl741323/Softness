export const tableOption = {
  addBtn: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuAlign: 'center',
  menuWidth: 130,
  menu: false,
  border: true,
  column: [
    {
      label: '工号',
      prop: 'sysUserNumber',
      overHidden: true,
      slot: true
    },
    {
      label: '姓名',
      prop: 'sysUserName',
      overHidden: true,
      slot: true
    },
    {
      label: '部门',
      prop: 'deptName',
      overHidden: true
    },
    {
      label: '应填写日志',
      prop: 'needCount',
      overHidden: true,
      headerslot: true
    },
    {
      label: '正常日志',
      prop: 'validCount',
      overHidden: true
    },
    {
      label: '未填写日志',
      prop: 'notCount',
      slot: true,
      headerslot: true,
      overHidden: true
    },
    {
      label: '过期日志',
      prop: 'overdueCount',
      slot: true,
      overHidden: true
    },
  ]
}