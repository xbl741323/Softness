export const listOption = {
    reserveSelection: false,
    stripe: true,
    selectClearBtn: false,
    refreshBtn: false,
    addBtn: false,
    header: true,
    editBtn: false,
    delBtn: false,
    header: false,
    menuWidth: "180",
    align: 'center',
    menuAlign: 'center',
    border: true,
    column: [{
        label: '流程编号',
        prop: 'refundNo',
        width: 150,
        overHidden: true,
        slot:true
      },{
        label: '订单编号',
        prop: 'orderNo',
        width: 150,
        overHidden: true,
      }, {
        label: '主体ID',
        prop: 'userNo',
      },{
        label: '用户名称',
        prop: 'customerName',
        overHidden: true,
        width: 180,
        slot: true
      }, 
      {
        label: '退款金额',
        prop: 'refundAmount',
        overHidden: true,
      }, 
      {
        label: '费用类型',
        prop: 'ttRefundFeeList',
        overHidden: true,
        slot:true
      },{
        label: '待处理人',
        prop: 'tmRefundApprovalList',
        overHidden: true,
        width: 120,
        slot: true
      },
      {
        label: '流程状态',
        prop: 'refundStatus',
        width: 135,
        overHidden: true,
        slot: true
      },
      {
        label: '发起时间',
        prop: 'createTime',
        overHidden: true,
        width: 160,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        overHidden: true,
      },
       {
        label: '结束时间',
        prop: 'endTime',
        width: 160,
        overHidden: true,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss'
      }
    ]
  }
  