export const tableOption = {
    border: true,
    addBtn: false,
    header: false,
    delBtn: false,
    editBtn: false,
    menuWidth: '150px',
    align: 'center',
    column : [
      {
        label: '订单编号',
        prop: 'orderNo',
        overHidden: true,
        width: 170,
        slot: true
      },
      {
        label: '会员产品名称',
        prop: 'vipProductName',
        overHidden: true,
        width: 160
      },
      {
        label: '主体ID',
        prop: 'userNo',
        width: 100
      },
      {
        label: '主体名称',
        prop: 'authName',
        overHidden: true,
        width: 150,
        slot:true
      },
      {
        label: '联系方式',
        prop: 'accountMobile',
        width: 120
      },
      {
        label: '订单金额',
        prop: 'orderAmount',
        width:120
      },
      {
        label: '订单状态',
        prop: 'validStart',
        overHidden: true,
        width: 120
      },
      {
        label: '有效期限',
        prop: 'validEnd',
        slot:true,
        width: 160
      },
      {
        label: '订单归属',
        prop: 'belongName',
        overHidden: true,
        width: 100,
        slot: true
      },
      {
        label: '创建时间',
        prop: 'createTime',
        overHidden: true,
        width: 150
      },
      {
        label: '下单来源',
        prop: 'orderSource',
        overHidden: true,
        width: 100,
        slot:true
      }
    ]
  }

  export const tablePersonalOption = {
    border: true,
    addBtn: false,
    header: false,
    delBtn: false,
    editBtn: false,
    menuWidth: '150px',
    align: 'center',
    column : [
      {
        label: '订单编号',
        prop: 'orderNo',
        overHidden: true,
        width: 170,
        slot: true
      },
      {
        label: '会员产品名称',
        prop: 'vipProductName',
        overHidden: true,
        width: 160
      },
      {
        label: '主体ID',
        prop: 'userNo',
        width: 100
      },
      {
        label: '主体名称',
        prop: 'authName',
        overHidden: true,
        width: 150,
        slot:true
      },
      {
        label: '联系方式',
        prop: 'accountMobileNotSensitive',
        width: 120
      },
      {
        label: '订单金额',
        prop: 'orderAmount',
        width:120
      },
      {
        label: '订单状态',
        prop: 'validStart',
        overHidden: true,
        width: 120
      },
      {
        label: '有效期限',
        prop: 'validEnd',
        slot:true,
        width: 160
      },
      {
        label: '订单归属',
        prop: 'belongName',
        overHidden: true,
        width: 100,
        slot: true
      },
      {
        label: '创建时间',
        prop: 'createTime',
        overHidden: true,
        width: 150
      },
      {
        label: '下单来源',
        prop: 'orderSource',
        overHidden: true,
        width: 100,
        slot:true
      }
    ]
  }