export const tableOption = {
  addBtn: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuAlign: 'center',
  menuWidth: 180,
  border: true,
  column: [{
    label: '排序',
    prop: 'priority',
    width: 100,
  },
  {
    label: '板块名称',
    prop: 'plateName',
    overHidden: true,
  },
  {
    label: '关联课程',
    prop: 'classIds',
    overHidden: true,
    width: 150,
    slot: true,
  },
  {
    label: '创建人',
    prop: 'createByName',
    overHidden: true,
    slot: true,
  },
  {
    label: '创建时间',
    prop: 'createTime',
    type: 'datetime',
    overHidden: true,
    search: false,
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  },
  {
    label: '更新时间',
    prop: 'updateTime',
    type: 'datetime',
    overHidden: true,
    search: false,
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  },
  {
    label: '显示状态',
    prop: 'status',
    width: 150,
    overHidden: true,
    slot: true
  },
  ]
}
