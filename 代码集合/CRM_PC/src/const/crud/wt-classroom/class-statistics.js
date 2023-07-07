export const tableOption = {
  addBtn: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  menuAlign: 'center',
  menuWidth: 220,
  menu: false,
  border: true,
  column: [
    {
      label: '课程标题',
      prop: 'classTitle',
      overHidden: true,
      width: 400,
      slot: true
    },
    {
      label: '专业分类',
      prop: 'themeType',
      overHidden: true,
      slot: true
    },
    {
      label: '收费类型',
      prop: 'tradingChargeType',
      overHidden: true,
      slot: true
    },
    {
      label: '浏览量',
      prop: 'viewNumber',
      sortable: "custom",
      overHidden: true,
      slot: true
    },
    {
      label: '播放量',
      prop: 'playNumber',
      sortable: "custom",
      overHidden: true,
      slot: true
    },
    // {
    //   label: '收藏量',
    //   prop: 'collectNumber',
    //   sortable: true,
    //   overHidden: true,
    //   slot: true
    // },
    {
      label: '订阅量',
      prop: 'subscribeNumber',
      sortable: "custom",
      overHidden: true,
      slot: true
    }
  ]
}
