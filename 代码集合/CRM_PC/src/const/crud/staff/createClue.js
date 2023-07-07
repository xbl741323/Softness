export const clueOption = {
    reserveSelection: true,
    stripe: true,
    selectClearBtn: false,
    refreshBtn: false,
    addBtn: false,
    header: true,
    editBtn: false,
    delBtn: false,
    header: false,
    align: 'center',
    menuAlign: 'center',
    menuWidth: 150,
    border: true,
    column: [{
      label: '工号',
      prop: 'userNo',
      slot: true,
      sortable: true,
      overHidden: true,
    }, {
      label: '姓名',
      prop: 'userName',
      slot: true,
      overHidden: true,
    }, {
      label: '部门',
      prop: 'deptName',
      overHidden: true,
    },
    {
      label: '创建线索数量',
      prop: 'clueCount',
      slot: true,
      sortable: 'custom',
      overHidden: true,
    },]
  }
  
  
  