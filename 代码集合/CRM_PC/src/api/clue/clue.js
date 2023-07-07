import request from "axios";
import { filterPort } from "../../util/filtration_permission";
export function getOrderList(obj) {
  //获取订单列表
  return request({
    url: "/wtorder/tmOrder/pageContractOrder",
    method: "post",
    data: obj
  });
}

export function getClueDetail(obj) {
  //线索详情
  return request({
    url: "/wtcrm/wtclueaccount",
    method: "get",
    params: obj
  });
}

export function getClueRecords(obj, isCustomer) {
  //线索维护记录
  return request({
    //isCustomer true-成交客户  false-线索
    url: isCustomer
      ? "/wtcrm/clueFollow/listClueFollowByUserId"
      : "/wtcrm/clueFollow/listClueFollowByClueId",
    method: "post",
    data: obj
  });
}

export function getClueLabel(number) {
  //线索标签
  return request({
    url: "/wtcrm/drop/" + number,
    method: "get"
  });
}
export function getUnitType(number) {
  //单位类型
  return request({
    url: "/wtcrm/drop/" + number,
    method: "get"
  });
}
export function getIndustryType(number) {
  //行业类型
  return request({
    url: "/wtcrm/drop/" + number,
    method: "get"
  });
}
export function getLastYearsSales(number) {
  //销售额
  return request({
    url: "/wtcrm/drop/" + number,
    method: "get"
  });
}

export function getUnitNumber(number) {
  //单位人数
  return request({
    url: "/wtcrm/drop/" + number,
    method: "get"
  });
}

export function getAreaTree() {
  //地区列表
  return request({
    url: "/wtcrm/area/tree",
    method: "get"
  });
}

export function addNewClue(obj, type) {
  //新增线索用户
  if (type) {
    return request({
      url: "/wtcrm/wtclueaccount",
      method: "put",
      data: obj
    });
  } else {
    return request({
      url: "/wtcrm/wtclueaccount",
      method: "post",
      data: obj
    });
  }
}

export function getArea() {
  //获取地区
  return request({
    url: "/wtcrm/area/treeAndAll",
    method: "get"
  });
}

export function getEmpList(val) {
  //新增线索用户
  return request({
    url: "/admin/user/allByDept?query=" + val,
    method: "get"
  });
}

/* 内部人员+合作机构人员 */
export function allByDeptAndPartnerDept(val) {
  return request({
    url: '/admin/user/allByDeptAndPartnerDept',
    method: "get"
  });
}

export function getCustomerList() {
  //获取客服选框
  return request({
    url: "/wtcrm/cycli/getAllCustomer",
    method: "get"
  });
}

export function clueValidate(obj) {
  //新增线索单位、手机号查重
  return request({
    url: "/wtcrm/wtclueaccount/validate",
    method: "post",
    data: obj
  });
}

export function getfollowTypy(id) {
  //线索跟进方式下拉框
  return request({
    url: "/wtcrm/drop/" + id,
    method: "get"
  });
}

export function getClueContactByClueTypeAndId(obj) {
  //业绩统计回访弹框获取用户信息
  return request({
    url: "/wtcrm/clueFollow/getClueContactByClueTypeAndId",
    method: "get",
    params: obj
  });
}

export function clueAllot(obj) {
  //我的客户详情线索列表分配操作
  return request({
    url: "/wtcrm/PersonalClueaccountemp/clueAllot",
    method: "post",
    data: obj
  });
}

export function clueListAllot(obj) {
  //客户列表详情分配操作
  return request({
    url: "/wtcrm/wtclueaccountemp/clueAllot",
    method: "post",
    data: obj
  });
}

export function followClue(obj, type) {
  //线索跟进 type-1跟进 0编辑
  if (type == 0) {
    console.log(obj);
    return request({
      url: "/wtcrm/clueFollow/modClueFollow",
      method: "post",
      data: obj,
      headers: { "Content-Type": "application/json" }
    });
  } else {
    return request({
      url: "/wtcrm/wtclueaccountacitvity",
      method: "post",
      data: obj
    });
  }
}

