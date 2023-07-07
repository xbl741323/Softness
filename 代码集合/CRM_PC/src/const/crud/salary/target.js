export const tableOption = {
    border: true,
    menuAlign: 'center',
    viewBtn: false,
    header: false,
    refreshBtn: false,
    addBtn:false,
    editBtn: false,
    delBtn: false,
    menu: false,
    align: 'center',
    column: [
        {
            label: '指标名称',
            prop: 'name',
        },
        {
            label: '指标描述',
            prop: 'des',
            slot:true,
        },
        {
            label: '指标对应系统项',
            prop: 'skpSysItemList',
            slot:true,
        },
        {
            label: '指标属性',
            prop: 'signs',
            slot:true,
        },
    ]
}