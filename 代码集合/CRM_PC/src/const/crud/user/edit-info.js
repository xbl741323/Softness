export const tableOption = {
    addBtn: false,
    header: false,
    editBtn: false,
    delBtn: false,
    align: 'center',
    menu:false,
    border: true,
    column: [{
        label: '操作时间',
        prop: 'createTime',
        width: 200,
    },
    {
        label: '操作人',
        prop: 'createByName',
        slot: true
    }, {
        label: '标题',
        prop: 'title',
        overHidden: true,
    }, {
        label: "内容",
        prop: 'content',
        overHidden: true,
    }]
}