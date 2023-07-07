export const tableOption1 = {
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menuAlign: 'center',
    menuWidth: 150,
    border: true,
    column: [{
        label: '创建时间',
        prop: 'createTime',
        width: 150,
    },
    {
        label: '操作人',
        prop: 'operateEmpName',
        slot: true
    }, {
        label: '标题',
        prop: 'id',
        width: 200,
        overHidden: true,
        slot:true
    }, {
        label: "内容",
        prop: 'followTypeName',
        overHidden: true,
        slot:true,
        width:400
    }, {
        label: '附件',
        prop: 'files',
        slot:true
    }, {
        label: '更新时间',
        width: 150,
        prop: 'updateTime',
    }]
}

export const tableOption2 = {
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menu:false,
    border: true,
    column: [{
        label: '创建时间',
        prop: 'createTime',
        width: 150,
    },
    {
        label: '操作人',
        prop: 'operateEmpName',
        slot: true
    }, {
        label: '标题',
        prop: 'id',
        width: 200,
        overHidden: true,
        slot:true
    }, {
        label: "内容",
        prop: 'followTypeName',
        overHidden: true,
        slot:true,
        width:400
    }, {
        label: '附件',
        prop: 'files',
        slot:true
    }, {
        label: '更新时间',
        width: 150,
        prop: 'updateTime',
    }]
}