export const tableOption = {
    menu:true,    
    formWidth: '1100px',
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
    column: [
        {
          label: '序号',
          prop: 'number',
          width:64
        },
        {
          label: '导航名称',
          prop: 'name'
        },
        {
          label: '二级导航',
          prop: 'isTwo',
          slot:true
        },
        {
          label: '导航类型',
          prop: 'type',
          slot:true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          overHidden: true,
        },
        {
          label: '状态',
          slot:true,
          prop: 'status',
          width:100
        }
      ]
}

