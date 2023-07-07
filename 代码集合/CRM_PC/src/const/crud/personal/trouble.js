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
  border: true,
  column: [{
    label: '文章编号',
    prop: 'number',
    overHidden: true,
    width: 140,
    slot: true
  }, {
    label: '标题',
    prop: 'title',
    width: 300,
    overHidden: true,
    slot: true
  }, {
    label: '发布人',
    prop: 'createUserName',
    slot: true
  }, {
    label: '发布时间',
    prop: 'createTime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  }, {
    label: '显示状态',
    prop: 'showStatus',
    slot: true
  }]
}
