export const tableOption = {
  selectable: (row) => {
    return row.checked == false;
  },
  border: true,
  header: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  menu: false,
  align: "center",
  selection: true,
  reserveSelection:true,
  column: [
    {
      label: "产品编号",
      prop: "spuCode",
      overHidden: true,
      slot: true
    },
    {
      label: "产品类型",
      prop: "categoryName",
      overHidden: true,
      slot: true
    },
    {
      label: "产品名称",
      prop: "spuTitle",
      overHidden: true,
      slot: true
    },
  ]
}