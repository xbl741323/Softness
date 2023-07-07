export const tableOption = {
  selection: true,
  selectable: (row, index) => {
    return row.isRelated == false;
  },
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
      label: '专业分类',
      prop: 'themeType',
      overHidden: true,
      width: 130,
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
