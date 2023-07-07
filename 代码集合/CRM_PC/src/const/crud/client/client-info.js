export const clientOption = {
    selection: false,
    reserveSelection: true,
    selectClearBtn: false,
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menu: false,
    menuAlign: 'center',
    menuWidth: 270,
    border: true,
    column: [{
        label: '签约时间',
        slot: true,
        prop: 'signTime',
    }, {
        label: '合同编号',
        prop: 'contractNo',
        slot:true
    }, 
    {
        label: '订单编号',
        prop: 'orderNo',
        slot:true
    }, {
        label: '线索/用户编号',
        prop: 'clueNo',
        slot:true
    },
    {
        label: '产品名称',
        prop: 'productName',
        slot:true
    }, 
    {
        label: '合同金额(元)',
        prop: 'contractSum',
        slot:true
    },
    {
        label: '线索/推广归属',
        prop: 'cluEmpName',
        slot:true
    },
    {
        label: '业务员',
        prop: 'saleEmpName',
        slot:true
    }]
}