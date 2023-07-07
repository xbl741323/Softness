export const soloOption = {
    selection: true,
    reserveSelection: false,
    selectClearBtn: false,
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menuAlign: 'center',
    menuWidth:150,
    border: true,
    column: [{
        label: '客户编号',
        prop: 'number',
        width: 130,
        slot:true
    }, {
        label: '客户名称',
        prop: 'contactName',
        width: 200,
        slot:true
    },
    {
        label: '手机号',
        prop: 'contactMobilephone',
        slot:true
    },
    {
        label: '单位名称',
        prop: 'orgName'
    },
    {
        label: '单位类型',
        prop: 'orgTypeName'
    }, {
        label: '行业',
        prop: 'orgIndustryName'
    },
    {
        label: '地区',
        prop: 'orgAddressName'
    },
    {
        label: '最近签约时间',
        prop: 'lastSignTime',
        sortable:true,
    },
    {
        label: '流入时间',
        prop: 'inflowTime',
        sortable:true,
    }]
}