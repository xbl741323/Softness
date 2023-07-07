import store from '@/store'
var localCategory = []
var localArea = []
let arrList = []

// 更新获取存储数据
function getLocalData() {
  if (localStorage.getItem('pigx-category')) {
    localCategory = JSON.parse(localStorage.getItem('pigx-category')).content
  }
  if (localStorage.getItem('pigx-area')) {
    localArea = JSON.parse(localStorage.getItem('pigx-area')).content
  }
  let category = (localCategory) || (store.getters.category) // 总类目
  let area = (localArea) || (store.getters.area) // 地区
  let deptList = store.getters.dept // 部门
  let industryTypeList = category.length > 0 ? category[4].optionList : [] // 行业类型
  let unitTypeList = category.length > 0 ? category[5].optionList : [] // 单位类型
  let lastYearSaleList = category.length > 0 ? category[6].optionList : [] // 上一年销售额
  let unitEmployees = category.length > 0 ? category[7].optionList : [] // 单位人数
  let clueLabelList = category.length > 0 ? category[8].optionList : [] // 线索标签
  return {
    category,
    area,
    deptList,
    industryTypeList,
    unitTypeList,
    lastYearSaleList,
    unitEmployees,
    clueLabelList
  }
}

// 筛选部门
function filterDept(val) {
  let deptList = getLocalData().deptList
  if (val && Number(val) !== 0) {
    let result = deptList.filter(item => {
      return item.id == val
    })
    return result.length > 0 ? result[0].businessGroupName : "暂无数据"
  } else {
    return "暂无数据"
  }
}

// 筛选行业
function filterIndustry(val) {
  let industryTypeList = getLocalData().industryTypeList
  if (val && Number(val) !== 0) {
    let list = val.split(",")
    let nameList = []
    list.forEach(item => {
      let result = industryTypeList.filter(cItem => {
        return cItem.id == item
      })
      result.length > 0 ? nameList.push(result[0].name) : "暂无数据"
    })
    return nameList.join(',')
  } else {
    return "暂无数据"
  }
}

// 筛选单位类型
function filterUnitType(val) {
  let unitTypeList = getLocalData().unitTypeList
  if (val && Number(val) !== 0) {
    let result = unitTypeList.filter(item => {
      return item.id == val
    })
    return result.length > 0 ? result[0].name : "暂无数据"
  } else {
    return "暂无数据"
  }
}

// 筛选上一年销售额
function filterLastYearSale(val) {
  let lastYearSaleList = getLocalData().lastYearSaleList
  if (val && Number(val) !== 0) {
    let result = lastYearSaleList.filter(item => {
      return item.id == val
    })
    return result.length > 0 ? result[0].name : "暂无数据"
  } else {
    return "暂无数据"
  }
}

// 筛选单位人数
function filterEmployeesNum(val) {
  let unitEmployees = getLocalData().unitEmployees
  if (val && Number(val) !== 0) {
    let result = unitEmployees.filter(item => {
      return item.id == val
    })
    return result.length > 0 ? result[0].name : "暂无数据"
  } else {
    return "暂无数据"
  }
}

// 筛选线索标签
function filterClueLabel(val) {
  let clueLabelList = getLocalData().clueLabelList
  if (val && Number(val) !== 0) {
    let result = clueLabelList.filter(item => {
      return item.id == val
    })
    return result.length > 0 ? result[0].name : "暂无数据"
  } else {
    return "暂无数据"
  }
}

// 筛选地区
function filterArea(val) {
  let area = getLocalData().area
  if (val && Number(val) !== 0) {
    let list = val.split(",")
    arrList = []
    list.forEach(pItem => {
      area.forEach(cItem => {
        if (filterLoop(cItem, pItem)) {
          filterLoop(cItem, pItem)
        }
      })
    })
    return arrList.join(',')
  } else {
    return "暂无数据"
  }
}

// 循环筛选
function filterLoop(item, val) {
  if (item.id !== 0 && item.id == val) {
    arrList.push(item.areaName)
  } else if (item.children != null && item.children.length > 0) {
    item.children.forEach(cItem => {
      return filterLoop(cItem, val)
    })
  }
}

export {
  filterIndustry,
  filterUnitType,
  filterLastYearSale,
  filterClueLabel,
  filterEmployeesNum,
  filterArea,
  filterDept
}

