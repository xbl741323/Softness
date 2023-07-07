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
    menuWidth: 80,
    border: true,
    column: [{
        label: '线索编号',
        prop: 'clueNo',
        slot:true,
        overHidden:true,
        width: 120
    }, {
        label: '线索名称',
        prop: 'clueName',
        width: 80,
        overHidden:true
    },
    {
        label: '联系人（电话）',
        prop: 'contact',
        overHidden:true
    },
    {
        label: '上次跟进时间',
        prop: 'lastFollowTime',
        overHidden:true
    }, 
    {
        label: '跟进人',
        prop: 'lastFollowName',
        width: 80,
        slot:true,
        overHidden:true
    }
    ]
}