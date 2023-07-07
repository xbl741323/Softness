export const tableOption = {
  index: true,
  indexLabel: '序号',
  border: true,
  header: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  align: "center",
  selection: false,
  menuAlign: "center",
  menu: false,
  column: [
    {
      label: "员工姓名",
      prop: "createName",
      width: 120,
      overHidden: true,
    },
    {
      label: "工号",
      prop: "createNo",
      width: 120,
      overHidden: true,
    },
    {
      label: "部门",
      prop: "deptName",
      width: 140,
      overHidden: true
    },
    {
      label: "客户名称",
      prop: "customerName",
      overHidden: true,
    },
    {
      label: "打卡定位",
      prop: "locationName",
      overHidden: true,
      slot: true
    },
    {
      label: "打卡照片",
      prop: "locationImg",
      width: 120,
      slot: true,
      overHidden: true,
    },
    {
      label: "跟进内容",
      prop: "followContent",
      overHidden: true,
      slot: true
    },
    {
      label: "跟进时间",
      prop: "createTime",
      width: 150,
      overHidden: true,
    },
    {
      label: "线索编号",
      prop: "clueNo",
      overHidden: true,
    },
    {
      label: "线索名称",
      prop: "clueName",
      overHidden: true,
    },
  ]
}