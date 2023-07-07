const soloOption = {    
    column: [
        {
            label: '订单号',
            prop: 'orderNo',
            slot:true,
            overHidden:true
        },{
            label: '产品名称',
            prop: 'spuName',
            overHidden:true
        },{
            label: '订单状态',
            prop: 'orderStatus',
            slot:true,
        },{
            label: '创建时间',
            slot: true,
            prop: 'orderTime',
            overHidden:true
        }
    ],
    columnCourse: [
        {
            label: '订单号',
            prop: 'orderNo',
            slot:true,
            overHidden:true
        },{
            label: '课程名称',
            prop: 'baseTitle',
            overHidden:true
        },{
            label: '订单状态',
            prop: 'orderStatus',
            slot:true,
        },{
            label: '创建时间',
            prop: 'createTime',
            overHidden:true
        }
    ],
    columnMember: [
        {
            label: '订单号',
            prop: 'orderNo',
            slot:true,
            overHidden:true
        },{
            label: '会员产品名称',
            prop: 'vipProductName',
            slot:true,
            overHidden:true
        },{
            label: '订单状态',
            prop: 'orderStatus',
            slot:true,
        },{
            label: '创建时间',
            prop: 'createTime',
            overHidden:true
        }
    ],
}
export default {
    soloOption
}