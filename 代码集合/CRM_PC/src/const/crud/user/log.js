export const tableOption = {
    index:true,
    indexLabel:'序号',
    reserveSelection:true,
    stripe: true,
    selectClearBtn: false,
    refreshBtn:false,
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn:false,
    align:'center',
    menu:false,
    border: true,
    column: [{
        label: '生成时间',
        prop: 'gmtCreate',
        width:120,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss'
    },{
        label: '用户ID',
        prop: 'userNo',
        width:120,
    },{
        label: '日志类型',
        prop: 'logTypeName',
        width:200,
    },{
        label: '数据标题',
        prop: 'title',
        overHidden:true,
        width:400,
        slot: true
    },{
        label: 'IP地址',
        prop: 'ipStr',
    },{
        label: '端口',
        prop: 'terminalType',
        slot: true
    },{
        label: '地区',
        prop: 'ipArea',
    }]
  }
  