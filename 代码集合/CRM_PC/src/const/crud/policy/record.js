export const tableOption = {
    reserveSelection:true,
    selectClearBtn: false,
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn:false,
    menu:false,
    align:'center',
    menuAlign:'center',
    border: true,
    column: [{
      label: '操作时间',
      prop: 'createTime',
    }, {
      label: '操作人',
      prop: 'createUser',
      slot:true
    }, {
      label: '操作内容',
      prop: 'operateTypeEnum'
    }]
  }
  