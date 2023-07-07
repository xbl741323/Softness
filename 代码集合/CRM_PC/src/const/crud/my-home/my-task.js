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