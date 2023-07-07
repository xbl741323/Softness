export const tableOption = {
  reserveSelection: true,
  selectClearBtn: false,
  refreshBtn: false,
  addBtn: false,
  header: true,
  editBtn: false,
  delBtn: false,
  header: false,
  align: 'center',
  menuAlign: 'center',
  menuWidth: 150,
  border: true,
  index: true,
  indexLabel: '序号',
  column: [{
      label: '站点名称',
      prop: 'substationName',
      slot: true,
      overHidden: true,
    }, {
      label: '站点域名',
      prop: 'substationRealmName',
      overHidden: true,
    }, {
      label: '权限人',
      prop: 'permissionName',
      overHidden: true,
    }, {
      prop: 'canCopy',
      overHidden: true,
      slot: true,
      headerSlot: 'canCopyHeader',
    },
    {
      label: '创建时间',
      prop: 'createTime',
      sortable: "custom",
      overHidden: true,
    },
    {
      label: '上线时间',
      prop: 'onlineTime',
      sortable: "custom",
      overHidden: true,
    }
  ]
}
