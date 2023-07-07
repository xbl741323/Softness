export const clientOption = {
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
    border: true,
    column: [{
        label: '线索编号',
        prop: 'clueNo',
        slot: true,
        width: 230
    }, {
        label: '联系人',
        prop: 'clueCompanyContactList'
    },
    {
        label: '联系方式',
        prop: 'phone',
        slot: true,
        width: 220
    },
    {
        label: '线索归属',
        prop: 'clueAttributionEmpName',
        slot: true,
    },
    {
        label: '业务员',
        prop: 'clueSalesmanEmpName',
        slot: true,
    },
    {
        label: '创建时间',
        prop: 'createTime',
        slot: true
    },]
}