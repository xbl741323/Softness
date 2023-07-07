import request from 'axios'

export function savePosition(obj, operateId) {//新增/编辑职位
  return request({
    url: operateId ? '/admin/tmPosition/edit' : '/admin/tmPosition/add',
    method: operateId ? 'put' : 'post',
    data: obj
  });
}

export function jobList(obj) {//职位列表
  return request({
    url: '/admin/tmPosition/pageList',
    method: 'get',
    params: obj
  });
}


export function deletePositionById(id) {//删除单个职位
  return request({
    url: '/admin/tmPosition/deletePositionById/'+id,
    method: 'delete'
  });
}


export function deletePositionByIds(obj) {//批量删除职位
  return request({
    url: '/admin/tmPosition/deleteBatchByIds',
    method: 'delete',
    params: obj
  });
}


export function listAllTmPositions() {
  return request({
    url: '/admin/tmPosition/listAllTmPositions',
    method: 'get',
  });
}

export function getRankCategoryList() {//职级类别
  return request({
    url: '/admin/ttRank/listCategory',
    method: 'get',
  });
}

export function getRankListOfCategory(obj) {//职级列表分页查询
  return request({
    url: '/admin/ttRank/pageList',
    method: 'get',
    params: obj
  });
}

export function addRank(obj) {//新建职级
  return request({
    url: '/admin/ttRank/add',
    method: 'post',
    data: obj
  });
}

export function editRank(obj) {//编辑职级
  return request({
    url: '/admin/ttRank/edit',
    method: 'put',
    data: obj
  });
}

export function delRank(obj) {//删除职级
  return request({
    url: '/admin/ttRank/deleteBatchByIds',
    method: 'delete',
    params:obj
  });
}

export function priorityChange(obj) {//修改职级排序
  return request({
    url: '/admin/ttRank/priorityChange',
    method: 'put',
    data: obj
  });
}

export function listRankByCategory(obj) {//基本职级列表
  return request({
    url: '/admin/tmPosition/listRankByCategory/'+obj.category,
    method: 'get',
  });
}


export function editPosition(obj) {//编辑职位详情数据
  return request({
    url: '/admin/tmPosition/editDetail/'+obj.positionId,
    method: 'get',
  });
}


export function deleteByPositionRankId(obj) {//职位编辑删除职级
  return request({
    url: '/admin/tmPosition/deleteByPositionRankId',
    method: 'delete',
    params: obj
  });
}


export function positionDetail(obj) {//职位详情
  return request({
    url: '/admin/tmPosition/detail',
    method: 'get',
    params: obj
  });
}


export function editRankInfo(obj) {//职位详情-编辑职级信息
  return request({
    url: '/admin/tmPosition/detailEdit',
    method: 'put',
    data: obj
  });
}

export function delPositionRank(obj) {//职位详情-删除职级信息
  return request({
    url: '/admin/tmPosition/detailDeleteBatch',
    method: 'delete',
    params: obj
  });
}


export function listDeptByPositionId(positionId) {//考核方案-根据职位id查询使用部门
  return request({
    url: '/admin/tmPosition/listDeptByPositionId/'+positionId,
    method: 'get',
  });
}

export function getEducationOptions() {//学历tree
  return request({
    url: '/admin/education/tree',
    method: 'get',
  });
}

export function getPosition(deptId) {//根据部门id查询职位
  return request({
    url: '/admin/tmPosition/listPositionByDeptId/'+deptId,
    method: 'get',
  });
}

export function listPositionRankByPositionId(positionId) {//根据职位id查询职级
  return request({
    url: '/admin/tmPosition/listPositionRankByPositionId/'+positionId,
    method: 'get',
  });
}

export function rankUsedSysUserDetail(positionRankId) {//根据职位id查询使用人
  return request({
    url: '/admin/tmPosition/rankUsedSysUserDetail/'+positionRankId,
    method: 'get',
  });
}

export function rankUserList(rankId) {//根据职级id查询使用人
  return request({
    url: '/admin/ttRank/rankUsedSysUserDetail/'+rankId,
    method: 'get',
  });
}

export function getDefaultByDeptId(deptId) {//根据部门id查询查重部门
  return request({
    url: '/admin/sysbusinessgroup/getDefaultByDeptId/'+deptId,
    method: 'get',
  });
}

export function pageSysLogByOperatedId(data) {//根据职位id查询操作记录
  return request({
    url: '/admin/tmPosition/pageSysLogByOperatedId',
    method: 'get',
    params: data
  });
}