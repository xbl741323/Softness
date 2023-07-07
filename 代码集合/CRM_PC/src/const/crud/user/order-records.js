export const tableOption = {
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menuAlign: 'center',
    menuWidth: 150,
    border: true,
    column: [{
        label: '订单编号',
        prop: 'orderNo',
        overHidden:true,
        width: 160,
        slot: true
    },
    {
        label: '线索编号',
        prop: 'clueNo',
        overHidden:true,
        width: 160,
        slot: true
    }, {
        label: '产品名称',
        prop: 'spuName',
        width: 180,
        overHidden: true,
    }, {
        label: "数量",
        prop: 'buyNum',
        overHidden: true,
        width: 90
    }, {
        label: '订单总价',
        prop: 'totalAmount',
        slot:true
    }, {
        label: '尾款状态',
        width: 120,
        prop: 'tailStatus',
        slot: true
    }, {
        label: '订单状态',
        width: 120,
        prop: 'orderStatus',
        slot: true
    },
    {
        label: '签约人',
        prop: 'signName',
        slot: true
    },
    {
        label: '创建时间',
        prop: 'orderTime',
        overHidden: true,
    }]
}