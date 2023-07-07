import request from "axios";

export function getConsult(obj) {
  return request({
    url: "wtcrm/consult/page",
    method: "GET",
    params: obj
  });
}

export function postReply(params) {
  return request({
    url: "/wtcrm/consult/getReplay",
    method: "post",
    data: params
  });
}

export function editReply(params) {
  return request({
    url: "/wtcrm/consult/getEditReply",
    method: "post",
    data: params
  });
}

export function getServices() {
  return request({
    url: "/wtcrm/cycli/getAllCustomer",
    method: "get"
  });
}

export function allotSingleService(params) {
  return request({
    url: "/wtcrm/consult/getService",
    method: "post",
    data: params
  });
}

export function batchService(params) {
  return request({
    url: "/wtcrm/consult/getServices/" + params.ids + "/" + params.service,
    method: "put"
  });
}
