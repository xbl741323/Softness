export const soloOption = {
    selection: false,
    reserveSelection: false,
    selectClearBtn: false,
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menuAlign: 'center',
    menuWidth: 200,
    menu: false,
    border: true,
    column: [{
        label: '流程编号',
        prop: 'taskNo',
        slot:true,
        overHidden:true
    },
    {
        label: '发起时间',
        prop: 'gmtCreate',
        overHidden:true
    }, {
        label: '流程类型',
        prop: 'taskName',
        overHidden:true
    },
    {
        label: '发起人',
        prop: 'taskCommitName',
        slot:true,
        overHidden:true
    },
    {
        label: '待处理人',
        slot:true,
        prop: 'taskCurrentName',
        overHidden:true
    },
    ]
}