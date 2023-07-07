export const tableOption = {
    selection: true,
    rowKey: "id",
    reserveSelection: true,
    selectClearBtn: false,
    addBtn: false,
    menu: false,
    header: false,
    menuWidth:270,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menuAlign: 'center',
    border: true,
    column: [
        {
            prop: 'fileName',
            overHidden: true,
            align: 'left',
            slot: true,
            renderHeader: (h, { column, $index }) => {
                return h('div', {
                    // style: {
                    //     textAlign: "center"
                    // }
                }, [
                  h('span', "文件名称"),
                  h('el-tooltip', {
                        attrs: {
                            content: '上传后及每晚24点按照申请号执行一次与任务的匹配',
                            placement: 'top'
                        }
                    },[
                        h('span', {
                            style: {
                                display: 'inline-block',
                                width: '13px',
                                height: '13px',
                                lineHeight: '13px',
                                border: '1px solid #7f7f7f',
                                borderRadius: '10px',
                                marginLeft: '5px',
                                color: '#7f7f7f',
                                textAlign: "center",
                            }
                        }, [h('span', '?')])
                    ]),
                ])
            },
        },
        {
            label: '申请号',
            prop: 'patentApplicationNo',
            overHidden: true,
            width:140,
        },
        {
            label: '专利名称',
            prop:'patentName',
            overHidden: true,
            width: 250
        },
        {
            label:'申请日',
            prop:'applyTime',
            width: 100,
            slot:true
        },
        {
            label: '下证日',
            prop: 'passTime',
            overHidden: true,
            width: 100,
            slot:true
        }, 
        {
            label: '专利类型',
            prop: 'patentType',
            overHidden: true,
            width: 90,
            slot:true
        }, 
        {
            label: '上传时间',
            prop: 'createTime',
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            width: 150,
            overHidden: true,
        }, 
        {
            label: '大小',
            prop: 'fileSize',
            width: 100,
            overHidden: true,
        }, 
        {
            label: '关联编号',
            prop: 'sourceNo',
            width: 200,
            slot: true,
            overHidden: true,
        }, 
    ]
}

export const manageOption = {
    selection: true,
    rowKey: "id",
    reserveSelection: true,
    selectClearBtn: false,
    addBtn: false,
    menu: false,
    header: false,
    menuWidth:270,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menuAlign: 'center',
    border: true,
    column: [
        {
            prop: 'fileName',
            overHidden: true,
            align: 'left',
            slot: true,
            renderHeader: (h, { column, $index }) => {
                return h('div', {
                    // style: {
                    //     textAlign: "center"
                    // }
                }, [
                  h('span', "文件名称"),
                  h('el-tooltip', {
                        attrs: {
                            content: '上传后及每晚24点按照申请号执行一次与任务的匹配',
                            placement: 'top'
                        }
                    },[
                        h('span', {
                            style: {
                                display: 'inline-block',
                                width: '13px',
                                height: '13px',
                                lineHeight: '13px',
                                border: '1px solid #7f7f7f',
                                borderRadius: '10px',
                                marginLeft: '5px',
                                color: '#7f7f7f',
                                textAlign: "center",
                            }
                        }, [h('span', '?')])
                    ]),
                ])
            },
        },
        {
            label: '申请号',
            prop: 'patentApplicationNo',
            overHidden: true,
            width:200,
        },
        {
            label: '专利名称',
            prop:'patentName',
            overHidden: true,
            width: 250
        },
        {
            label:'申请日',
            prop:'applyTime',
            width: 100,
            slot:true
        },
        {
            label: '下证日',
            prop: 'passTime',
            overHidden: true,
            width: 100,
            slot:true
        }, 
        {
            label: '专利类型',
            prop: 'patentType',
            overHidden: true,
            width: 100,
            slot:true
        }, 
        {
            label: '上传时间',
            prop: 'createTime',
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            width: 150,
            overHidden: true,
        }, 
        {
            label: '上传人',
            prop: 'createByName',
            width: 100,
            overHidden: true,
            slot:true
        }, 
        {
            label: '大小',
            prop: 'fileSize',
            width: 100,
            overHidden: true,
        }, 
        {
            label: '关联编号',
            prop: 'sourceNo',
            width: 200,
            slot: true,
            overHidden: true,
        }, 
    ]
}
  
  