// 排查完成
import request from 'axios'

// 关联支付记录 type: 1：产品订单 3：会员订单 2：课程订单
export function getPayRecords(type, params) {
	let url = type == 1 ? '/wtorder/orderPayment/pagePaymentRecord' : type == 3 ? '/wttalk/vipOrderPayment/pagePaymentRecord' : '/wttalk/courseOrderPayment/pagePaymentRecord'
	return request({
		url: url,
		method: 'post',
		data: params
	})
}

// 回款支付记录 type: 1：产品订单 2：会员订单 3：课程订单
export function getReceivePayRecords(type, params) {
	let url = type == 1 ? '/wtorder/orderPayment/pagePaymentRecord' : type == 2 ? '/wttalk/vipOrderPayment/pagePaymentRecord' : '/wttalk/courseOrderPayment/pagePaymentRecord'
	return request({
		url: url,
		method: 'post',
		data: params
	})
}

// 支付记录-待领取数量 type: 1：产品订单 2：会员订单 3：课程订单 （数字仅用作接口调用判断）
export function getUnclaimedCount(type) {
	let url = type == 1 ? '/wtorder/orderPayment/statisticsPaymentRecordNum' : type == 2 ? '/wttalk/vipOrderPayment/statisticsVipOrderNum' : '/wttalk/courseOrderPayment/statisticsCourseOrderNum'
	return request({
		url: url,
		method: 'get',
	})
}

// 回款明细列表
export function getReceiveList(params) {
	return request({
		url: '/wtorder/receive/pageReceive',
		method: 'post',
		data: params
	})
}

// 回款明细列表数据统计
export function getReceiveStatistics(params) {
	return request({
		url: '/wtorder/receive/statisticsReceive',
		method: 'post',
		data: params
	})
}

// 我的回款列表
export function getMyReceiveList(params) {
	return request({
		url: '/wtorder/receive/pageReceiveOfMine',
		method: 'post',
		data: params
	})
}

// 获取回款导出数据（有问题）
export function getReceiveExportData(params) {
	return request(
		Object.assign(
      {
        url: '/wtcrm/personal/receive/export',
        method: 'get',
        params: params
      },
      { responseType: 'blob' } 
    )
	)
}

// 认领回款操作
export function saveReceivePayment(params) {
	return request({
		url: '/wtorder/trReceivePayment/saveTrReceivePayment',
		method: 'post',
		data: params
	})
}

// 撤销回款
export function cancelReceive(params) {
	return request({
		url: '/wtorder/trReceivePayment/cancelClaim',
		method: 'post',
		data: params
	})
}

// 获取回款明细待认领数量统计数据
export function getReceiveDetailStatistics() {
  return request({
    url: '/wtcrm/receive/statusStatistical',
    method: 'post',
  })
}

// 获取订单任务开启状态
export function getOrderTaskStatus(orderId) {
  return request({
    url: '/wtorder/tmTaskOpen/tmTaskOpenStatusSure/'+orderId,
    method: 'get',
  })
}








