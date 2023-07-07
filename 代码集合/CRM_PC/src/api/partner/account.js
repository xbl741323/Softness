import request from "@/router/axios";

//分页查询合作机构用户
export function getPartnerAccountList(obj) {
  return request({
    url: "/admin/tmPartnerUser/page",
    method: "post",
    data: obj
  });
}

//添加、编辑合作机构用户
export function addPartnerAccount(val, obj) {
  if (val == 1) {
    return request({
      url: "/admin/tmPartnerUser/save",
      method: "post",
      data: obj
    });
  } else {
    return request({
      url: "/admin/tmPartnerUser/edit",
      method: "post",
      data: obj
    });
  }
}

//获取合作机构列表
export function partnerList() {
  return request({
    url: "admin/tmPartner/list",
    method: "get",
  });
}

//获取合作机构角色列表
export function partnerRoleList() {
  return request({
    url: "/admin/role/getPartnerRoleList",
    method: "get",
  });
}

//启、禁用合作机构角色 true 启用  false 禁用
export function changeDisable(val, obj) {
  if (val) {
    return request({
      url: "/admin/tmPartnerUser/enableEmp",
      method: "put",
      data: obj
    });
  } else {
    return request({
      url: "/admin/tmPartnerUser/disableEmp",
      method: "put",
      data: obj
    });
  }
}

//获取合作机构角色日志列表
export function partnerlogList(obj) {
  return request({
    url: "/admin/log/page",
    method: "get",
    params: obj,
  });
}

//获取合作机构角色权限列表
export function partnerRoleIdList(obj) {
  return request({
    url: "/admin/tmRole/listRoleByRoleIdForPartner",
    method: "get",
    params: obj,
  });
}
