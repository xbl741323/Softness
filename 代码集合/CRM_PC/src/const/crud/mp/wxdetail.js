export const tableOption = {
    menu:false,
    index: true,
    indexLabel: '序号',
    formWidth: '1200px',
    align: 'center',
    selectionFixed:false,
    expandFixed:false,
    menuFixed:false,
    menuAlign:'center',
    border: true,
    editBtn: false,
    refreshBtn: false,
    enter:true,
    delBtn: false,
    addBtn:false,
    columnBtn: false,
    column:[{
        label:'提醒类型',
        prop:'planId',
        slot:true,
        width:200
        },{
        label:'接收对象',
        prop:'receRemark',
        width: 200,
        slot:true,
        },{
        label:'提醒文案',
        prop:'msgHead',
        slot:true,
        },{
        label:'提醒状态',
        prop:'receStatus',
        align: 'center',
        width:100,
        slot:true,
        },{
        label:'创建时间',
        prop:'gmtCreate',
        slot:true,
        },{
        label: '操作',
        prop: 'menu',
        slot: true,
        width:250
    }]
}
