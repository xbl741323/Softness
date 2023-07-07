export const tableOption = {
  selection: true,
  // selectable:(row)=>{
  //     return row.deleted===0;
  // },
  reserveSelection: false,
  selectClearBtn: false,
  addBtn: false,
  menu: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  border: true,
  column: [
      {
        label: '文件名称',
        prop: 'fileName',
        overHidden: true,
        slot: true
      },  
      {
        label: '更新时间',
        prop: 'updateTime',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm:ss',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        overHidden: true,
        width: 250,
        slot: true
      }, 
      {
        label: '更新人',
        prop: 'updateByName',
        overHidden: true,
        width: 200,
        slot:true
      }, 
      {
        label: '文件类型',
        prop: 'fileType',
        overHidden: true,
        width: 200,
        slot:true
      }, 
      {
        label: '大小',
        prop: 'fileSize',
        overHidden: true,
        width: 200,
        slot:true
      }, 
      {
        label: '关联编号',
        prop: 'sourceNo',
        overHidden: true,
        width: 250,
        slot:true,
      }
  ]
}

export const tablesOption = {
  selection: true,
  // selectable:(row)=>{
  //     return row.deleted===0;
  // },
  reserveSelection: false,
  selectClearBtn: false,
  addBtn: false,
  menu: false,
  header: false,
  editBtn: false,
  delBtn: false,
  align: 'center',
  border: true,
  column: [
      {
        label: '文件名称',
        prop: 'fileName',
        width: 280,
        overHidden: true,
        slot: true,
      },  
      {
        label: '申请号',
        prop: 'patentApplicationNo',
        overHidden: true,
        slot: true
      }, 
      {
        label: '专利名称',
        prop: 'patentName',
        overHidden: true,
        slot: true
      },  
      {
        label: '申请日',
        prop: 'applyTime',
        type: 'datetime',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        overHidden: true,
        slot: true
      }, 
      {
        label: '下证日',
        prop: 'passTime',
        type: 'datetime',
        format: 'yyyy-MM-dd',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        overHidden: true,
        slot: true
      }, 
      {
        label: '专利类型',
        prop: 'patentType',
        overHidden: true,
        slot:true
      },
      {
        label: '更新时间',
        prop: 'updateTime',
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm:ss',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        overHidden: true,
        slot: true
      }, 
      {
        label: '更新人',
        prop: 'updateByName',
        overHidden: true,
        slot:true
      }, 
      {
        label: '文件类型',
        prop: 'fileType',
        overHidden: true,
        slot:true
      }, 
      {
        label: '大小',
        prop: 'fileSize',
        overHidden: true,
        slot:true
      }, 
      {
        label: '关联编号',
        prop: 'sourceNo',
        overHidden: true,
        slot:true
      }
  ]
}
