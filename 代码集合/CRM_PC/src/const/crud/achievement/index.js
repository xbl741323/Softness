export const achievementTableOption = {
  selectable:(row)=>{
    return ( row.status != 3 && row.status != 4 && row.status != 5);
  },
  border: true,
  addBtn: false,
  header: false,
  delBtn: false,
  columnBtn: true,
  editBtn: false,
  menu: true,
  menuWidth: '180px',
  align: 'center',
  selection: true,
  reserveSelection:true,
  refreshBtn:false,
  column:[
    {
      label:'成果编号',
      prop:'achievementNo',
      overHidden: true,
      slot: true
    },
    {
      label:'成果名称',
      prop:'achievementName',
      overHidden: true,
      slot: true
    },
    {
      label:'技术类型',
      prop:'technologyTypeTxt',
      overHidden: true
    },
    {
      label:'行业类型',
      prop:'industryTxt',
      overHidden: true
    },
    {
      label:'交易价格(万元)',
      prop:'priceType',
      overHidden: true,
      slot: true
    },
    {
      label:'所在地',
      prop:'areaTxt',
      width: 180,
      overHidden: true
    },
    {
      label:'创建时间',
      prop:'createTime',
      overHidden: true
    },
    {
      label:'来源',
      prop:'sourceUser',
      overHidden: true,
      slot: true
    },
    {
      label:'浏览量/收藏量',
      prop:'collectionNumber',
      slot:true,
      width:100,
      overHidden: true
    },
    {
      label:'发布人',
      prop:'sourceEmployeesName',
      overHidden: true,
      slot: true
    },
    {
      label:'产品状态',
      prop:'statusTxt',
      overHidden: true,
      slot: true
    },
  ]
}