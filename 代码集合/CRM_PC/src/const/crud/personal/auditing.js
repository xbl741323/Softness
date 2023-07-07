export const auditingOption = {
    selection: false,
    menu:false,
    reserveSelection:true,
    stripe: true,
    selectClearBtn: false,
    refreshBtn:false,
    addBtn: false,
    editBtn: false,
    delBtn:false,
    header:false,
    align:'center',
    border: true,
    column: [
        {
            label: '创建时间',
            prop: 'createTime',
        },{
            label: '操作内容',
            prop: 'content',
            slot: true
        },
        {
            label: '操作人',
            prop: 'createByName', 
            slot: true
        }
    ]
  }
  