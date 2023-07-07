export const listOption = {
  reserveSelection: false,
  stripe: true,
  selectClearBtn: false,
  refreshBtn: false,
  addBtn: false,
  header: true,
  editBtn: false,
  delBtn: false,
  header: false,
  align: "center",
  menuWidth: "180",
  menuAlign: "center",
  border: true,
  column: [
    {
      label: "流程编号",
      prop: "taskNo",
      width: 150,
      overHidden: true,
      slot: true
    },
    {
      label: "合同编号",
      prop: "contractNo",
      width: 150,
      overHidden: true
    },
    {
      label: "客户名称",
      prop: "corporateName",
      overHidden: true,
      width: 180,
      slot: true
    },
    {
      label: "开票金额",
      prop: "invoiceAmount",
      overHidden: true,
      slot: true
    },
    {
      label: "费用类型",
      prop: "amountType",
      overHidden: true,
      slot: true
    },
    {
      label: "发起人",
      prop: "taskCommitName",
      width: 120,
      overHidden: true,
      slot: true
    },
    {
      label: "待处理人",
      prop: "taskCurrentName",
      overHidden: true,
      width: 120,
      slot: true
    },
    {
      label: "流程状态",
      prop: "taskStatus",
      width: 135,
      overHidden: true,
      slot: true
    },
    {
      label: "发起时间",
      prop: "gmtCreate",
      overHidden: true,
      width: 160,
      type: "datetime",
      format: "yyyy-MM-dd HH:mm",
      valueFormat: "yyyy-MM-dd HH:mm:ss",
      overHidden: true
    },
    {
      label: "处理时间",
      prop: "auditTime",
      width: 160,
      overHidden: true,
      type: "datetime",
      format: "yyyy-MM-dd HH:mm",
      valueFormat: "yyyy-MM-dd HH:mm:ss"
    }
  ]
};
