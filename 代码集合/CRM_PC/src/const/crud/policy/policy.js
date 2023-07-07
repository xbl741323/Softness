export const tableOption = {
  selection: true,
  selectable:(row,index)=>{
    return row.deleted===0;
  },
  reserveSelection: true,
  selectClearBtn: false,
  addBtn: false,
  header: false,
  editBtn: false,
  menuWidth:250,
  delBtn: false,
  align: 'center',
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
    overHidden: true,
    slot: true,
    width:450,
  }, {
    label: '发布人',
    overHidden:true,
    width:120,
    prop: 'createUserName',
    slot: true
  }, {
    label: '发布时间',
    width:120,
    overHidden:true,
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
