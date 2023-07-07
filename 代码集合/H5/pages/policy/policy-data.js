export const levelData = [
  {no: 0, name: '全部'},
  {no: 1, name: '国家级'},
  {no: 2, name: '省级'},
  {no: 3, name: '市级'},
  {no: 4, name: '区级'},
]

export const sortData = [
  {no: 0, name: '综合排序'},
  {no: 1, name: '发布时间'}
]

export const newSortData = [
  {no: 0, name: '发布时间'},
  {no: 1, name: '综合排序'}
]

export const classList = [
  {no: 0, name: '全部'},
  {no: 1, name: '项目申报'},
  {no: 2, name: '知识产权'},
  {no: 7, name: '工商财税'},
  {no: 9, name: '融资上市'},
  {no: 10, name: '法律服务'},
  {no: 11, name: '软件开发'}
]

const year = new Date().getFullYear()
export const monthData = [
  {no: 0, name: '全部'},
  {no: 1, name: year+'.1'},
  {no: 2, name: year+'.2'},
  {no: 3, name: year+'.3'},
  {no: 4, name: year+'.4'},
  {no: 5, name: year+'.5'},
  {no: 6, name: year+'.6'},
  {no: 7, name: year+'.7'},
  {no: 8, name: year+'.8'},
  {no: 9, name: year+'.9'},
  {no: 10, name: year+'.10'},
  {no: 11, name: year+'.11'},
  {no: 12, name: year+'.12'},
]

export const selectNameList = [{
  categoryId: 1,
  categoryName: '地区',
  select: true,
  status: false,
  otherName: '地区'
},{
  categoryId: 2,
  categoryName: '级别',
  select: true,
  status: false,
  otherName: '级别'
},{
  categoryId: 3,
  categoryName: '归口',
  select: true,
  status: false,
  otherName: '归口'
},{
  categoryId: 4,
  categoryName: '申报时间',
  select: true,
  status: false,
  otherName: '申报时间'
},{
  categoryId: 5,
  categoryName: '综合排序',
  select: true,
  status: false,
  otherName: '综合排序'
}]

export const newSelectNameList = [{
  categoryId: 1,
  categoryName: '地区',
  select: true,
  status: false,
  otherName: '地区'
},{
  categoryId: 2,
  categoryName: '级别',
  select: true,
  status: false,
  otherName: '级别'
},{
  categoryId: 3,
  categoryName: '归口',
  select: true,
  status: false,
  otherName: '归口'
},{
  categoryId: 4,
  categoryName: '申报时间',
  select: true,
  status: false,
  otherName: '申报时间'
},{
  categoryId: 5,
  categoryName: '发布时间',
  select: true,
  status: false,
  otherName: '发布时间'
}]

export const operateIcon = 
[
  require("@/assets/images/policySquare/icon-sort-xuanzhong@2x.png"),
  require("@/assets/images/policySquare/icon-sort@2x.png"),
  require("@/assets/images/policySquare/icon-hot-xuanzhong@2x.png"),
  require("@/assets/images/policySquare/icon-hot@2x.png"),
  require("@/assets/images/policySquare/icon-delete-xuanzhong@2x.png"),
  require("@/assets/images/policySquare/default.png"),
  require("@/assets/images/policySquare/icon-like-xuanzhong@2x.png"),
  require("@/assets/images/policySquare/icon-like@2x.png"),
  require("@/assets/images/policySquare/icon-dislike-xuanzhong@2x.png"),
  require("@/assets/images/policySquare/icon-dislike@2x.png"),
  require("@/assets/images/policySquare/icon-accept-xuanzhong@2x.png"),
  require("@/assets/images/policySquare/icon-accept@2x.png"),
  require("@/assets/images/policySquare/info.png")
]


export const iconUrl = {
  doc: require('@/assets/images/policySquare/icon_word@2x.png'),
  docx: require('@/assets/images/policySquare/icon_word@2x.png'),
  ppt: require('@/assets/images/policySquare/icon_ppt@2x.png'),
  pptx: require('@/assets/images/policySquare/icon_ppt@2x.png'),
  pdf: require('@/assets/images/policySquare/icon_pdf@2x.png'),
  xls: require('@/assets/images/policySquare/icon_excel@2x.png'),
  xlsx: require('@/assets/images/policySquare/icon_excel@2x.png'),
}

export const fileTypeArr = ['doc', 'docx', 'ppt', 'pptx', 'pdf', 'xls', 'xlsx']