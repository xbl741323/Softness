import request from 'axios'

export function getSalary(params) {
  return request({
    url:'/admin/salary/collect',
    method:'get',
    params: params
  })
}

/* 分页查询工资表表头 */
export function pageHeader(params) {
  return request({
    url:'/admin/payrollHead/page',
    method:'post',
    data: params
  })
}


//添加、编辑工资表表头
export function addHeader(params, operate) {
  return request({
    url: operate ? '/admin/payrollHead/add' : '/admin/payrollHead/mod',
    method: operate ? 'post' : 'put',
    data: params
  })
}

//工资表详情
export function salaryDetail(params) {
  return request({
    url: '/admin/salary/detail',
    method: 'post',
    data: params
  })
}

//获取手机号
export function getUserPhoneNum() {
  return request({
    url: '/admin/secure/getUserPhoneNum',
    method: 'get',
  })
}

//获取验证码
export function sendSms() {
  return request({
    url: '/admin/secure/sendSms',
    method: 'get',
  })
}

//获取token
export function getAuthToken(params) {
  return request({
    url: '/admin/salary/getAuthToken',
    method: 'get',
    params: params
  })
}

//我的工资条
export function salaryOfMy(params) {
  return request({
    url: '/admin/salary/detailOfMy',
    method: 'get',
    params: params
  })
}

//问题反馈
export function feedbackSalaryOfMy(params) {
  return request({
    url: '/admin/salary/feedbackSalaryOfMy',
    method: 'get',
    params: params
  })
}

//确认薪酬
export function confirmSalaryOfMy(params) {
  return request({
    url: '/admin/salary/confirmSalaryOfMy',
    method: 'get',
    params: params
  })
}

//工资条配置已选部门id列表
export function listPayrollHeadConfDeptId() {
  return request({
    url: '/admin/payrollHead/listPayrollHeadConfDeptId',
    method: 'get',
  })
}

//工资核算分页列表
export function getWageData(param) {
  return request({
    url: '/admin/salaryCalculate/page',
    method: 'post',
    data: param
  })
}

//获取核算token
export function getSalaryCalculateToken(params) {
  return request({
    url: '/admin/salaryCalculate/getAuthToken',
    method: 'get',
    params: params
  })
}

/* 获取核算详情分页列表及表头 */
export function calculateDetail(param) {
  return request({
    url: '/admin/salaryCalculate/detail',
    method: 'post',
    data: param
  })
}

/* 核算完成 */
export function completeCalculate(param) {
  return request({
    url: '/admin/salaryCalculate/completeCalculate',
    method: 'post',
    data: param
  })
}

/* 编辑个税 */
export function editPersonalTax(param) {
  return request({
    url: '/admin/salaryCalculate/editPersonalTax',
    method: 'post',
    data: param
  })
}

/* 检车核算状态 */
export function executeCalculate(param) {
  return request({
    url: '/admin/salaryCalculate/executeCalculate',
    method: 'get',
    params: param
  })
}