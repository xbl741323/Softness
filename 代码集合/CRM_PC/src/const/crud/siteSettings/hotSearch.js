export const tableOption = {
    selection: false,
    // selectable:(row,index)=>{
    //     return row.deleted===0;
    //   },
    reserveSelection: true,
    selectClearBtn: false,
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    // menuAlign: 'center',
    menu:false,
    border: true,
    // index:true,
    column: [
        {
            label: '显示位置',
            prop: 'showLocation',
            width:'200px'
        }, 
        {
            label: '热门关键词',
            prop: 'keyword',
            // overHidden: true,
            slot: true,
            width:'400px'
        },  
        {
            label: '显示状态',
            prop:'status',
            slot:true,
            width:'200px'
        },
    ]
}
  