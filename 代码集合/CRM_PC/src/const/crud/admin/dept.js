export const dept = {
    addBtn: false,
    header: false,
    delBtn: false,
    editBtn:false,
    align: 'center',
    border: true,
    // menu:false,
    index:true,
    column: [
        {
            label: '部门名称',
            prop: 'deptTree',
            slot: true
        }, 
        {
            label: '负责人',
            prop: 'leader',
            slot: true,
        },  
        {
            label: '成员数量',
            prop:'manCount',
        },
        {
            label: '添加时间',
            prop:'createTime',
        },
        // {
        //     label: '操作',
        //     slot:true
        // },
    ]
}
  