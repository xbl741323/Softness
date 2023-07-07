import request from "@/router/axios";
// 获取纸质合同列表
export function getPaperContracts(obj) {
  return request({
    url: "/wtess/paperContract/pagePaperContract",
    method: "post",
    data: obj
  });
}
// 获取电子合同列表
export function getEleContracts(obj) {
  return request({
    url: "/wtess/contract/pageContract",
    method: "post",
    data: obj
  });
}
// 获取纸质合同状态
export function getContractsStatus() {
  return request({
    url: "/wtess/paperContract/getPagerContractProcess",
    method: "post"
  });
}

// 获取电子合同状态
export function getEleContractsStatus(param) {
  return request({
    url: "/wtess/contract/queryContractStatus",
    method: "get",
    params: param
  });
}

// 获取纸质合同详情
export function getPaperContractsDetail(data) {
  return request({
    url: "/wtess/paperContract/getPaperContract?contractId=" + data,
    method: "get"
  });
}

// 获取电子合同详情
export function getContractsDetail(data) {
  return request({
    url: "/wtess/contract/getContract?contractId=" + data,
    method: "post"
  });
}

// 合同详情-订单详情
export function getContractsOrder(obj) {
  return request({
    url: "/wtorder/tmOrder/page",
    method: "post",
    data: obj
  });
}

//纸质合同预览
export function previewContract(data) {
  return request({
    url: "/wtess/paperContract/previewContract?url=" + data,
    method: "get"
  });
}

// 流程管理列表合同审批详情


export function getprocessDetail(param, isPersonal) {
    return request({
    url: isPersonal ? '/wtess/paperContractAudit/getPaperContractAuditOfMy' : '/wtess/paperContractAudit/getPaperContractAudit',
    method: 'get',
    params:param
    })
}


// 我的流程列表合同审批详情
export function persongetprocessDetail(data) {
  return request({
    url: "/wtcrm/personal/task/contract/detail?id=" + data,
    method: "get"
  });
}

// 根据订单Id查询订单列表
export function getOrder(data) {
  return request({
    url: "/wtorder/tmOrder/getOrderInfoByIds",
    method: "post",
    data: data
  });
}

// 审核纸质合同
// export function auditPaperContract(data) {
 
// }

// 审核纸质合同
export function auditPaperContractAuditOfMy(data,Bool) {
  if (Bool) {
    return request({
      url: "/wtess/paperContractAudit/auditPaperContractAuditOfMy",
      method: "post",
      data: data
    });
  }else{
    return request({
      url: "/wtess/paperContractAudit/auditPaperContractAudit",
      method: "post",
      data: data
    });
  }
}

//删除合同
export function deleteContract(data) {
  return request({
    url: "/wtess/paperContract/removePaperContract?contractId=" + data,
    method: "post"
  });
}

//流程审批合同管理详情-审核记录
export function auditLog(data) {
  return request({
    url: "/admin/auditLog/list",
    method: "post",
    data: data
  });
}

//纸质合同详情操作记录
export function paperRecords(obj) {
  return request({
    url: "/admin/opLog/page",
    method: "post",
    data: obj
  });
}

// 流程管理文章审批详情
export function getartcileDetail(data) {
  return request({
    url: "/wtcrm/task/article/detail?taskId=" + data,
    method: "get"
  });
}

// 我的流程文章审批详情
export function newgetartcileDetail(data) {
  return request({
    url: "/wtcrm/personal/task/article/detail?taskId=" + data,
    method: "get"
  });
}

// 流程管理文章审批记录详情
export function getarticlerecordDetail(data) {
  return request({
    url: "/wtcrm/task/articleList?taskNo=" + data,
    method: "get"
  });
}

// 文章审批
export function checkArticle(param) {
  return request({
    url: "/wtcrm/policy/article/audit",
    method: "put",
    params: param
  });
}

//合同下载
export function contractsDown(param) {
  return request({
    url: "/wtcrm/file/download",
    method: "get",
    responseType: "blob",
    params: param
  });
}
//删除合同
export function conDelete(data) {
  return request({
    url: "/wtcrm/wtcontract/del",
    method: "delete",
    params: data
  });
}
//审核通过、驳回
export function conCheck(obj) {
  return request({
    url: "/wtcrm/wtcontract/audit",
    method: "post",
    data: obj
  });
}

