export const tableOption = {
  "border": true,
  "columnBtn": false,
  "refreshBtn": false,
  "header": false,
  "align": "center",
  "editBtn": false,
  "delBtn": false,
  "selection": true,
  selection:true,
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
      overHidden: true,
    },{
      label: '线索单位名称',
      prop: 'orgName',
      width: 160,
      overHidden: true,
      fixed: true,
      slot:true
    },{
      label:"统一社会信用代码",
      prop:'creditCode',
      overHidden:true,
      width:180,
      slot:true,
  },{
      label: '线索标签',
      prop: 'clueFlag',
      overHidden: true
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
      label: '联系人手机号',
      prop: 'contactMobilephone',
      width: 150,
      overHidden: true,
      slot: true
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
      overHidden: true,
      width:100,
      slot: true
    },
    {
      label: '成交状态',
      prop: 'tradeStatus',
      overHidden: true,
      slot:true
    },
    {
      label: '流入时间',
      prop: 'inflowTime',
      sortable:true,
      width: 150,
      overHidden: true
    },
  ]
}