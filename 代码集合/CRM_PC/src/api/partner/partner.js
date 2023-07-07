import request from "@/router/axios";

//分页查询合作机构列表
export function getPartnerList(obj) {
  return request({
    url: "/admin/tmPartner/page",
    method: "post",
    data: obj
  });
}

//添加/编辑合作机构
export function addPartner(val, obj) {
  if (val == 1) {
    return request({
      url: "/admin/tmPartner/save",
      method: "post",
      data: obj
    });
  } else {
    return request({
      url: "/admin/tmPartner/edit",
      method: "put",
      data: obj
    });
  }
}