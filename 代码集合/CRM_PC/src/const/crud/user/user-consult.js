export const consultTableOption = {
  selection: true,
  selectable: (row, index) => {
    return row.state == "0";
  },
  reserveSelection: true,
  stripe: true,
  selectClearBtn: false,
  refreshBtn: false,
  addBtn: false,
  menu: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: "center",
  menuAlign: "center",
  menuWidth: 200,
  border: true,
  column: [
    {
      label: "工单编号",
      prop: "consultNo",
      overHidden: true
    },

    {
      label: "手机号码",
      prop: "phoneNumber",
      width: 100
    },
    {
      label: "姓名",
      prop: "username",
      slot: true
    },
    {
      label: "公司名称",
      prop: "companyName",
      slot: true,
      overHidden: true
    },
    {
      label: "用户IP",
      prop: "ip"
    },
    {
      label: "来源",
      width: 90,
      prop: "origin"
    },
    {
      label: "客服",
      prop: "name",
      width: 100,
      overHidden: true
    },
    {
      label: "回复情况记录",
      prop: "replyRecord",
      slot: true,
      minWidth: 280
    },
    {
      label: "咨询时间",
      prop: "consultTime",
      width: 120,
      overHidden: true
    },
    {
      label: "回复时间",
      prop: "replyTime",
      width: 120,
      slot: true
    },
    {
      label: "操作",
      prop: "menu",
      slot: true,
      width: 140
    }
  ]
};
