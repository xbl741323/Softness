export const electronicOption = {
    reserveSelection: true,
    stripe: true,
    selectClearBtn: false,
    refreshBtn: false,
    addBtn: false,
    header: true,
    editBtn: false,
    delBtn: false,
    header: false,
    align: 'center',
    menuAlign: 'center',
    menuWidth: 150,
    border: true,
    column: [{
        label: '合同编号',
        prop: 'contractNo',
        slot: true,
        fixed: true,
        width: 200,
    }, {
        label: '订单编号',
        prop: 'orderNo',
        overHidden: true,
        slot: true,
        width: 180,
    },
     {
        label: '客户名称',
        prop: 'authName',
        width: 160,
        overHidden: true,
    }, 
    {
        label: '地区',
        prop: 'orgAddress',
        width: 160,
        overHidden: true,
    }, 
    {
        label: '订单类型',
        prop: 'categoryName',
        width: 120,
        overHidden: true,
        slot: true
    }, {
        label: '订单信息',
        prop: 'spuName',
        overHidden: true,
        slot: true
    },
    {
        label: '合同金额',
        prop: 'totalAmount',
        width: 90,
        overHidden: true,
        slot: true
    },
    {

        label: '下单时间',
        prop: 'orderTime',
        width: 150,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm'
    }, {
        label: '签约时间',
        prop: 'signTime',
        width: 120,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm',

    }, {
        label: '合同状态',
        prop: 'contractStatus',
        width:120,
        overHidden: true,
        slot: true
    }]
}
 