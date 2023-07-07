export const mainOption = {
  addBtn: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuAlign: 'center',
  menuWidth: 180,
  border: true,
  column: [{
    label: '课程编号',
    prop: 'classNo',
    overHidden: true,
  },
  {
    label: '课程标题',
    prop: 'baseTitle',
    overHidden: true,
  },
  {
    label: '章节标题',
    prop: 'sectionName',
    overHidden: true,
  },
  {
    label: '课程专业类型',
    prop: 'professionalType',
    slot: true,
    overHidden: true,
  }
  ]
}