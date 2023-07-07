export const tableOption = {
    selection: true,
    reserveSelection:true,
    selectClearBtn: false,
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn:false,
    align:'center',
    menuWidth:280,
    menuAlign:'center',
    border: true,
    column: [{
      label: '资讯编号',
      prop: 'industryNo',
      overHidden:true,
      width: 160,
      slot:true,
    }, {
      label: '资讯标题',
      prop: 'title',
      width:300,
      overHidden:true,
      slot:true,
    }, {
      label: '服务分类',
      prop: 'categoryId',
      overHidden: true,
      slot: true,
    }, {
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      overHidden:true,
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    },{
      label: '发布人',
      prop: 'createByName',
      overHidden:true,
      slot:true
    }, {
      label: '发布时间',
      prop: 'publishTime',
      type: 'datetime',
      overHidden:true,
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    }, {
      label: '显示状态',
      prop: 'state',
      slot:true
    },{
      label: '浏览量/收藏量', 
      prop:'pageViews',
      slot:true,
      width: 100,
      overHidden: true
    }
    ]
  }
  