export function getProductList(obj) {
  //录入合同产品列表
  return request({
    url: "/wtcrm/product/page",
    method: "get",
    params: obj
  });
}

export function getClueEditRecords(obj) {
  //最新线索维护记录-编辑记录
  return request({
    url: "/admin/opLog/page",
    method: "post",
    data: obj
  });
}

//业绩统计维护记录客户回访
export function pageClueReturnVisit(obj) {
  return request({
    url: "/wtcrm/return/pageClueReturnVisit",
    method: "post",
    data: obj
  });
}

export function changeClue(obj, clueType, type) {
  if (type == 0) {
    //换绑接口
    return request({
      url:
        clueType == 1
          ? "/wtcrm/transactionCompany/bindCompanyClueOfMy"
          : "/wtcrm/transactionPerson/bindPersonClueOfMy",
      method: "post",
      data: obj
    });
  } else {
    //换绑接口
    return request({
      url:
        clueType == 1
          ? "/wtcrm/transactionCompany/bindCompanyClue"
          : "/wtcrm/transactionPerson/bindPersonClue",
      method: "post",
      data: obj
    });
  }
}

export function batchInput(obj) {
  //批量创建线索
  return request({
    url: "/wtcrm/wtclueaccount/batchImport",
    method: "put",
    data: obj
  });
}

export function getOneEmp() {
  //合同提交审核-审核人
  return request({
    url: "/wtcrm/permission/getexamine",
    method: "get"
  });
}

export function updateUserInfo(obj) {
  //修改客户信息
  return request({
    url: "/wtcrm/wtclueaccount/updateCfoName",
    method: "post",
    data: obj
  });
}

export function checkCode(val, id) {
  //信用代码查重
  return request({
    url: "/wtcrm/personal/clueaccount/checkCreditCode/" + val + "/" + id,
    method: "put"
  });
}

export function getClueRegister(id, index, type) {
  //查询注册信息
  if (type == 1) {
    return request({
      url:
        "/wtcrm/wtclueaccount/getRegistrInfoPopup?clueId=" +
        id +
        "&one=" +
        index +
        "&pwd=pwd" +
        "&creditCode=" +
        true,
      method: "get"
    });
  } else {
    return request({
      url:
        "/wtcrm/wtclueaccount/getRegistrInfoPopup?clueId=" +
        id +
        "&one=" +
        index +
        "&pwd=my" +
        "&creditCode=" +
        false,
      method: "get"
    });
  }
}

export function selectContractOrder(params) {
  //新增合同查询线上订单
  return request({
    url: "/wtorder/order/selectContractOrder",
    method: "post",
    data: params
  });
}

// 订单数据导出
export function dataExport(obj, joint) {
  if (joint) {
    return request({
      url: filterPort(1, joint, '/wtorder/tmOrder/exportExcel', -11),
      method: "post",
      data: obj,
      responseType: "blob"
    });
  } else {
    return request({
      url: "/wtorder/tmOrder/exportExcel",
      method: "post",
      data: obj,
      responseType: "blob"
    });
  }
}

// 订单数据导出进度条
export function dataExportProgress(joint) {
  if (joint) {
    return request({
      url: filterPort(1, joint, '/wtorder/tmOrder/exportExcelProgress', -19),
      method: "get"
    });
  } else {
    return request({
      url: "/wtorder/tmOrder/exportExcelProgress",
      method: "get"
    });
  }
}

/* 通过线索id和年份查询单位财务数据 */
export function getTtClueCompanyUnit(params) {
  let url = params.listType == 'personal' ? '/wtcrm/transactionCompany/getMyTtClueCompanyUnit' : '/wtcrm/transactionCompany/getTtClueCompanyUnit';
  return request({
    url: url,
    method: 'get',
    params
  })
}
