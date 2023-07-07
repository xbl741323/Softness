export const tableOption = {
  addBtn: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuAlign: 'center',
  menuWidth: 220,
  border: true,
  column: [{
    label: '排序',
    prop: 'serialNum',
    width: 120,
  },
  {
    label: '视频编号',
    prop: 'videoNo',
    width: 160,
    overHidden: true,
  },
  {
    label: '视频标题',
    prop: 'title',
    overHidden: true,
  },
  {
    label: '视频时长',
    prop: 'videoTime',
    overHidden: true,
    width: 160
  },
  {
    label: '专业分类',
    prop: 'professionalType',
    overHidden: true,
    width: 160,
  },
  {
    label: '发布人',
    prop: 'createByName',
    width: 130,
    overHidden: true,
    slot: true
  },
  {
    label: '发布时间',
    prop: 'createTime',
    width: 160,
    type: 'datetime',
    overHidden: true,
    search: false,
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  },
  ]
}
