export const tableOption = {
  reserveSelection: false,
  selectClearBtn: false,
  addBtn: false,
  menu: false,
  header: false,
  menuWidth:270,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuAlign: 'center',
  border: true,
  column: [
      {
        label: '客户名称',
        prop:'customerName',
        overHidden: true,
      }, 
      {
        label: '最近更新时间',
        prop: 'updateTime',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        overHidden: true,
      }, 
      {
          label: '最近更新人',
          prop: 'updateByName',
          overHidden: true,
          slot:true
      }, 
  ]
}
