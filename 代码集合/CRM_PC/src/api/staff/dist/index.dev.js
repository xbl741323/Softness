"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savePosition = savePosition;
exports.jobList = jobList;
exports.deletePositionById = deletePositionById;
exports.deletePositionByIds = deletePositionByIds;
exports.listAllTmPositions = listAllTmPositions;
exports.getRankCategoryList = getRankCategoryList;
exports.getRankListOfCategory = getRankListOfCategory;
exports.addRank = addRank;
exports.editRank = editRank;
exports.delRank = delRank;
exports.priorityChange = priorityChange;
exports.listRankByCategory = listRankByCategory;
exports.editPosition = editPosition;
exports.deleteByPositionRankId = deleteByPositionRankId;
exports.positionDetail = positionDetail;
exports.editRankInfo = editRankInfo;
exports.delPositionRank = delPositionRank;
exports.listDeptByPositionId = listDeptByPositionId;
exports.getEducationOptions = getEducationOptions;
exports.getPosition = getPosition;
exports.listPositionRankByPositionId = listPositionRankByPositionId;
exports.rankUsedSysUserDetail = rankUsedSysUserDetail;
exports.rankUserList = rankUserList;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function savePosition(obj, operateId) {
  //新增/编辑职位
  return (0, _axios["default"])({
    url: operateId ? '/admin/tmPosition/edit' : '/admin/tmPosition/add',
    method: operateId ? 'put' : 'post',
    data: obj
  });
}

function jobList(obj) {
  //职位列表
  return (0, _axios["default"])({
    url: '/admin/tmPosition/pageList',
    method: 'get',
    params: obj
  });
}

function deletePositionById(id) {
  //删除单个职位
  return (0, _axios["default"])({
    url: '/admin/tmPosition/deletePositionById/' + id,
    method: 'delete'
  });
}

function deletePositionByIds(obj) {
  //批量删除职位
  return (0, _axios["default"])({
    url: '/admin/tmPosition/deleteBatchByIds',
    method: 'delete',
    params: obj
  });
}

function listAllTmPositions() {
  return (0, _axios["default"])({
    url: '/admin/tmPosition/listAllTmPositions',
    method: 'get'
  });
}

function getRankCategoryList() {
  //职级类别
  return (0, _axios["default"])({
    url: '/admin/ttRank/listCategory',
    method: 'get'
  });
}

function getRankListOfCategory(obj) {
  //职级列表分页查询
  return (0, _axios["default"])({
    url: '/admin/ttRank/pageList',
    method: 'get',
    params: obj
  });
}

function addRank(obj) {
  //新建职级
  return (0, _axios["default"])({
    url: '/admin/ttRank/add',
    method: 'post',
    data: obj
  });
}

function editRank(obj) {
  //编辑职级
  return (0, _axios["default"])({
    url: '/admin/ttRank/edit',
    method: 'put',
    data: obj
  });
}

function delRank(obj) {
  //删除职级
  return (0, _axios["default"])({
    url: '/admin/ttRank/deleteBatchByIds',
    method: 'delete',
    params: obj
  });
}

function priorityChange(obj) {
  //修改职级排序
  return (0, _axios["default"])({
    url: '/admin/ttRank/priorityChange',
    method: 'put',
    data: obj
  });
}

function listRankByCategory(obj) {
  //基本职级列表
  return (0, _axios["default"])({
    url: '/admin/tmPosition/listRankByCategory/' + obj.category,
    method: 'get'
  });
}

function editPosition(obj) {
  //编辑职位详情数据
  return (0, _axios["default"])({
    url: '/admin/tmPosition/editDetail/' + obj.positionId,
    method: 'get'
  });
}

function deleteByPositionRankId(obj) {
  //职位编辑删除职级
  return (0, _axios["default"])({
    url: '/admin/tmPosition/deleteByPositionRankId',
    method: 'delete',
    params: obj
  });
}

function positionDetail(obj) {
  //职位详情
  return (0, _axios["default"])({
    url: '/admin/tmPosition/detail',
    method: 'get',
    params: obj
  });
}

function editRankInfo(obj) {
  //职位详情-编辑职级信息
  return (0, _axios["default"])({
    url: '/admin/tmPosition/detailEdit',
    method: 'put',
    data: obj
  });
}

function delPositionRank(obj) {
  //职位详情-删除职级信息
  return (0, _axios["default"])({
    url: '/admin/tmPosition/detailDeleteBatch',
    method: 'delete',
    params: obj
  });
}

function listDeptByPositionId(positionId) {
  //考核方案-根据职位id查询使用部门
  return (0, _axios["default"])({
    url: '/admin/tmPosition/listDeptByPositionId/' + positionId,
    method: 'get'
  });
}

function getEducationOptions() {
  //学历tree
  return (0, _axios["default"])({
    url: '/admin/education/tree',
    method: 'get'
  });
}

function getPosition(deptId) {
  //根据部门id查询职位
  return (0, _axios["default"])({
    url: '/admin/tmPosition/listPositionByDeptId/' + deptId,
    method: 'get'
  });
}

function listPositionRankByPositionId(positionId) {
  //根据职位id查询职级
  return (0, _axios["default"])({
    url: '/admin/tmPosition/listPositionRankByPositionId/' + positionId,
    method: 'get'
  });
}

function rankUsedSysUserDetail(positionRankId) {
  //根据职位id查询使用人
  return (0, _axios["default"])({
    url: '/admin/tmPosition/rankUsedSysUserDetail/' + positionRankId,
    method: 'get'
  });
}

function rankUserList(rankId) {
  //根据职级id查询使用人
  return (0, _axios["default"])({
    url: '/admin/ttRank/rankUsedSysUserDetail/' + rankId,
    method: 'get'
  });
}