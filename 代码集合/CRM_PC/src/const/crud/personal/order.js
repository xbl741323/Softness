export const orderOption = {
    menu:false,
    header:false,
    align:'center',
    border: false,
    page:false,
    column: [{
        label: '订单编号',
        prop: 'number',
        slot: true,
    },{
        label: '产品名称',
        prop: 'name',
        slot: true
    },{
        label: ' 交付时间',        
        prop: 'time1',
        slot: true,

    },{
        label: '代理费单价',
        prop: 'price1',
        overHidden:true,
        slot: true,
    },{
        label: '第三方费用单价',
        prop: 'price2',
        slot: true
    },{
        label: '官费单价',
        prop: 'price3',
        overHidden:true,
        slot: true
    },{
        label: '* 数量',
        prop: 'count',
        overHidden:true,
        slot: true
    },{
        label: '应付合计',
        prop: 'all',
        overHidden:true,
        slot: true
    },{
      label: '订单生成日期',
      prop: 'time2',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      slot: true
    }]
  }
  