export const unknowOptions = {
  selection: true,
  reserveSelection: true,
  stripe: true,
  selectClearBtn: false,
  refreshBtn: false,
  addBtn: false,
  menu: true,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuAlign: 'center',
  menuWidth: 160,
  border: true,
  column: [
    {
      label: '主体ID',
      prop: 'userNo',
      overHidden: true,
      width: 0,
    },
    {
      label: '用户名',
      prop: 'username',
      slot: true,
      overHidden: true
    },
    {
      label: '登录ID',
      prop: 'accountNo',
      overHidden: true,
      slot: true
    },
    {
      label: '联系人',
      prop: 'personName',
      overHidden: true,
    },
    {
      label: '手机号',
      prop: 'mobile',
      overHidden: true,
    },
    {
      label: '客服',
      prop: 'customerServerName',
      overHidden: true,
      slot: true,
    },
    {
      label: '推广归属',
      prop: 'promoteAttributionName',
      overHidden: true,
      slot: true,
    },
    {
      label: '注册时间',
      prop: 'regCreateTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm'
    }
  ]
}
