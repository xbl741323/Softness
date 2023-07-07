import { getDropPolicy } from "@/api/policy/list";

export const ppropertyData = [
  {value: 3, label: '专利'},
  {value: 4, label: '版权'},
  {value: 5, label: '商标'},
  {value: 6, label: '其他'}
]

export const levelData = [
  {value: null, label: '全部'},
  {value: 1, label: '国家级'},
  {value: 2, label: '省级'},
  {value: 3, label: '市级'},
  {value: 4, label: '区级'}
]

export const showData = [
  {value: null, label: '全部'},
  {value: 0, label: '置顶'},
  {value: 1, label: '显示'},
  {value: 2, label: '不显示'},
  {value: 3, label: '草稿'},
]

export const processStatusData = [
  {value: null, label: '全部'},
  {value: 0, label: '待审核'},
  {value: 1, label: '草稿'},
  {value: 2, label: '已通过'},
  {value: 3, label: '未通过'},
]

export const orderTypeData = [
  {value: null, label: '全部'},  
  {value: 1, label: '项目申报'},
  {value: 2, label: '知识产权'},
  {value: 7, label: '工商注册'},
  {value: 8, label: '财税服务'},
  {value: 9, label: '融资上市'},
  {value: 10, label: '法律服务'},
  {value: 11, label: '软件开发'},]

  export const orderTypeDatas = [
    {value: null, label: '全部'},  
    {value: 1, label: '项目申报'},
    {value: 2, label: '知识产权'},
    {value: 7, label: '工商财税'},
    {value: 9, label: '融资上市'},
    {value: 10, label: '法律服务'},
    {value: 11, label: '软件开发'},
  ]
var areaOptions = [];
getDropPolicy(4).then((res) => {
  areaOptions = res.data.data.area;
})

export function areaTransfers(arg1, arg2) {
  for (let index = 0; index < areaOptions.length; index++) {
    if(arg1 == areaOptions[index].value){
      let child = areaOptions[index].children;
      let parentName = areaOptions[index].label;
      for (let i = 0; i < child.length; i++) {
        if(child[i].value == arg2){
          return parentName + child[i].label
        }else{

        };
      };
    }else{

    };
  }
}
export function categoryType(val) {
  return val == 3 ? '专利' : val == 4 ? '版权' : val == 5 ? '商标' : val == 6 ? '其他' : ''
}
