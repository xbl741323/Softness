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
      overHidden: true,
    },
    {
      label: "工号",
      prop: "createNo",
      overHidden: true,
    },
    {
      label: "部门",
      prop: "deptName",
      overHidden: true
    },
    {
      label: "见面总数",
      prop: "meetingsCount",
      overHidden: true,
    },
    {
      label: "关联总数",
      prop: "associationsCount",
      overHidden: true,
    },
    {
      label: "未关联总数",
      prop: "unassociatedCount",
      overHidden: true,
    }
  ]
}