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
    align: 'center',
    menuWidth: "120",
    menuAlign: 'center',
    border: true,
    column: [{
      label: '流程编号',
      prop: 'taskNo',
      overHidden: true,
      slot: true
    }, {
      label: '订单编号',
      prop: 'orderNo',
      overHidden: true,
    },{
      label: '产品名称',
      prop: 'spuName',
      overHidden: true
    },{
        label: '订单类型',
        prop: 'categoryName',
    },{
        label: '用户ID',
        prop: 'userNo',
        overHidden: true
    },{
        label: '用户名称',
        prop: 'userName',
        overHidden: true
    },{
        label: '转账金额',
        prop: 'amount',
        width:100
    }, {
      label: '待处理人',
      prop: 'taskCurrentEmpId',
      overHidden: true,
      slot: true,
      width:100
    },
    {
      label: '流程状态',
      prop: 'taskStatus',
      overHidden: true,
      slot: true,
      width:100
    },
    {
      label: '发起人',
      prop: 'sponsorType',
      overHidden: true,
      slot: true,
      width:100
    },
    {
      label: '发起时间',
      prop: 'createTime',
      overHidden: true,
      overHidden: true,
    },
    {
      label: '处理时间',
      prop: 'updateTime',
      overHidden: true,
    }
    ]
  }
  