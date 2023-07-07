import {
  request
} from "../common/request.js"

module.exports = {
  // 获取地区
  allFactor: (data) => {
    return request('get', '/wtcrm/factor/allFactor?type=' + data)
  },
  // 获取分类列表数据
  getCategoryList: (data) => {
    return request('get', `/wtcrm/category`, data)
  },
  // 获取地区数据
  getArea: (data) => {
    return request('get', `/wtcrm/area/tree`, data)
  },
  // 获取员工数据 status：false-查询全部员工(去除禁用后的员工)  true-查询全部员工
  getEmpList: (status) => {
    return request('get', `/admin/user/allByDept?query=${status}`)
  },
  // 获取员工下拉选框
  getEmpOption: (data) => {
    return request('post', `/admin/user/getEmpByName`, data)
  },
  //查重部门列表
  repeatDeptList: () => {
    return request('get', '/admin/sysbusinessgroup/list')
  },

}