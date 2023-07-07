export const tableOption = {
  selectable: (row) => {
    return row.clueStatusId == 0 || row.clueStatusId == 4;
  },
  border: true,
  header: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  menu: true,
  align: "center",
  selection: true,
  menuAlign: "center",
  menu: false,
  menuWidth: "90",
  column: [
    {
      label: "线索编号",
      prop: "clueNo",
      overHidden: true,
      width: 160,
      slot: true
    },
    {
      label: "单位名称",
      prop: "companyName",
      width: 190,
      overHidden: true,
      slot: true
    },
    {
      label: "统一社会信用代码",
      prop: "organization",
      overHidden: true,
      slot: true,
      width: 170
    },
    {
      label: "线索标签",
      prop: "clueGradeId",
      overHidden: true,
      width: 70,
      slot: true
    },
    {
      label: "单位类型",
      prop: "orgType",
      width: 70,
      overHidden: true,
      slot: true
    },
    {
      label: "行业",
      prop: "industry",
      width: 100,
      overHidden: true,
      slot: true
    },
    {
      label: "联系方式",
      width: 90,
      prop: "mobile",
      slot: true,
      overHidden: true,
    },
    {
      label: "地区",
      prop: "orgAddress",
      overHidden: true,
      slot: true
    },
    {
      label: "客户归属",
      prop: "customerBelong",
      slot: true,
      width: 70,
      overHidden: true,
    },
    {
      label: "线索归属",
      prop: "clueBelong",
      slot: true,
      width: 70,
      overHidden: true,
    },
    {
      label: "业务员",
      prop: "salesman",
      slot: true,
      width: 70,
      overHidden: true,
    },
    {
      label: "创建人",
      prop: "createMan",
      slot: true,
      width: 70,
      overHidden: true,
    },
    {
      label: "创建时间",
      prop: "createTime",
      sortable: "custom",
      width: 130,
      overHidden: true,
    },
    {
      label: "最近跟进时间",
      prop: "followTime",
      sortable: "custom",
      width: 130,
      overHidden: true,
    },
  ]
}

export const personTableOption = {
  selectable: (row) => {
    return row.clueStatusId == 0 || row.clueStatusId == 4;
  },
  border: true,
  header: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  menu: true,
  align: "center",
  selection: true,
  menuAlign: "center",
  menu: false,
  menuWidth: "90",
  column: [
    {
      label: "线索编号",
      prop: "clueNo",
      overHidden: true,
      width: 160,
      slot: true,
    },
    {
      label: "线索姓名",
      prop: "contactName",
      width: 120,
      overHidden: true,
      slot: true
    },
    {
      label: "联系方式",
      width: 100,
      prop: "mobile",
      slot: true,
      overHidden: true,
    },
    {
      label: "线索标签",
      prop: "clueGradeId",
      width: 70,
      slot: true,
      overHidden: true,
    },
    {
      label: "单位名称",
      width: 170,
      prop: "companyName",
      overHidden: true
    },
    {
      label: "单位类型",
      prop: "orgType",
      width: 90,
      slot: true,
      overHidden: true
    },
    {
      label: "行业",
      prop: "industry",
      width: 90,
      slot: true,
      overHidden: true,
    },
    {
      label: "地区",
      prop: "orgAddress",
      slot: true,
      overHidden: true,
    },
    {
      label: "客户归属",
      prop: "customerBelong",
      slot: true,
      width: 80,
      overHidden: true,
    },
    {
      label: "线索归属",
      prop: "clueBelong",
      slot: true,
      width: 80,
      overHidden: true,
    },
    {
      label: "业务员",
      prop: "salesman",
      slot: true,
      width: 80,
      overHidden: true,
    },
    {
      label: "创建人",
      prop: "createMan",
      slot: true,
      width: 80,
      overHidden: true,
    },
    {
      label: "创建时间",
      prop: "createTime",
      sortable: "custom",
      width: 130,
      overHidden: true,
    },
    {
      label: "最近跟进时间",
      prop: "followTime",
      sortable: "custom",
      width: 130,
      overHidden: true,
    },
  ]
}

