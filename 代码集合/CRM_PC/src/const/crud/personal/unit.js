export const tableOption = {
    selection: true,
    reserveSelection: true,
    stripe: true,
    selectClearBtn: false,
    refreshBtn: false,
    addBtn: false,
    editBtn: false,
    delBtn: false,
    menu: false,
    align: 'center',
    menuAlign: 'center',
    border: true,
    header: false,
    menuAlign: 'center',
    menuWidth: 200,
    column: [{
        label: 'ID',
        prop: 'userNo',
        slot: true,
        width: 100,
    }, {
        label: '单位名称',
        prop: 'orgName',
        overHidden: true,
        width: 240,
        slot: true,
    }, {
        label: '联系人',
        prop: 'name',
        width: 90,
        slot: true
    }, {
        label: '手机号',
        width: 120,
        prop: 'accountNo'
    }, {
        label: '单位类型',
        prop: 'orgTypeName',
        slot: true
    }, {
        label: '行业',
        prop: 'industryNameList',
        overHidden: true,
        slot: true
    }, {
        label: '地区',
        prop: 'orgAddressNameList',
        overHidden: true,
        slot: true
    },
    {
        label: '客服',
        prop: 'customerNo',
        overHidden: true,
        width: 90,
        slot: true
    },
    {
        label: '推广归属',
        prop: 'userBelong',
        overHidden: true,
        width: 90,
        slot: true
    },
    {
        label: '业务员',
        prop: 'salesMan',
        overHidden: true,
        width: 90,
        slot: true
    }, {
        label: '线索状态',
        prop: 'customerStatus',
        slot: true,
        overHidden: true,
        width: 140,
    }, {
        label: '注册时间',
        prop: 'registTime',
        width: 120,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss'
    }, {
        label: '操作',
        prop: 'menu',
        slot: true,
        width: 240,
    }]
}
