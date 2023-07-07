export const tableOption = {
    // selection: true,
    // selectable:(row,index)=>{
    //     return row.deleted===0;
    //   },
    // reserveSelection: true,
    selectClearBtn: false,
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menuAlign: 'center',
    border: true,
    column: [
        {
            label: '分类名称',
            prop: 'name',
            slot:true
        }, 
        {
            label: '选项名称',
            prop: 'optionName',
            // overHidden: true,
            slot: true
        },  
        {
            label: '链接地址',
            prop:'url',
            slot:true
        },
        {
            label: '显示状态',
            prop:'status',
            slot:true
        },
    ]
}
  