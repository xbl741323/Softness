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
  menu: false,
  border: true,
  column: [
    {
      label: '课程编号',
      prop: 'classNo',
      width: 140,
      overHidden: true,
    },
    {
      label: '课程标题',
      prop: 'baseTitle',
      overHidden: true,
    },
    {
      label: '专业分类',
      prop: 'themeType',
      overHidden: true,
      slot: true,
      width: 130,
    },
  ]
}
