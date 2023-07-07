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
        label: '课程名称',
        prop: 'baseTitle',
        overHidden: true,
        width: 150
      },
      {
        label: '专业类型',
        prop: 'professionIds',
        overHidden: true,
        width: 150
      },
      {
        label: '主体ID',
        prop: 'userNo',
        width: 100
      },
      {
        label: '主体名称',
        prop: 'authName',
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
        width: 100,
        slot:true
      },
      {
        label: '订单状态',
        prop: 'orderStatus',
        overHidden: true,
        width: 100
      },
      {
        label: '课程期限',
        prop: 'updateTime',
        overHidden: true,
        slot: true
      },
      {
        label: '订单归属',
        prop: 'belongName',
        overHidden: true,
        width: 100,
        slot: true
      },
      {
        label: '下单时间',
        prop: 'createTime',
        overHidden: true,
        width: 150
      },
      {
        label: '下单来源',
        prop: 'orderSource',
        overHidden: true,
        width: 80,
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
        label: '课程名称',
        prop: 'baseTitle',
        overHidden: true,
        width: 150
      },
      {
        label: '专业类型',
        prop: 'professionIds',
        overHidden: true,
        width: 150
      },
      {
        label: '主体ID',
        prop: 'userNo',
        width: 100
      },
      {
        label: '主体名称',
        prop: 'authName',
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
        width: 100,
        slot:true
      },
      {
        label: '订单状态',
        prop: 'orderStatus',
        overHidden: true,
        width: 100
      },
      {
        label: '课程期限',
        prop: 'updateTime',
        overHidden: true,
        slot: true
      },
      {
        label: '订单归属',
        prop: 'belongName',
        overHidden: true,
        width: 100,
        slot: true
      },
      {
        label: '下单时间',
        prop: 'createTime',
        overHidden: true,
        width: 150
      },
      {
        label: '下单来源',
        prop: 'orderSource',
        overHidden: true,
        width: 80,
        slot:true
      }
    ]
  }