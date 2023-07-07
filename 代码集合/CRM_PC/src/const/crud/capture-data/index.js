export const captureTableOption = {
    border: true,
    addBtn: false,
    header: false,
    delBtn: false,
    editBtn: false,
    refreshBtn: false,
    menuWidth: '250px',
    align: 'center',
    selection: true,
    column : [
      {
        label: '标题',
        prop: 'title',
        overHidden: true,
        slot: true,
      },
      {
        label: '来源',
        prop: 'source',
        overHidden: true,
        width:250
      },
      {
        label: '网址',
        prop: 'url',
        overHidden: true,
        slot: true,
        width: 300
      },
      {
        label: '抓取时间',
        prop: 'createTime',
        overHidden: true,
        width: 200
      },
    ]
  }