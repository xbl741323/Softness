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
        prop: 'spuTitle',
        overHidden: true,
    }, {
        label: "IP地址",
        prop: 'collectIp',
        overHidden: true,
    }, {
        label: "端口",
        prop: 'collectSource',
        overHidden: true,
        slot:true,
    }]
}