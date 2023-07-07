import request from 'axios'

export function getSubstationList(data) {
  return request({
    url: '/hfxl/tmSubstation/list',
    method: 'post',
    data: data
  });
}

export function getPermissionList(data) {
  return request({
    url: '/hfxl/tmSubstation/listSetting',
    method: 'post',
    data: data
  });
}

//添加站点
export function addSubstationSite(data) {
  return request({
    url: '/hfxl/tmSubstation/add',
    method: 'post',
    data: data
  });
}

//编辑站点
export function editSubstationSite(data) {
  return request({
    url: '/hfxl/tmSubstation/edit',
    method: 'put',
    data: data
  });
}

//权限设置
export function permissionSettings(data) {
  return request({
    url: '/hfxl/tmSubstation/permissionSettings',
    method: 'post',
    data: data
  });
}
// 允许复制
export function updateCanCopy(data) {
  return request({
    url: '/hfxl/tmSubstation/updateCanCopy',
    method: 'put',
    data: data
  });
}
//分站友情链接 后台-分页查询
export function getTmFriendLinkPage(data) {
  return request({
    url: '/hfxl/tmFriendLink/page',
    method: 'post',
    data: data
  });
}
// 新增分站友情链接
export function addTmFriendLink(data) {
  return request({
    url: '/hfxl/tmFriendLink/add',
    method: 'post',
    data: data
  });
}
// 修改分站友情链接
export function updateTmFriendLink(data) {
  return request({
    url: '/hfxl/tmFriendLink/update',
    method: 'put',
    data: data
  });
}
// 分站id批量删除分站友情链接
export function deleteBatchTmFriendLink(params) {
  return request({
    url: '/hfxl/tmFriendLink/deleteBatch',
    method: 'DELETE',
    params
  });
}
// 通过id删除分站友情链接
export function removerByIdTmFriendLink(params) {
  return request({
    url: '/hfxl/tmFriendLink/deleteById',
    method: 'DELETE',
    params
  });
}
// 后台-友情链接名称查重
export function getTmFriendLinkCheckName(data) {
  return request({
    url: '/hfxl/tmFriendLink/checkName',
    method: 'POST',
    data
  });
}
