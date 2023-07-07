export const clientOption = {
    selection: false,
    reserveSelection: false,
    selectClearBtn: false,
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menuAlign: 'center',
    menu:false,
    menuWidth:200,
    border: true,
    column: [{
        label: '产品编号',
        prop: 'spuCode',
        width: 200
    }, {
        label: '产品类型',
        prop: 'categoryName',
        width: 200,
        slot:true,
        overHidden: true
    }, {
        label: '产品名称',
        prop: 'spuTitle'
    }]
}