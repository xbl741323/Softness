import request from '@/plugins/request'

//分页查询卧涛文档订单信息
export function fileOrderList(data) {
  return request({
    url: '/tmFileOrder/innerPageTmFileOrder',
    method: 'post',
    data: data
  });
};

//根据id，获取订单详情信息
export function getDetailInfoById(id) {
  return request({
    url: '/tmFileOrder/innerGetDetailInfoById/'+id,
    method: 'get',
  });
};

//获取待支付订单数量
export function getMyWaitPayCount(data) {
  return request({
    url: '/tmFileOrder/getMyWaitPayCountForFront',
    method: 'get',
    params: data
  });
};

//根据id，取消订单
export function cancelFileOrder(id) {
  return request({
    url: `/tmFileOrder/cancelOrder/${id}`,
    method: 'put',
  });
};

//根据id，删除订单
export function deleteFileOrder(id) {
  return request({
    url: `/tmFileOrder/deleteOrder/${id}`,
    method: 'put',
  });
};