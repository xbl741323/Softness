export const tableOption = {
  selection: true,
  reserveSelection: true,
  index: true,
  indexLabel: '序号',
  border: true,
  header: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  menu: true,
  menuWidth: '100px',
  align: "center",
  menuAlign: "center",
  column: [
    {
      label: "客户名称",
      prop: "customerName",
      overHidden: true,
    },
    {
      label: "跟进内容",
      prop: "followContent",
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
      slot: true,
      overHidden: true,
    },
    {
      label: "跟进时间",
      prop: "createTime",
      overHidden: true,
    },
  ]
}

export const relatedOption = {
  index: true,
  indexLabel: '序号',
  border: true,
  header: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  menu: false,
  menuWidth: '100px',
  align: "center",
  menuAlign: "center",
  column: [
    {
      label: "客户名称",
      prop: "customerName",
      overHidden: true,
    },
    {
      label: "跟进内容",
      prop: "followContent",
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
      slot: true,
      overHidden: true,
    },
    {
      label: "跟进时间",
      prop: "createTime",
      width: 140,
      overHidden: true,
    },
    {
      label: "线索编号",
      prop: "clueNo",
      width: 150,
      overHidden: true,
    },
    {
      label: "线索名称",
      prop: "clueName",
      overHidden: true,
    },
  ]
}