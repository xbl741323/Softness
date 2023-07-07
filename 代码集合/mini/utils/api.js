import {
  request
} from "./common/request.js"

module.exports = {
  // 此处调用可直接使用NetAPI.VehicleResManager(data).then(...)
  getProjectNavbar: () => {
    return request('get', '/option/getListByCategoryId?categoryId=2')
  },
  getProject: data => {
    return request('get', '/policy/appletProject', data)
  },
  getService: () => {
    return request('get', '/property/getList')
  },
  getDropdown: (code) => {
    return request('get', '/dropDown/category/' + code)
  },
  wxLogin: (data) => {
    return request('post', '/user/wxLogin', data)
  },
  // 微信绑定
  wxBind: (data) => {
    return request('post', '/user/wxBind', data)
  },
  testCode: (phoneNumber) => {
    return request('get', '/msg/sms/' + phoneNumber)
  },
  getUserInfo: () => {
    return request("get", "/appletTmUser/getMyAccountInfo")
  },
  phoneLogin: (data) => {
    return request("post", "/user/login", data)
  },
  userRegister: (data) => {
    return request("post", "/appletLoginUser/userRegister", data)
  },
  switchProvince: () => {
    return request("get", "/area/switchProvince")
  },
  getPolicyAreaOptions: (params) => {
    return request("get", "/policy/getPolicyAreaOptions", params)
  },
  getProjectPolicyList: (data) => {
    return request("post", "/policy/getProjectPolicyList", data)
  },
  getAreaNo: (data) => {
    return request("post", "/tcRegion/getAreaNo", data)
  },
  layout: (data) => {
    return request("get", "/user/logout", data)
  },
  getClassifyProject: (params) => {
    return request("get", "/policy/classifyProject", params)
  },
  getPropertyDetail: (params) => {
    return request("get", "/property/detail", params)
  },
  getProjectDetail: (params) => {
    return request("get", "/policy/projectDetail", params)
  },
  getProjectList: (data) => {
    return request("post", "/policy/getPolicyList", data)
  },
  getPropertyList: (params) => {
    return request("get", "/property/getListByKeyword", params)
  },
  getAreaTree: () => {
    return request('get', '/area/tree')
  },
  allFactor: (data) => {
    return request('get', '/area/allFactor?type='+data)
  },
  getAccountDetail: () => {
    return request('get', '/accounts/detail')
  },
  getFootmarkList: () => {
    return request('get', '/footmark/getList', )
  },
  getCollectionList: (data) => {
    return request('post', '/collection/getList', data)
  },
  getPropertyCollection: (data) => {
    return request('post', '/collectionProperty/getList', data)
  },
  batchDelCollection: (data) => {
    return request('post', '/collection/batchDelete', data)
  },
  batchDelPropertyCollection: (data) => {
    return request('post', '/collectionProperty/batchDelete', data)
  },
  download: (data) => {
    return request('post', '/authentication/tupian1', data)
  },
  checkAuth: (data) => {
    return request('post', '/authentication/checkAuth', data)
  },
  submitAuth: (data) => {
    return request('post', '/authentication/appliAuthentication', data)
  },
  getAuthentication: (params) => {
    return request('get', '/authentication/getAuthentication', params)
  },
  //没有参数名，直接传一个数组
  batchDelFootmark: (data) => {
    return request('post', '/footmark/delete', data, false, 1)
  },
  //进入提交退款页面调用获取openId
  getOpenId: (data) => {
    return request('get', '/wx/verifyOpenId', data)
  },
  //项目收藏
  addCollection: (data) => {
    return request("post", "/collection/add", data)
  },
  deleteCollection: (data) => {
    return request("post", "/collection/delete", data)
  },
  //知产收藏
  addPropertyCollection: (data) => {
    return request("post", "/collectionProperty/add", data)
  },
  deletePropertyCollection: (data) => {
    return request("post", "/collectionProperty/delete", data)
  },
}