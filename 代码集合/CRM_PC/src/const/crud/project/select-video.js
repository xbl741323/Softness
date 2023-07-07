export const selectOption = {
  selection: true,
  reserveSelection: true,
  selectClearBtn: false,
  addBtn: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuAlign: 'center',
  menuWidth: 180,
  menu: false,
  border: true,
  column: [{
    label: '视频编号',
    prop: 'videoNo',
    overHidden: true,
  },
  {
    label: '视频标题',
    prop: 'videoName',
    overHidden: true,
  },
  {
    label: '视频时长',
    prop: 'videoTime',
    overHidden: true,
  },
  {
    label: '专业分类',
    prop: 'professionalType',
    overHidden: true,
  },
  {
    label: '更新时间',
    prop: 'updateTime',
    type: 'datetime',
    overHidden: true,
    search: false,
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  }
  ]
}