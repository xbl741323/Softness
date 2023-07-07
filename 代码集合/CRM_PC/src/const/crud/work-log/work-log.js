export const tableOption = {
  addBtn: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuAlign: 'center',
  menuWidth: 130,
  menu:false,
  border: true,
  column: [
    {
      label: '日志时间',
      prop: 'journalTime',
      overHidden: true,
      sortable: true,
    }, {
      label: '工作内容',
      prop: 'content',
      width:800,
      slot:true,
      overHidden: true
    },
    {
      label: '创建时间',
      prop: 'createTime',
      slot:true,
      overHidden: true,
      sortable: true,
    },
    {
      label: '状态',
      prop: 'status',
      width:100,
      slot:true,
      width:200,
    }
  ]
}