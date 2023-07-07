export const tableOption = {
    border: true,
    addBtn: false,
    header: false,
    delBtn: false,
    editBtn: false,
    index: true,
    indexLabel: '序号',
    menuWidth: '180px',
    align: 'center',
    column : [
        {
            label: '编号',
            prop: 'partnerNo',
            overHidden: true,
            width: 140,
            slot: true
        },
        {
            label: '合作机构名称',
            prop: 'partnerName',
            overHidden: true,
            width: 140
        },
        {
            label: '卧涛对接人',
            prop: 'connectEmpName',
            overHidden: true,
            width: 140
        },
        {
            label: '地址',
            prop: 'partnerAddress',
            overHidden: true,
            width: 140,
            slot: true
        },
        {
            label: '联系人',
            prop: 'contactName',
            width: 100
        },
        {
            label: '联系人手机号',
            prop: 'contactMobile',
            width: 140,
            slot:true
        },
        {
            label: '信用代码/身份证号',
            prop: 'identifyNo',
            overHidden: true,
        },
        {
            label: '机构类型',
            prop: 'partnerType',
            width: 140,
            slot:true
        },
        {
            label: '查重部门',
            prop: 'sysBusinessGroupList',
            overHidden: true,
            width: 140,
            slot: true
        },
        {
            label: '账号数量',
            prop: 'userCount',
            width: 80,
            slot: true
        },
        {
            label: '添加时间',
            prop: 'createTime',
            width: 140,
            slot: true
        },
    ]
}