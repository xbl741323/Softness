export const tableOption = {
    selection: true,
    // selectable:(row)=>{
    //     return row.deleted===0;
    // },
    reserveSelection: false,
    selectClearBtn: false,
    addBtn: false,
    menu: true,
    header: false,
    menuWidth:270,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menuAlign: 'center',
    border: true,
    column: [
        {
            label: '文件编号',
            prop: 'fileNo',
            overHidden: true,
            width:140,
        }, 
        {
            label: '文件名称',
            prop: 'fileName',
            overHidden: true,
            slot: true,
            width: 300,
        },  
        {
            label: '关联文章数量',
            prop:'relatedArticles',
            width: 100
        }, 
        {
            label:'地区',
            prop:'areaNo',
            width: 140
        },
        {
            label:'级别',
            prop:'level',
            width: 100
        },
        {
            label: '显示状态',
            prop: 'state',
            slot: true,
            overHidden: true,
            width: 100,
        },
        {
            label: '价格（元）',
            prop:'amount',
            slot: true,
        },
        {
            label:'下载次数',
            prop:'downloadTimes',
            width: 80
        },
        {
            label: '操作人',
            prop: 'operatorByName',
            overHidden: true,
            slot:true,
            width:100,
        }, 
        {
            label: '操作时间',
            prop: 'operatorTime',
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            overHidden: true,
            width:140,
        }, 
        // {
        //     label: "操作",
        //     prop: 'menu',
        //     slot: true,
        //     width: 250,
        // }
    ]
}
  