export const tableOption = {
    border: true,
    addBtn: false,
    header: false,
    delBtn: false,
    editBtn: false,
    index: true,
    indexLabel: '序号',
    menuWidth: '380px',
    align: 'center',
    column : [
        {
            label: '工号',
            prop: 'number',
            overHidden: true,
            width: 140,
        },
        {
            label: '合作机构',
            prop: 'partnerName',
            overHidden: true,
            width: 140
        },
        {
            label: '姓名',
            prop: 'name',
            overHidden: true,
            width: 140,
            slot:true
        },
        {
            label: '手机号',
            prop: 'phone',
            width: 120,
        },
        {
            label: '性别',
            prop: 'sex',
            width: 80,
            slot:true
        },
        {
            label: '角色',
            prop: 'roleList',
            span: 10,
            slot: true,
        },
        {
            label: '微信号',
            prop: 'wx',
            width: 140,
            slot:true
        },
        {
            label: '账号状态',
            prop: 'lockFlag',
            width: 80,
            slot:true
        },
        {
            label: '添加时间',
            prop: 'createTime',
            width: 140
        },
    ]
}

export const logOption = {
    border: true,
    addBtn: false,
    header: false,
    delBtn: false,
    editBtn: false,
    menu: false,
    align: 'center',
    column : [
        {
            label: '创建时间',
            prop: 'createTime',
            overHidden: true,
        },
        {
            label: '标题',
            prop: 'title',
            overHidden: true,
        },
        {
            label: '请求参数',
            prop: 'requestParam',
            overHidden: true,
        },
        {
            label: '相应参数',
            prop: 'responseParam',
        },
    ]
}