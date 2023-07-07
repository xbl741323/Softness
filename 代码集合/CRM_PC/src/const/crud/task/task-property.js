export const taskonlineTableOption = {
  border: true,
  addBtn: false,
  header: false,
  delBtn: false,
  editBtn: false,
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
      slot: true,
      hide: false,
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
      showColumn: false,
      width: 180,
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
      label: '专利申请号',
      prop: 'patentNo',
      overHidden: true,
      slot: true,
      hide: false,
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

