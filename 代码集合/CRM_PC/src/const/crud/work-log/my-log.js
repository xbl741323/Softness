export const tableOption = {
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menuAlign: 'center',
    menuWidth: 200,
    menu:true,
    border: true,
    column: [
      {
        label: '日志时间',
        prop: 'journalTime',
        overHidden: true,
        sortable: true,
        width:200
      }, {
        label: '工作内容',
        prop: 'content',
        overHidden: true,
      },
      {
        label: '创建时间',
        prop: 'createTime',
        overHidden: true,
        sortable: true,
        width:200
      }
    ]
}  