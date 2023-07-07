export const optionFollow = {
    selection: false,
    reserveSelection: true,
    selectClearBtn: false,
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menu:true,
    menuAlign: 'center',
    menuWidth: 150,
    border: true,
    column: [  {
        label: '创建时间',
        prop: 'createTime',
        width: 180
    },{
        label: '线索编号',
        prop: 'clueNo',
        width: 120
    }, {
        label: '操作人',
        prop: 'operateEmpName',
        width: 120,
        slot:true
    }, {
        label: '内容',
        prop: 'content',
        slot:true
    },
    {
        label: '附件',
        prop: 'clueFollowFileList',
        width: 180,
        slot:true
    },
    {
        label: '定位信息',
        prop: 'locationInfo',
        width: 180,
        slot:true
    },
    {
        label: '更新时间',
        prop: 'updateTime',
        width: 180
    }]
}