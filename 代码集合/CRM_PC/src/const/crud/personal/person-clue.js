export const tableOption = {
  selectable: (row) => {
    return (row.clueStatusId == 0 || row.clueStatusId == 4)&&(row.noDisabled == true)
  },
  border: true,
  header: false,
  refreshBtn: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  menuBtn: false,
  align: "center",
  selection: true,
  menuAlign: "center",
  menu:false,
  menuWidth: "140",
  column: [
    {
      label: "线索编号",
      prop: "clueNo",
      overHidden: true,
      width: 160,
      fixed: true,
      slot: true
    },
    {
      label: "单位名称",
      prop: "companyName",
      width: 160,
      overHidden: true,
      fixed: true,
      slot: true
    },
    {
      label: "统一社会信用代码",
      prop: "organization",
      overHidden: true,
      slot: true,
      width: 180
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
      overHidden: true,
      width: 90,
      slot: true
    },
    {
      label: "联系人1",
      prop: "contactName",
      width: 70,
      overHidden: true,
    },
    {
      label: "联系方式",
      width: 100,
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
    return (row.clueStatusId == 0 || row.clueStatusId == 4)&&(row.noDisabled == true)
  },
  border: true,
  refreshBtn: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  menu: true,
  header: false,
  align: "center",
  selection: true,
  menuAlign: "center",
  menu:false,
  menuWidth: "140",
  column: [
    {
      label: "线索编号",
      prop: "clueNo",
      overHidden: true,
      fixed: true,
      width: 160,
      slot: true
    },
    {
      label: "线索姓名",
      prop: "contactName",
      width: 120,
      overHidden: true,
      fixed: true,
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
      width: 160,
      prop: "companyName",
      overHidden: true
    },
    {
      label: "单位类型",
      prop: "orgType",
      slot: true,
      width: 80,
      overHidden: true
    },
    {
      label: "行业",
      prop: "industry",
      slot: true,
      width: 100,
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
      width: 80,
      slot: true,
      overHidden: true
    },
    {
      label: "线索归属",
      prop: "clueBelong",
      width: 80,
      slot: true,
      overHidden: true
    },
    {
      label: "业务员",
      prop: "salesman",
      width: 80,
      slot: true,
      overHidden: true
    },
    {
      label: "创建人",
      prop: "createMan",
      width: 80,
      slot: true,
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

