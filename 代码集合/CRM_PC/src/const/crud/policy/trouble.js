export const tableOption = {
  selection: true,
  selectable:(row,index)=>{
    return row.deleted===0;
  },
  reserveSelection: true,
  selectClearBtn: false,
  addBtn: false,
  header: false,
  menuWidth:250,
  editBtn: false,
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
    width:450,
    slot: true
  }, {
    label: '问题类型',
    prop: 'questionType',
    overHidden: true,
    slot: true,
  },{
    label: '级别',
    prop: 'level',
    overHidden: true,
    slot: true,
  }, {
    label: '地区',
    prop: 'area',
    overHidden: true,
    slot: true,
  },  {
    label: '发布人',
    prop: 'createUserName',
    slot: true
  }, {
    label: '发布时间',
    prop: 'createTime',
    type: 'datetime',
    overHidden:true,
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  }, {
    label: '显示状态',
    prop: 'showStatus',
    slot: true
  }]
}
