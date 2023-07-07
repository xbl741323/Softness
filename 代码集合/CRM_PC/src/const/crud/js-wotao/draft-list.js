export const tableOption = {
    menu: true,
    selection: true,
    reserveSelection:true,
    align: 'center',
    selectionFixed: false,
    expandFixed: false,
    menuFixed: false,
    menuAlign: 'center',
    header: false,
    border: true,
    editBtn: false,
    refreshBtn: false,
    enter: true,
    delBtn: false,
    addBtn: false,
    columnBtn: false,
    column: [
        {
            label: '草稿编号',
            prop: 'number',
            slot:true
          },
          {
            label: '标题',
            prop: 'title',
            overHidden: true,
            slot:true
          },
          {
            label: '所属导航栏',
            prop: 'name'
          },
          {
            label: '发布人',
            prop: 'createUser',
            slot:true
          },
          {
            label: '发布时间',
            prop: 'createTime',
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm'
          }
    ]
}
