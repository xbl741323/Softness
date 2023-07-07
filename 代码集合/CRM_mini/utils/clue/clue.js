import * as CodeMsg from "../../utils/common/codeMsg";
import {
  getEmpList,
} from "../../utils/api/category"
if (wx.getStorageSync('category')) {
  let category = wx.getStorageSync('category') // 总类目
  let area = wx.getStorageSync('area') // 地区
  let industryTypeList = category[4].optionList // 行业类型
  let unitTypeList = category[5].optionList // 单位类型
  let lastYearSaleList = category[6].optionList // 上一年销售额
  let unitEmployees = category[7].optionList // 单位人数
  let clueLabelList = category[8].optionList // 线索标签
  let followList = category[9].optionList // 跟进方式
  let arrList = []

  // 筛选行业
  function filterIndustry(val) {
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
    if (val && Number(val) !== 0) {
      let result = clueLabelList.filter(item => {
        return item.id == val
      })
      return result.length > 0 ? result[0].name : "暂无数据"
    } else {
      return "暂无数据"
    }
  }

  // 筛选跟进类型
  function filterFollowType(val) {
    if (val && Number(val) !== 0) {
      let result = followList.filter(item => {
        return item.id == val
      })
      return result.length > 0 ? result[0].name : "暂无数据"
    } else {
      return "暂无数据"
    }
  }

  // 筛选地区
  function filterArea(val) {
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
      return arrList.join('')
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

  // 返回地区数据
  function returnArea() {
    return area
  }

  // 返回分类数据
  function returnCategory() {
    return category
  }

  // 返回员工数据
  function returnEmpList() {
    return new Promise(function (resolve, reject) {
      getEmpList(false).then(res => {
        if (res.code == CodeMsg.CODE_0) {
          resolve(res.data)
        } else {
          reject('接口出错')
        }
      })
    })

  }
  // 筛选查重部门
  function filterDept(val,deptList) {
    if (val && Number(val) !== 0) {
      let result = deptList.filter(item => {
        return item.id == val
      })
      return result.length > 0 ? result[0].businessGroupName : "暂无数据"
    } else {
      return "暂无数据"
    }
  }
  module.exports = {
    filterDept,
    filterIndustry,
    filterUnitType,
    filterLastYearSale,
    filterClueLabel,
    filterFollowType,
    filterEmployeesNum,
    filterArea,
    returnArea,
    returnCategory,
    returnEmpList
  }
}