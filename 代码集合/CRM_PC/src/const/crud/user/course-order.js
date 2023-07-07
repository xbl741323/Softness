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
        label: '课程名称',
        prop: 'baseTitle',
        overHidden: true,
        width: 200
      },
      {
        label: '专业类型',
        prop: 'professionIds',
        overHidden: true,
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
        width: 100,
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
      }
    ]
  }