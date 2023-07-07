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
  menuWidth: "180",
  menuAlign: 'center',
  border: true,
  column: [{
    label: '流程编号',
    prop: 'taskNo',
    overHidden: true,
    slot: true
  }, {
    label: '文章名称',
    prop: 'title',
    width: 350,
    overHidden: true
  }
    // {
    //     label: '流程名称',
    //     prop: 'taskName',
    //     width:165,
    //     overHidden:true,
    // }
    , {
    label: '发起人',
    prop: 'taskCommitName',
    overHidden: true,
    slot: true
  },
  // {
  //   label: '待处理人',
  //   prop: 'taskCurrentName',
  //   overHidden: true,
  //   width: 185,
  //   slot: true
  // },
  // {
  //     label: '流程状态',
  //     prop: 'taskType',
  //     width:140,
  //     overHidden:true,
  //     slot:true
  // }
  {
    label: '流程状态',
    prop: 'taskStatus',
    overHidden: true,
    slot: true
  },
  {
    label: '发起时间',
    prop: 'gmtCreate',
    overHidden: true,
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    overHidden: true,
  },
  {
    label: '处理时间',
    prop: 'auditTime',
    overHidden: true,
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  }
  ]
}
