export const tableOption = {
    border: true,
    index: true,
    indexLabel: '序号',
    stripe: true,
    menuAlign: 'center',
    viewBtn: false,
    header: false,
    refreshBtn: false,
    addBtn: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    column: [{
            label: '模板ID',
            prop: 'templateId',
        },
        {
            label: '提醒标题',
            prop: 'wxTemplate',
            slot:true,
        },
    ]
}