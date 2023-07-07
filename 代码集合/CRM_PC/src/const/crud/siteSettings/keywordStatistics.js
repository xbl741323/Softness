export const tableOption = {
    selectClearBtn: false,
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menuAlign: 'center',
    border: true,
    index:true,
    menu:false,
    indexLabel:'序号',
    column: [
        {
            label: '位置',
            prop: 'showLocation',
            // slot:true
        }, 
        {
            label: '关键词',
            prop: 'keyword',
            // overHidden: true,
            // slot: true
        },  
        {
            label: '搜索次数',
            prop:'total',
            // slot:true
        }
    ]
}
  