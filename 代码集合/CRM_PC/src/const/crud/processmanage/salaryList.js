export const personalOption = {
  border: true,
  header: false,
  refreshBtn: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  menuBtn: false,
  align: "center",
  selection: false,
  menuAlign: "center",
  menu: true,
  menuWidth: "140",
  column: [
    {
      label: "流程编号",
      prop: "flowNo",
      overHidden: true,
      slot: true
    },
    {
      label: "任务名称",
      prop: "jobName",
      overHidden: true
    },
    {
      label: "被考核人",
      prop: "appraiseName",
      overHidden: true,
      slot: true
    },
    {
      label: "部门",
      prop: "deptFullName",
      overHidden: true,
    },
    {
      label: "待处理人",
      prop: "handlerNames",
      with: 200,
      slot: true
    },
    {
      label: "流程状态",
      prop: "processState",
      overHidden: true,
      slot: true
    },
    {
      label: "发起时间",
      prop: "createTime",
      overHidden: true,
    },
    {
      label: "审核通过时间",
      prop: "passTime",
      overHidden: true,
      slot: true
    },
  ]
}

export const tableOption = {
  border: true,
  header: false,
  refreshBtn: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  menuBtn: false,
  align: "center",
  selection: false,
  menuAlign: "center",
  menu: true,
  menuWidth: "140",
  column: [
    {
      label: "流程编号",
      prop: "flowNo",
      overHidden: true,
      slot: true
    },
    {
      label: "任务名称",
      prop: "jobName",
      overHidden: true
    },
    {
      label: "被考核人",
      prop: "appraiseName",
      overHidden: true,
      slot: true
    },
    {
      label: "部门",
      prop: "deptFullName",
      overHidden: true,
    },
    {
      label: "待处理人",
      prop: "handlerNames",
      with: 200,
      slot: true
    },
    {
      label: "流程状态",
      prop: "processState",
      overHidden: true,
      slot: true
    },
    {
      label: "发起时间",
      prop: "createTime",
      overHidden: true,
    },
    {
      label: "审核通过时间",
      prop: "passTime",
      overHidden: true,
      slot: true
    },
  ]
}