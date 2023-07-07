export const companyOption = {
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
    menu:false,
    border: true,
    column: [{
        label: '流程编号',
        prop: 'flowNo',
        width: 150,
        overHidden: true,
      },{
        label: '主体ID',
        prop: 'userNo',
        width: 120,
        overHidden: true,
      }, 
      {
        label: '单位名称',
        prop: 'companyName',
        overHidden: true,
      }, 
      {
        label: '统一社会信用代码',
        prop: 'organization',
        overHidden: true,
        width: 165
      }, {
        label: '授权人及手机号',
        prop: 'mobile',
        slot: true
      },{
        label: '法人及手机号',
        prop: 'legalMobile',
        width: 120,
        slot: true
      },{
        label: '操作内容',
        prop: 'opContent',
        width: 120,
        slot: true
      },{
        label: '认证方式',
        prop: 'verifyType',
        width: 120,
        slot: true
      },{
        label: '认证来源',
        prop: 'autClient',
        width: 120,
        slot: true
      },{
        label: '流程状态',
        prop: 'status',
        width: 120,
        slot: true
      },
      {
        label: '发起时间',
        prop: 'createTime',
        overHidden: true,
        width: 130,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss'
      },
       {
        label: '处理时间',
        prop: 'auditorTime',
        width: 130,
        overHidden: true,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss'
      },
    ]
  }
  