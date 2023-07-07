export const tableOption = {
    reserveSelection:true,
    stripe: true,
    selectClearBtn: false,
    refreshBtn:false,
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn:false,
    align:'center',
    menu:false,
    border: true,
    column: [{
        label: '操作时间',
        prop: 'gmtCreate',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss'
    },{
        label: '操作人',
        prop: 'operateEmpName',
        slot: true
    },{
        label: '字段',
        prop: 'field',
        slot: true
    },
    {
        label: '原值',
        prop: 'oldValue',
        slot: true
    },
    {
        label: '新值',
        prop: 'newValue',
        slot: true
    },
]
  }
  