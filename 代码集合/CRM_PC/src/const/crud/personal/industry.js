export const tableOption = {
  selectable: (row) => {
    return row.policyStatus == 0 ? false : true
  },
  selection: true,
  reserveSelection: true,
  selectClearBtn: false,
  addBtn: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuWidth: 200,
  menuAlign: 'center',
  border: true,
  column: [{
    label: '文章编号',
    prop: 'number',
    overHidden: true,
    width: 140,
    slot: true,
  }, {
    label: '标题',
    prop: 'title',
    overHidden: true,
    width: 300,
    slot: true,
  },{
    label: '级别',
    prop: 'level',
    overHidden: true,
    slot: true,
  },{
    label: '地区',
    prop: 'area',
    overHidden: true,
    slot: true,
  },{
    label: '行业类型',
    prop: 'industryType',
    overHidden: true,
    slot: true,
  },{
    label: '发布人',
    prop: 'createUserName',
    overHidden: true,
    slot: true,
  },{
    label: '创建时间',
    prop: 'createTime',
    overHidden: true,
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  }, {
    label: '发布时间',
    prop: 'policyTime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  }, {
    label: '显示状态',
    prop: 'showStatus',
    slot: true
  },{
    label: '浏览量/收藏量',
    prop: 'pageViews',
    slot: true
  }]
}
