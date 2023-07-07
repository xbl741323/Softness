
import request from '~/utils/request'
export function getCommonDetail(type, id) {
  let url = ""
  // 1:gs工商 2:rz融资 3:fl法律 4:cs财税 
  switch (Number(type)) {
    case 1:
      url = '/pagehome/gsdetails/' + id
      break;
    case 2:
      url = '/pagehome/rzdetails/' + id
      break;
    case 3:
      url = '/pagehome/fldetails/' + id
      break;
    case 4:
      url = '/pagehome/csdetails/' + id
      break;
    case 6:
      url = '/pagehome/getSoftwareDevDetail/' + id
      break;
  }
  return request({
    url: url,
    method: 'get'
  })
}

export function getCommonList(type) {
  let url = ""
  // 1:gs工商 2:rz融资 3:fl法律 4:cs财税 
  switch (Number(type)) {
    case 1:
      url = '/pagehome/list'
      break;
    case 2:
      url = '/pagehome/rzList'
      break;
    case 3:
      url = '/pagehome/flList'
      break;
    case 4:
      url = '/pagehome/csList'
      break;
    case 6:
      url = '/pagehome/getSoftwareDevSecondPageList'
      break;
  }
  return request({
    url: url,
    method: 'post'
  })
}

/*
* 后端实际需要type对应值
* 1 工商
* 2 财税
* 3 融资
* 4 法律
*/
export function addCommonView(type, id) {
  let url = ""
  //前端仅供判断值 1:gs工商 2:rz融资 3:fl法律 4:cs财税 
  switch (Number(type)) {
    case 1:
      url = '/pagehome/addPageView/' + id + '/' + 1
      break;
    case 2:
      url = '/pagehome/addPageView/' + id + '/' + 3
      break;
    case 3:
      url = '/pagehome/addPageView/' + id + '/' + 4
      break;
    case 4:
      url = '/pagehome/addPageView/' + id + '/' + 2
      break;
    case 6:
      url = '/pagehome/addPageView/' + id + '/' + 6
      break;
  }
  return request({
    url: url,
    method: 'get'
  })
}