export const commonOption = {
    columnOne: [
        { label: '序号', prop: 'sortId', width: 70, overHidden: true},
        { label: '产品编号', width: 180, prop: "spuCode", overHidden: true,},
        { label: '标题', prop: "spuTitle", overHidden: true, slot: true},
        { label: '地区', prop: "area", width: 150, overHidden: true,  slot: true},
        { label: '级别', prop: "level", width: 120, overHidden: true,  slot: true},
        { label: '归口', prop: "attribute", width: 120, slot: true }, 
        { label: '显示状态', prop:"status", width: 130, slot: true},
        { label: '在线交易', prop:"isOnline", width: 100, slot: true}, 
        { label: "创建时间", prop: "publishTime" },
    ],
    columnTwo: [
        { label: '序号', prop: 'sortId', width: 70,  overHidden: true},
        { label: '产品编号', width: 180, prop: "spuCode", overHidden: true,},
        { label: '标题', prop: "spuTitle", overHidden: true, slot: true},
        { label: '类型', prop: "categoryId", width: 160, slot: true }, 
        { label: '显示状态', prop:"status", width: 160, slot: true},
        { label: '在线交易', prop:"isOnline", width: 100, slot: true}, 
        { label: "创建时间", prop: "publishTime" },
    ],
    columnThree: [
        { label: '序号', prop: 'sortId',width: 80, overHidden: true},
        { label: '产品编号', width: 250, prop: "spuCode", overHidden: true,},
        { label: '标题', prop: "spuTitle", overHidden: true, slot: true},
        { label: '显示状态', prop:"status", width: 180, slot: true},
        { label: '在线交易', prop:"isOnline", width: 120, slot: true}, 
        { label: "创建时间", prop: "publishTime" },
    ]
}
