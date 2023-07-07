export const listOption = {
    index:true,
    indexLabel:'序号',
    reserveSelection:false,
    stripe: true,
    selectClearBtn: false,
    refreshBtn:false,
    addBtn: false,
    header: true,
    editBtn: false,
    delBtn:false,
    header:false,
    align:'center',
    menuAlign:'center',
    border: true,
    column: [{
        label: '流程编号',
        prop: 'taskNo',
        width:135,
        overHidden:true,
        slot:true
    },{
        label: '流程类型',
        prop: 'taskName',
        width:130,
        overHidden:true,
    },{
        label: '用户/客户名称',
        prop: 'customerName',
        width:235,
        overHidden:true,
        slot:true,     
    },{
        label: '发起人',
        prop: 'taskCommitName',
        width:165,
        overHidden:true,
        slot:true     
    },{
        label: '待处理人',
        prop: 'taskCurrentName',
        overHidden:true,
        width:165,
        slot:true
    },
    {
        label: '流程状态',
        prop: 'taskStatus',
        width:135,
        overHidden:true,
        slot:true
    },
    {
        label: '发起时间',
        prop: 'gmtCreate',
        overHidden:true,
        width:180,
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',  
        overHidden:true,  
    },
    {
        label: '处理时间',
        prop: 'auditTime',
        width:180,  
        overHidden:true,  
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss'
    }]
  }
  