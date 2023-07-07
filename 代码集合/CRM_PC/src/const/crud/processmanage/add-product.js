export const clientOption = {
  selection: true,
  reserveSelection: false,
  selectClearBtn: false,
  addBtn: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuAlign: 'center',
  menuWidth: 200,
  menu: false,
  border: true,
  column: [{
    label: '产品编号',
    prop: 'spuCode',
    width: 200
  }, {
    label: '产品类型',
    prop: 'categoryName',
    slot: true,
    width: 200,
    overHidden: true
  }, {
    label: '产品名称',
    prop: 'spuTitle'
  },
  {
    label: '当前工作流',
    prop: 'workflowId',
    slot: true
  }]
}