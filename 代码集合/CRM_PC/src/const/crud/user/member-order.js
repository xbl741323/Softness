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
        slot: true
      },
      {
        label: '会员产品名称',
        prop: 'vipProductName',
        overHidden: true,
      },
      {
        label: '订单金额',
        prop: 'orderAmount',
        width: 150
      },
      {
        label: '订单状态',
        prop: 'validStart',
        overHidden: true,
      },
      {
        label: '有效期限',
        prop: 'validEnd',
        slot:true,
      },
      {
        label: '订单归属',
        prop: 'belongName',
        overHidden: true,
        width: 150,
        slot: true
      },
      {
        label: '创建时间',
        prop: 'createTime',
        overHidden: true,
      }
    ]
  }