// 新的审核接口
export function newconCheck(obj) {
  return request({
    url: "/wtcrm/personal/wtcontract/audit",
    method: "post",
    data: obj
  });
}
//审核记录
export function approveRecords(param) {
  return request({
    url: "/wtcrm/wtcontractprocess/list",
    method: "get",
    params: param
  });
}
//审核记录
export function failDetailRecords(param) {
  return request({
    url: "/wtcrm/sysAuditFail/page",
    method: "get",
    params: param
  });
}
//预览合同添加操作记录
export function downloadLog(id) {
  return request({
    url: "/wtcrm/wtcontract/downLoadContractLog?contractId=" + id,
    method: "get"
  });
}

//合同详情操作记录
export function operateRecords(obj) {
  return request({
    url: "/wtcrm/wtcontract/getContractLogById",
    method: "get",
    params: obj
  });
}

export function getComponents(obj) {
  //电子合同-控件列表
  return request({
    url: "/wtess/component/page",
    method: "post",
    data: obj
  });
}

export function getTemplate(obj) {
  //电子合同模板列表
  return request({
    url: "/wtess/template/page",
    method: "post",
    params: obj
  });
}

export function getTemplateProduct(obj) {
  //可关联产品列表
  return request({
    url: "/wtprod/category/list",
    method: "get",
    params: obj
  });
}

export function getList(obj) {
  //产品列表
  return request({
    url: "wtprod/spu/pageSimpleSpu",
    method: "post",
    data: obj
  });
}

export function addTemplate(obj, operate) {
  //添加/编辑电子合同模板
  return request({
    url: operate ? "/wtess/template/mod" : "/wtess/template/add",
    method: operate ? "put" : "post",
    data: obj
  });
}

export function toTemplate(obj) {
  //合同模板编辑
  return request({
    url: "/wtess/template/edit",
    method: "put",
    data: obj
  });
}

export function getCategory(obj) {
  //查询产品类型
  return request({
    url: "/wtprod/category/tree",
    method: "post",
    data: obj
  });
}

export function getProductList(obj) {
  //根据产品类型查询产品列表
  return request({
    url: "/wtprod/product/pageByCategoryId",
    method: "get",
    params: obj
  });
}

export function changeMod(obj) {
  //修改关联模板
  return request({
    url: "/wtess/product/mod",
    method: "post",
    data: obj
  });
}

export function del(obj) {
  //删除电子合同模板
  return request({
    url: "/wtess/template/del",
    method: "delete",
    data: obj
  });
}

export function getDetail(obj) {
  //电子合同模板详情
  return request({
    url: "/wtess/template/get",
    method: "get",
    params: obj
  });
}

export function updateNote(obj) {
  //编辑合同备注
  return request({
    // url: '/wtcrm/wtcontract/editContractNote',
    url: "/wtess/contract/remark",
    method: "post",
    data: obj
  });
}

export function modTemplateBatch(obj) {
  //添加关联
  return request({
    url: "/wtprod/spu/modTemplateBatch",
    method: "put",
    data: obj
  });
}

// 获取合同模板签署方列表
export function getSignatory() {
  return request({
    url: "/wtess/template/listServiceSign",
    method: "get"
  });
}

// 根据模板ID获取控件
export function getTemplateWidget(obj) {
  return request({
    url: "/wtess/component/getComponentParamByMyTemplateId",
    method: "get",
    params: obj
  });
}

// 获取参数列表
export function getParamsList() {
  return request({
    url: "/wtess/component/listTemplateParam",
    method: "get"
  });
}

// 保存控件与参数的映射关系
export function saveMapping(obj) {
  return request({
    url: "/wtess/component/saveOrUpdateComponentParamMapping",
    method: "post",
    data: obj
  });
}

// 更新模板控件信息
export function updateTemplateControl(obj) {
  return request({
    url: "/wtess/component/syncTemplateComponent",
    method: "get",
    params: obj
  });
}

// 纸质合同列表数据导出
export function dataExportPaper(obj) {
  return request({
    url: "/wtess/paperContract/exportExcel",
    method: "post",
    data: obj,
    responseType: "blob"
  });
}

// 纸质合同列表数据导出进度条
export function dataExportPaperProgress() {
  return request({
    url: "/wtess/paperContract/exportExcelProgress",
    method: "get"
  });
}

// 电子合同列表数据导出
export function dataEleExport(obj) {
  return request({
    url: "/wtess/contract/exportExcel",
    method: "post",
    data: obj,
    responseType: "blob"
  });
}

// 电子合同列表数据导出进度条
export function dataEleProgress() {
  return request({
    url: "/wtess/contract/exportExcelProgress",
    method: "get"
  });
}

export function updateContractNote(str, obj) {
  //编辑合同备注
  return request({
    url: str =='paper' ? '/wtess/paperContract/remark':'/wtess/contract/remark',
    method: "post",
    data: obj
  });
}