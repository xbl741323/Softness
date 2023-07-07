export const productOption = {
    border: true,
    addBtn: false,
    header: false,
    delBtn: false,
    editBtn: false,
    align: 'center',
    menu: false,
    column : [
        {
            label: '订单编号',
            prop: 'orderNo',
            overHidden: true,
            slot: true,
            width: 170
        },
        {
            label: '主体名称',
            prop: 'subjectName',
            overHidden: true,
            slot: true,
            width: 150
        },
        {
            label: '产品名称',
            prop: 'spuName',
            overHidden: true,
            slot: true,
            width: 130
        },
        {
            label: '数量',
            prop: 'buyNum',
            slot: true,
            width: 70
        },
        {
            label: '订单总价（元）',
            prop: 'totalAmount',
            overHidden: true,
            width: 110
        },
        {
            label: '订单归属',
            prop: 'belongName',
            overHidden: true,
            slot: true,
            width: 80
        },
        {
            label: '线索归属',
            prop: 'clueAttributionEmpName',
            overHidden: true,
            slot: true,
            width: 80
        },
        {
            label: '业务员',
            prop: 'clueSalesmanEmpName',
            overHidden: true,
            slot: true,
            width: 70
        },
        {
            label: '订单状态',
            prop: 'orderStatus',
            slot: true,
            width: 120
        },
        {
            label: '尾款状态',
            prop: 'tailStatus',
            overHidden: true,
            width: 90
        },
        {
            label: '创建时间',
            prop: 'createTime',
            overHidden: true,
        }
    ]
}