export const tableOption = {
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
        label: '订单编号',
        prop: 'orderNo',
        overHidden: true,
        slot: true,
        width: 170
      },
      {
        label: '主体ID',
        prop: 'userNo',
        overHidden: true,
        width: 110
      },
      {
        label: '文件名称',
        prop: 'fileName',
        overHidden: true,
      },{
        label: '订单总价(元)',
        prop: 'price',
        slot: true,
        width: 100
      },
      {
        label: '主体名称',
        prop: 'userName',
        slot: true,
        overHidden: true
      },{
        label: '联系方式',
        prop: 'accountMobile',
      },
      {
        label: '订单归属',
        prop: 'belongName',
        slot: true,
        width: 80
      },
      {
        label: '订单状态',
        prop: 'orderStatus',
        slot: true,
        width: 130
      },
    {
      label: '下单来源',
      prop: 'orderSource',
      slot: true,
      width:100
    },
    {
      label: '创建时间',
      prop: 'createTime',
      overHidden: true,
    }
    ]
  }
  