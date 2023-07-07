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
      overHidden: true,
      slot: true
    },
    {
      label: "合同编号/补充协议编号",
      prop: "contractNo",
      width: 190,
      overHidden: true
    },
    {
      label: "客户名称",
      prop: "authName",
      overHidden: true
    },
    {
      label: "发起人",
      prop: "createByName",
      overHidden: true,
      slot: true
    },
    {
      label: "待处理人",
      prop: "handlerName",
      overHidden: true,
      slot: true
    },
    {
      label: "流程状态",
      prop: "taskStatus",
      overHidden: true,
      slot: true
    },
    {
      label: "发起时间",
      prop: "createTime",
      overHidden: true
    },
    {
      label: "处理时间",
      prop: "auditTime",
      overHidden: true,
      slot: true
    }
  ]
};
export const listAlterOption = {
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
      prop: "flowNo",
      overHidden: true,
      slot: true
    },
    {
      label: "订单编号",
      prop: "orderNo",
      width: 190,
      overHidden: true
    },
    {
      label: "订单类型",
      prop: "orderType",
      overHidden: true,
      slot: true
    },
    {
      label: "客户名称",
      prop: "customerName",
      overHidden: true
    },
    {
      label: "发起人",
      prop: "createByName",
      overHidden: true,
      slot: true
    },
    {
      label: "待处理人",
      prop: "handleByName",
      overHidden: true,
      slot: true
    },
    {
      label: "流程状态",
      prop: "flowStatus",
      overHidden: true,
      slot: true
    },
    {
      label: "发起时间",
      prop: "createTime",
      overHidden: true
    },
    {
      label: "处理时间",
      prop: "handleTime",
      overHidden: true,
      slot: true
    }
  ]
};
export const primaryListOption = {
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
      prop: "flowNo",
      overHidden: true,
      slot: true
    },
    {
      label: "线索编号",
      prop: "clueNo",
      width: 190,
      overHidden: true
    },
    {
      label: "线索名称",
      prop: "clueName",
      overHidden: true
    },
    {
      label: "信用代码/身份证号",
      prop: "organization",
      width: 160,
      slot: true,
      overHidden: true
    },
    {
      label: "类型",
      prop: "type",
      overHidden: true
    },
    {
      label: "发起人",
      prop: "createByName",
      overHidden: true,
      slot: true
    },
    {
      label: "待处理人",
      prop: "auditName",
      overHidden: true,
      slot: true
    },
    {
      label: "流程状态",
      prop: "flowStatus",
      overHidden: true,
      slot: true
    },
    {
      label: "发起时间",
      prop: "createTime",
      overHidden: true
    },
    {
      label: "处理时间",
      prop: "dealTime",
      overHidden: true,
      slot: true
    }
  ]
};
export const taskListOption = {
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
      prop: "flowNo",
      overHidden: true,
      slot: true
    },
    {
      label: "订单编号",
      prop: "orderNo",
      width: 190,
      overHidden: true
    },
    {
      label: "主体名称",
      prop: "subjectName",
      overHidden: true
    },
    {
      label: "产品名称",
      prop: "spuName",
      overHidden: true
    },
    {
      label: "发起人",
      prop: "createByName",
      overHidden: true,
      slot: true
    },
    {
      label: "待处理人",
      prop: "preAuditorName",
      overHidden: true,
      slot: true
    },
    {
      label: "流程状态",
      prop: "flowStatus",
      overHidden: true,
      slot: true
    },
    {
      label: "发起时间",
      prop: "createTime",
      overHidden: true
    },
    {
      label: "处理时间",
      prop: "auditTime",
      overHidden: true,
      slot: true
    }
  ]
};
export const taskInfoOption = {
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
      prop: "flowNo",
      overHidden: true,
      slot: true
    },
    {
      label: "订单编号",
      prop: "clueNo",
      width: 190,
      overHidden: true
    },
    {
      label: "主体名称",
      prop: "clueName",
      overHidden: true
    },
    {
      label: "产品名称",
      prop: "type",
      overHidden: true
    },
    {
      label: "发起人",
      prop: "createByName",
      overHidden: true,
      slot: true
    },
    {
      label: "待处理人",
      prop: "preAuditorName",
      overHidden: true,
      slot: true
    },
    {
      label: "流程状态",
      prop: "flowStatus",
      overHidden: true,
      slot: true
    },
    {
      label: "发起时间",
      prop: "createTime",
      overHidden: true
    },
    {
      label: "处理时间",
      prop: "dealTime",
      overHidden: true,
      slot: true
    }
  ]
};