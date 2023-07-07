export const tableOption = {
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn: false,
    menu:false,
    align: 'center',
    border: true,
    column: [{
        label: '时间',
        prop: 'createTime',
        width: 250,
    }, {
        label: '标题',
        prop: 'fileName',
        overHidden: true,
        slot:true
    }, {
        label: "IP地址",
        prop: 'downloadIp',
        overHidden: true,
    }, {
        label: "端口",
        prop: 'downloadClient',
        overHidden: true,
        slot:true,
    }]
}