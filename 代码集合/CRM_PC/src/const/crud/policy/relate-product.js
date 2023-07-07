export const clientOption = {
  selection: true,
  reserveSelection: true,
  rowKey: 'spuCode',
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
    overHidden: true
  }, {
    label: '产品类型',
    prop: 'categoryName',
    overHidden: true
  }, {
    label: '产品名称',
    prop: 'spuTitle',
    overHidden: true
  }]
}