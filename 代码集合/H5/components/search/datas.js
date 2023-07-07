const filters = [{
    name:'综合搜索',
    type: 'comprehension',
    otherName: '综合搜索'
}]



const filters1 = [{
        name:'综合搜索',
        type: 'comprehension',
        otherName: '综合搜索'
    },{
        name:'地区',
        type: 'area',
        otherName: '地区'
    },{
        name: '级别',
        type: 'level',
        otherName: '级别'
    },{
        name:'归口',
        type: 'putunder',
        otherName: '归口'
    }]

const filters2 = [{
        name:'综合搜索',
        type: 'comprehension',
        otherName: '综合搜索'
    },{
        name: '类型',
        type: 'types',
        otherName: '类型'
    }]

const filters3 = [{
        name:'综合搜索',
        type: 'comprehension',
        otherName: '综合搜索'
    },{
        name: '地区',
        type: 'area',
        otherName: '地区'
    },{
        name: '综合排序',
        type: 'most',
        otherName: '综合排序'
    }]

const filters4 = [{
        name:'综合搜索',
        type: 'comprehension',
        otherName: '综合搜索'
    },{
        name: '综合排序',
        type: 'most',
        otherName: '综合排序'
    }]

    const filtersDefault = [{
        name:'综合搜索',
        type: 'comprehension',
        otherName: '综合搜索'
    },{
        name:'地区',
        type: 'area',
        otherName: '地区'
    },{
        name: '级别',
        type: 'level',
        otherName: '级别'
    }]

const mosts = [
    {
        title: '综合排序',
        type: 'hottest'
    },{
        title:'发布时间',
        type: 'latest'
    }
]

const levelList = [
    {
        title: '全部',
        type: 0
    },{
        title:'国家级',
        type: 1
    },{
        title:'省级',
        type: 2
    },{
        title:'市级',
        type: 3
    },{
        title:'区级',
        type: 4
    }
]

const products= [
    {type: 0, title: '全部'},
    {type: 4, title: '版权'},
    {type: 5, title: '商标'},
    {type: 3, title: '专利'},
    {type: 6, title: '其他'}
]

const classifyList=[
    {
        name: "政策广场",
        type: 0
    },{
        name: "服务产品",
        type: null
    },{
        name: "技术成果",
        type: 99
    },{
        name: "技术需求",
        type: 100
    }      
]
export default{
    filters,
    filters1,
    filters2,
    filters3,
    filters4,
    filtersDefault,
    classifyList,
    products,
    mosts,
    levelList
}