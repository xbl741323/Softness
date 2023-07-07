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
        label: '数据名称',
        prop: 'menuName'
    }, {
        label: '组织部门',
        prop: 'dsType',
        slot:true
    }, {
        label: '查重部门',
        prop: 'dsCheckType',
        slot:true
    }]
}