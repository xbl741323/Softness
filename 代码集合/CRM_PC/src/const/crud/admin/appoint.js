export const listOption = {
    index: true,
    indexLabel: '序号',
    reserveSelection: false,
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
    border: true,
    column: [{
        label: '权限名称',
        prop: 'permissionName',
        overHidden: true,
        slot:true
      },
      {
        label: '权限人',
        prop: 'name',
        width:500,
        overHidden: true,
        slot:true
      }, 
      {
        label: '验证码',
        prop: 'isCode',
        overHidden: true,
      },
    
       {
        label: '更新时间',
        prop: 'updateTime',
        overHidden: true,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss'
      }
    ]
  }
  