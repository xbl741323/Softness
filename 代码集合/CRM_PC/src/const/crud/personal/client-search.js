export const tableOption = {
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menuAlign: 'center',
    menu: true,
    menuWidth: 200,
    border: true,
    column: [{
        label: '线索编号',
        prop: 'clueNo',
        slot: true,
        overHidden: true
    },
    {
        label: '单位名称',
        prop: 'companyName',
        slot: true,
        overHidden: true
    },
    {
        label: '联系人',
        width: 100,
        prop: 'contactName',
        overHidden: true
    },
    {
        label: '联系方式',
        prop: 'mobile',
        overHidden: true
    },
    {
        label: '地区',
        prop: 'orgAddress',
        slot: true,
        overHidden: true
    },
    {
        label: '客户归属',
        width: 100,
        prop: 'clueUserEmpName',
        slot: true,
        overHidden: true
    },
    {
        label: '线索归属',
        width: 100,
        prop: 'clueAttributionEmpName',
        slot: true,
        overHidden: true
    },
    {
        label: '业务员',
        width: 100,
        prop: 'clueSalesmanEmpName',
        slot: true,
        overHidden: true
    },
    {
        label: '客户状态',
        prop: 'clueStatusId',
        slot: true,
        overHidden: true
    },
    {
        label: '创建时间',
        prop: 'createTime',
        overHidden: true,
    }]
}

export const soloOption = {
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menuAlign: 'center',
    menu: true,
    menuWidth: 200,
    border: true,
    column: [{
        label: '线索编号',
        prop: 'clueNo',
        slot: true,
        overHidden: true
    },
    {
        label: '客户姓名',
        prop: 'contactName',
        slot: true,
        overHidden: true
    },
    {
        label: '联系方式',
        prop: 'mobile',
        overHidden: true
    },
    {
        label: '所在单位',
        prop: 'companyName',
        overHidden: true
    },
    {
        label: '地区',
        prop: 'orgAddress',
        slot: true,
        overHidden: true
    },

    {
        label: '客户归属',
        width: 100,
        prop: 'clueUserEmpName',
        slot: true,
        overHidden: true
    },
    {
        label: '线索归属',
        width: 100,
        prop: 'clueAttributionEmpName',
        slot: true,
        overHidden: true
    },
    {
        label: '业务员',
        width: 100,
        prop: 'clueSalesmanEmpName',
        slot: true,
        overHidden: true
    },
    {
        label: '客户状态',
        prop: 'clueStatusId',
        slot: true,
        overHidden: true
    },
    {
        label: '创建时间',
        prop: 'createTime',
        overHidden: true,
    }]
}