export const tableOption = {
  selection: true,
  selectable: (row, index) => {
    return row.deleted === 0;
  },
  reserveSelection: true,
  selectClearBtn: false,
  addBtn: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuWidth: 300,
  menuAlign: 'center',
  border: true,
  column: [{
    label: '文章编号',
    prop: 'number',
    overHidden:true,
    width: 140,
    slot: true
  }, {
    label: '标题',
    prop: 'title',
    width: 300,
    overHidden: true,
    slot: true
  },{
    label: '级别',
    prop: 'level',
    overHidden: true,
    slot: true
  },{
    label: '地区',
    prop: 'area',
    overHidden: true,
    slot: true
  },{
    label: '归口',
    prop: 'attribute',
    overHidden: true,
    slot: true
  }, {
    label: '发布人',
    overHidden: true,
    prop: 'createUserName',
    slot: true
  }, {
    label: '发布时间',
    prop: 'createTime',
    type: 'datetime',
    overHidden: true,
    width: 120,
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  }, {
    label: '申报时间',
    prop: 'applyStartTime',
    type: 'date',
    overHidden: true,
    width: 180,
    format: 'yyyy-MM-dd',
    valueFormat: 'yyyy-MM-dd'
  }, {
    label: '显示状态',
    width: 120,
    prop: 'showStatus',
    slot: true
  }]
}
