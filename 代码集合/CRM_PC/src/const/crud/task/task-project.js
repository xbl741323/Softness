export const taskTableOption = {
  border: true,
  addBtn: false,
  header: false, // 控制头部按钮是否显示
  delBtn: false,
  editBtn: false,
  columnBtn: false, // 原始控制按钮显隐
  refreshBtn: false, // 原始控制按钮刷新
  menu: false,
  tip: false,
  align: 'center',
  selection: true,
  selectable: (row) => {
    return !row.disabled && row.taskStatus != 2;
  },
  column: [
    {
      label: '任务编号',
      prop: 'taskNo',
      overHidden: true,
      width: 170,
      hide: false, // hide 控制是否隐藏
      slot: true
    },
    {
      label: '订单编号',
      prop: 'orderNo',
      overHidden: true,
      slot: true,
      hide: true,
    },
    {
      label: '优先级',
      prop: 'priority',
      overHidden: true,
      slot: true,
      hide: true,
    },
    {
      label: '任务名称',
      prop: 'spuName',
      width: 180,
      showColumn: false, // showColumn 控制是否参与自定义列显隐
      overHidden: true
    },
    {
      label: '交付物名称',
      prop: 'deliveryName',
      overHidden: true,
      slot: true,
      hide: true,
    },
    {
      label: '客户名称',
      prop: 'subjectName',
      showColumn: false,
      overHidden: true,
    },
    {
      label: '工程师',
      prop: 'engineerName',
      showColumn: false,
      overHidden: true,
      slot: true,
    },
    {
      label: '业务员',
      prop: 'clueSalesmanEmpName',
      showColumn: false,
      overHidden: true,
      slot: true,
    },
    {
      label: '当日跟进',
      prop: 'cFollowStatus',
      overHidden: true,
      slot: true,
      hide: false,
    },
    {
      label: '创建时间',
      prop: 'createTime',
      overHidden: true,
      sortable: "custom",
      hide: false,
    },
    {
      label: '交付时间',
      prop: 'deliveryTime',
      overHidden: true,
      slot: true,
      hide: true,
    },
    {
      label: '任务进度',
      prop: 'taskStatus',
      showColumn: false,
      overHidden: true,
      slot: true,
    },
  ]
}