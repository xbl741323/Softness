export const personOption = {
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
    menu: false,
    border: true,
    column: [{
        label: '流程编号',
        prop: 'flowNo',
        width: 150,
        overHidden: true,
        slot:true
      },{
        label: '主体ID',
        prop: 'userNo',
        width: 120,
        overHidden: true,
      }, 
      {
        label: '用户姓名',
        prop: 'personName',
        overHidden: true,
        width: 180
      }, 
      {
        label: '身份证号码',
        prop: 'idCard',
        overHidden: true,
      },
      {
        label: '操作内容',
        prop: 'opContent',
        width: 120,
        slot: true
      },
      {
        label: '认证来源',
        prop: 'autClient',
        overHidden: true,
        slot:true
      }, 
      {
        label: '流程状态',
        prop: 'status',
        width: 130,
        overHidden: true,
        slot: true
      }, 
      {
        label: '发起时间',
        prop: 'createTime',
        overHidden: true,
        width: 160,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm:ss',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        overHidden: true,
      },
       {
        label: '处理时间',
        prop: 'auditorTime',
        width: 160,
        overHidden: true,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm:ss',
        valueFormat: 'yyyy-MM-dd HH:mm:ss'
      }
    ]
  }
  