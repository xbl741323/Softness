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
export const taskOption = {
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
        label: '任务编号',
        prop: 'taskNo',
        slot:true,
        overHidden:true,
        width: 160
    },
    {
        label: '任务名称',
        prop: 'spuName',
        overHidden:true,
    },
    {
        label: '优先级',
        prop: 'priority',
        slot:true,
        overHidden:true,
        width: 80
    },
    {
        label: '任务状态',
        prop: 'taskStatus',
        slot:true,
        width: 120,
        overHidden:true,
    }, 
    // {
    //     label: '交付时间',
    //     prop: 'deliveryTime',
    //     overHidden:true,
    // },
    // {
    //     label: '创建时间',
    //     prop: 'createTime',
    //     overHidden:true,
    // }
    ]
}