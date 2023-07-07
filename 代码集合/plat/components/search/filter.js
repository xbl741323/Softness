export function searchType(val){
    return val == 0 ? '通知公告' : val == 1 ? '政策汇编' : val == 2 ? '卧涛问答' : val == 4 ? '项目申报' : val == 5 ? '知识产权' : val == 10 ? '行业资讯' : val == 99 ? '技术成果' : val == 100 ? '技术需求' : val == 11 ? '工商注册' : val== 12? '财税服务':val== 13 ? '融资上市': val== 14 ? '法律服务':val== 15 ? '软件开发':''
}

export function tech(val){
    return val == 99 ? '技术成果' : val == 100 ? '技术需求' : ''
}

const products= [
    {type: 0, title: '全部'},
    {type: 1, title: '项目申报'},
    {type: 2, title: '知识产权'},
    {type: 7, title: '工商财税'},
    {type: 9, title: '融资上市'},
    {type: 10, title: '法律服务'},
    {type: 11, title: '软件开发'},
]

const most = [{
        title: '综合排序',
        type: 'hottest'
    },{
        title: '发布时间',
        type: 'latest'
    },] 

const level = [
    {
        label: '全部',
        value: null
    },{
        label: '国家级',
        value: 1
    },{
        label: '省级',
        value: 2
    },{
        label: '市级',
        value: 3
    },{
        label: '区级',
        value: 4
    }]

    const cate = [
        {
            label: '全部',
            value: null
        },{
            label: '版权',
            value: 4
        },{
            label: '商标',
            value: 5
        },{
            label: '专利',
            value: 3
        },{
            label: '其他',
            value: 6
        }]

const putUnder = [
    {
        id: null,
        name: "全部"
    },{
        id: 4,
        name: "科技厅"
    },
    {
        id: 5,
        name: "经信（工信）厅"
    },
    {
        id: 6,
        name: "发改委"
    },
    {
        id: 7,
        name: "文旅厅"
    },
    {
        id: 8,
        name: "林业局"
    },
    {
        id: 9,
        name: "农业厅"
    },
    {
        id: 10,
        name: "商务厅"
    },
    {
        id: 11,
        name: "其他"
    }]
export default{
    searchType,
    tech,
    products,
    most,
    level,
    putUnder,
    cate

}