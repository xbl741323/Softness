export const requirementTableOption = {
    selectable:(row)=>{
      return ( row.status != 3 && row.status != 4 && row.status != 5);
    },
    simplePage:true,
    index:true,
    indexLabel:'序号',
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
        label:'需求编号',
        prop:'requirementNo',
        overHidden: true,
        slot: true
      },
      {
        label:'需求名称',
        prop:'requirementName',
        overHidden: true,
        slot: true
      },
      {
        label:'需求类型',
        prop:'requirementTypeTxt',
        overHidden: true
      },
      {
        label:'行业分类',
        prop:'industryTxt',
        overHidden: true
      },
      {
        label:'投入预算(万元)',
        prop:'tradePriceMin',
        overHidden: true,
        slot: true
      },
      {
        label:'所在地',
        prop:'areaTxt',
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
        // slot: true
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
        prop:'userName',
        overHidden: true,
        slot: true
      },
      {
        label:'产品状态',
        prop:'statusTxt',
        overHidden: true,
      },
    ]
  }