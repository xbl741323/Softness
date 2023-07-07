export const notableOption = {
    // selection: true,
    // selectable:(row)=>{
    //     return row.deleted===0;
    // },
    reserveSelection: false,
    selectClearBtn: false,
    addBtn: false,
    menu: false,
    header: false,
    menuWidth:270,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menuAlign: 'center',
    border: true,
    column: [
        {
            label: '文件编号',
            prop: 'number',
            overHidden: true,
            width:220
        }, 
        {
            label: '文件名称',
            prop: 'name',
            overHidden: true,
            width:300
        },  
        {
            label: '上传人',
            prop: 'createUserName',
            overHidden: true,
            slot:true
        }, 
        {
            label: '添加时间',
            prop: 'createTime',
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            overHidden: true,
        },
    ]
}
  