export const personTableOption = {
    "border": true,
    "columnBtn": false,
    "refreshBtn": false,
    "header": false,
    "align": "center",
    "selection": true,
    selectionFixed: true,
    "editBtn": false,
    "delBtn": false,
    "menuAlign": "center",
    "menuWidth": '150',
    "searchMenuSpan": 6,
    'column':[
      {
        label: '线索编号',
        prop: 'number',
        width: 130,
        slot: true,
        fixed: true,
        overHidden: true
      },{
        label: '线索姓名',
        prop: 'contactName',
        width: 150,
        fixed: true,
        overHidden: true,
        slot:true
      },{
        label: '手机号',
        prop: 'contactMobilephone',
        width: 150,
        overHidden: true,
        slot: true
      },
      {
        label: '线索标签',
        prop: 'clueFlag',
        width: 80,
        overHidden: true
      },{
        label: '单位名称',
        prop: 'orgName',
        overHidden: true,
        width: 180
      },{
        label: '单位类型',
        prop: 'orgTypeName',
        overHidden: true
      },{
        label: '行业',
        prop: 'orgIndustryName',
        overHidden: true
      }, 
      {
        label: '地区',
        prop: 'orgAddressName',
        overHidden:true
      },
      {
        label: '公海部门',
        prop: 'deptName',
        overHidden: true
      },
      {
        label: '绑定成交客户',
        prop: 'bindFlag',
        width:110,
        slot: true,
        overHidden: true
      },
      {
        label: '成交状态',
        prop: 'tradeStatus',
        slot: true,
        overHidden: true
      },
      {
        label: '流入时间',
        prop: 'inflowTime',
        sortable:true,
        overHidden: true,
        width:150
      },
    ]
  }