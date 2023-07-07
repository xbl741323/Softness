export const tableOption = {
    index:true,
    indexLabel: '序号',
    selection: false,
    reserveSelection: true,
    selectClearBtn: false,
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menu: true,
    menuAlign: 'center',
    menuWidth: 200,
    border: true,
    column: [{
        label: '使用人',
        prop: 'user',
        slot:true
    }, {
        label: '部门',
        prop: 'department',
        slot:true
    }, {
        label: '角色',
        prop: 'role',
        slot:true
    }, 
    {
        label: '账号状态',
        prop: 'accountStatus',
        slot:true
    }]
}