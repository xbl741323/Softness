export const templateTable = {
  reserveSelection:true,
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
  menuWidth: 180,
  border: true,
  column :[
    {
      label:'模板编号',
      prop:'templateId'
    },
    {
      label:'模板名称',
      prop:'templateName',
      slot: true
    },
    {
      label: '关联产品数量',
      prop: 'relatedSpuNum',
      width: 100,
      slot: true
    },
    {
      label:'创建时间',
      prop:'createTime'
    }
  ]
}